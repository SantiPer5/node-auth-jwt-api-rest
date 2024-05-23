import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());

//Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

//Hacer una api rest de usuarios

//Usuarios

console.log('Esta esta siendo ejecutado');

export default app;