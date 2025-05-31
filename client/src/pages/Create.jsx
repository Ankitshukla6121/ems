import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Create = ({ token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("M");
  const [course, setCourse] = useState([]);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobile = (mobile) => {
    const temp = /^[0-9]+$/; 
    return temp.test(mobile);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!name || !email || !mobile || !designation || !image) {
      toast.error("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (!validateMobile(mobile)) {
      toast.error("Mobile number must be numeric.");
      return;
    }

    if (image && !["image/jpeg", "image/png"].includes(image.type)) {
      toast.error("Only .jpg or .png files are allowed.");
      return;
    }

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

      // Check for duplicate email on the server
      const response = await axios.post(
        `${backendUrl}/api/employee/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setName("");
        setEmail("");
        setMobile("");
        setDesignation("");
        setGender("M");
        setCourse([]);
        setImage(null);
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCourse([...course, value]);
    } else {
      setCourse(course.filter((c) => c !== value));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center bg-yellow-200 p-2 rounded">
        Create Employee
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
            required
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
            required
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
                onChange={(e) => setGender(e.target.value)}
              />{" "}
              M
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="F"
                checked={gender === "F"}
                onChange={(e) => setGender(e.target.value)}
              />{" "}
              F
            </label>
          </div>
        </div>

        {/* Course */}
        <div>
          <label className="block font-medium">Course:</label>
          <div className="flex gap-4">
            {["MCA", "BCA", "BSC"].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  name="course"
                  value={item}
                  checked={course.includes(item)}
                  onChange={handleCourseChange}
                />{" "}
                {item}
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
            required
          />
          <div className="text-xs mt-1 text-gray-500">
            Only upload .jpg or .png files
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-green-400 text-white p-2 rounded hover:bg-green-500 transition cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
