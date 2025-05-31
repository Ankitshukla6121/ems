import express from 'express';
const router = express.Router();



import { adminLogin } from '../controllers/auth.js';



router.post('/admin/login', adminLogin);

export default router;