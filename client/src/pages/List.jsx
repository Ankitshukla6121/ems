import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Function to delete an employee
  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/delete/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        // Remove deleted employee from state
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        toast.success('Employee deleted successfully.');
        
      } else {
        alert('Failed to delete employee.');
      }
    } catch (error) {
     
      toast.error(error.message)
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/employee/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setEmployees(data.employees);
        } else {
          console.error('Failed to fetch employees');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [token]);

  
  const filteredEmployees = employees.filter((emp) =>
    emp.f_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  };

  return (
    <div className='p-4'>
     
      <div className='flex justify-between items-center mt-2 mb-4'>
        <div>Total Count: {filteredEmployees.length}</div>
        <button
          className='bg-green-300 px-3 py-1 rounded cursor-pointer'
          onClick={() => navigate('/list/create',{token})}
        >
          Create Employee
        </button>
        <div className='flex items-center space-x-2'>
          <label>Search</label>
          <input
            type='text'
            placeholder='Enter Search Keyword'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border px-2 py-1 rounded'
          />
        </div>
      </div>

      {/* Table */}
      <table className='min-w-full border border-gray-300'>
        <thead className='bg-blue-100'>
          <tr>
            <th className='border px-2 py-1'>Unique Id</th>
            <th className='border px-2 py-1'>Image</th>
            <th className='border px-2 py-1'>Name</th>
            <th className='border px-2 py-1'>Email</th>
            <th className='border px-2 py-1'>Mobile No</th>
            <th className='border px-2 py-1'>Designation</th>
            <th className='border px-2 py-1'>Gender</th>
            <th className='border px-2 py-1'>Course</th>
            <th className='border px-2 py-1'>Create Date</th>
            <th className='border px-2 py-1'>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp, index) => (
            <tr key={index}>
              <td className='border px-2 py-1'>{emp.f_Id}</td>
              <td className='border px-2 py-1'>
                <img
                  src={emp.f_Image?.data || '/default-profile.png'}
                  alt={emp.f_Name}
                  className='w-10 h-10 rounded-full object-cover'
                />
              </td>
              <td className='border px-2 py-1'>{emp.f_Name}</td>
              <td className='border px-2 py-1'>
                <a
                  href={`mailto:${emp.f_Email}`}
                  className='text-blue-500 underline'
                >
                  {emp.f_Email}
                </a>
              </td>
              <td className='border px-2 py-1'>{emp.f_Mobile}</td>
              <td className='border px-2 py-1'>{emp.f_Designation}</td>
              <td className='border px-2 py-1'>{emp.f_gender}</td>
              <td className='border px-2 py-1'>
                {emp.f_Course.join(', ')}
              </td>
              <td className='border px-2 py-1'>
                {formatDate(emp.createdAt)}
              </td>
              <td className='border px-2 py-1'>
                <button
                  className='text-blue-600 mr-2 cursor-pointer'
                  onClick={() => navigate(`/list/edit/${emp._id}`)}
                >
                  Edit
                </button>
                <button
                  className='text-red-600 cursor-pointer'
                  onClick={() => deleteEmployee(emp._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
