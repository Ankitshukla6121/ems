import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App"; // Adjust as per your structure
import { toast } from "react-toastify";

const EditEmployee = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState([]);
  const [image, setImage] = useState(null);

  // Fetch existing employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/employee/list/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const emp = response.data.employee;
        setName(emp.f_Name || "");
        setEmail(emp.f_Email || "");
        setMobile(emp.f_Mobile || "");
        setDesignation(emp.f_Designation || "");
        setGender(emp.f_gender || "");
        setCourse(emp.f_Course || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch employee details");
      }
    };

    fetchEmployee();
  }, [id, token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("f_Name", name);
      formData.append("f_Email", email);
      formData.append("f_Mobile", mobile);
      formData.append("f_Designation", designation);
      formData.append("f_gender", gender);
      formData.append("f_Course", JSON.stringify(course));
      if (image) {
        formData.append("f_Image", image);
      }

      const response = await axios.put(
        `${backendUrl}/api/employee/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)

      if (response.data.success) {
        toast.success("Employee updated successfully!");
        navigate("/list"); // Navigate back to list or wherever
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee");
    }
  };

  const handleCourseChange = (selectedCourse) => {
    if (course.includes(selectedCourse)) {
      setCourse(course.filter((c) => c !== selectedCourse));
    } else {
      setCourse([...course, selectedCourse]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center bg-yellow-200 p-2 rounded">
        Edit Employee
      </h2>
      <form onSubmit={onSubmitHandler} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter Name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter Email"
          />
        </div>

        {/* Mobile No */}
        <div>
          <label className="block font-medium">Mobile No:</label>
          <input
            type="text"
            name="mobileNo"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter Mobile No"
            required
          />
        </div>

        {/* Designation */}
        <div>
          <label className="block font-medium">Designation:</label>
          <select
            name="designation"
            className="w-full border border-gray-300 p-2 rounded"
            required
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            <option value="">Select</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium">Gender:</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="gender"
                value="M"
                checked={gender === "M"}
                onChange={() => setGender("M")}
              />{" "}
              M
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="F"
                checked={gender === "F"}
                onChange={() => setGender("F")}
              />{" "}
              F
            </label>
          </div>
        </div>

        {/* Course */}
        <div>
          <label className="block font-medium">Course:</label>
          <div className="flex gap-4">
            {["MCA", "BCA", "BSC"].map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  name="course"
                  value={c}
                  checked={course.includes(c)}
                  onChange={() => handleCourseChange(c)}
                />{" "}
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium">Image Upload:</label>
          <input
            type="file"
            name="file"
            accept=".jpg,.png"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <div className="text-xs mt-1 text-gray-500">
            Only upload jpg/png file
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-400 text-white p-2 rounded hover:bg-blue-500 transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
