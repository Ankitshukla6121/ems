 import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import cors from "cors";
import authRoutes from './routes/auth.js'
import employeeRoutes from './routes/employeeRoutes.js'
import connectCloundinay from './config/cloudinary.js';
dotenv.config();
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the API!'); 
});


connectDB();
connectCloundinay();

// middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);

app.use('/api',employeeRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 