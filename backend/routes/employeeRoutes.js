import express from 'express';
import { createEmployee, getEmployees, updateEmployee, deleteEmployee , getEmployeeById} from '../controllers/employee.js';
import { adminAuth } from '../middleware/adminSignIn.js';
import upload from '../middleware/multer.js';
const router = express.Router();


router.post('/employee/create', adminAuth, upload.single('f_Image'), createEmployee);
router.get('/employee/list', adminAuth, getEmployees);
router.put('/employee/update/:id', adminAuth,upload.single('f_Image'), updateEmployee);
router.delete('/employee/delete/:id', adminAuth, deleteEmployee);
router.get('/employee/list/:id',adminAuth,getEmployeeById)

export default router;
