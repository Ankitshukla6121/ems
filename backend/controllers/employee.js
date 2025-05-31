import Employee from '../models/employee.js';
import { v2 as cloudinary } from 'cloudinary';

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
    const file = req.file;

    // Server-side validations
    if (!f_Name || !f_Email || !f_Mobile || !f_Designation || !file) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(f_Email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    // Validate mobile number
    if (!/^[0-9]+$/.test(f_Mobile)) {
      return res.status(400).json({ success: false, message: "Mobile number must be numeric." });
    }

    // Check for duplicate email
    const existingEmployee = await Employee.findOne({ f_Email });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'image',
      folder: 'employee_profiles'
    });

    const newEmp = new Employee({
      f_Id: Date.now().toString(),
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_gender,
      f_Course: typeof f_Course === "string" ? JSON.parse(f_Course) : f_Course || [],
      f_Image: {
        data: result.secure_url,
        contentType: file.mimetype
      }
    });

    await newEmp.save();

    res.status(201).json({ success: true, message: 'Employee created successfully', employee: newEmp });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get All Employees
export const getEmployees = async (req, res) => {
  try {
    const keyword = req.query.search || "";
    const employees = await Employee.find({
      f_Name: { $regex: keyword, $options: 'i' }
    });
    res.json({ success: true, employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, employee: emp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Employee
export const updateEmployee = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;

    if (!f_Name) {
      return res.status(400).json({ success: false, message: "f_Name is required" });
    }

    let courses = [];
    if (f_Course) {
      if (typeof f_Course === 'string') {
        try {
          courses = JSON.parse(f_Course);
        } catch (parseError) {
          console.error('Error parsing f_Course:', parseError);
          return res.status(400).json({ success: false, message: 'Invalid format for f_Course' });
        }
      } else {
        courses = f_Course;
      }
    }

    const updateData = {
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_gender,
      f_Course: courses,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        folder: 'employee_profiles'
      });
      updateData.f_Image = {
        data: result.secure_url,
        contentType: req.file.mimetype,
      };
    }

    const emp = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!emp) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, employee: emp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

