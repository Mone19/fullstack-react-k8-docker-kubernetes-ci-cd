import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();




mongoose
.connect(process.env.MONGO)
.then(() => {
  console.log('connected to db');
}).catch((err) => {
  console.log(err);
});

const app = express()

const corsOptions = {
  origin: 'https://www.aiq-blog.de',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const server = app.listen(4001, () => {
  console.log('server running on port 4001!')
});


app.use('/api/user', userRoutes);


app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});
export { app, server };