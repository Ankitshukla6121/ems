 import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  f_Id: {
    type: String,
    required: true,
    unique: true,
  },
  f_Image: {
  data: String,
  contentType: String
},
  f_Name: {
    type: String,
    
    required: true,
   
  },
  f_Email: {
    type: String,
    required: true,
    unique: true,
   
    lowercase: true,
  },
  f_Mobile: {
    type: String,
    
    required: true,
    maxLength: 10,
  },
  f_Designation: {
    type: String,
    
    required: true,
   
  },
  f_gender: {
    type: String,
    
    required: true,
    
  },
  f_Course: {
    type:[String], // multiple courses from checkboxes
    required: true,
   
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
