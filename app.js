import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import userRouter from './routes/userRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import imgUploader from './routes/uploadImgRoute.js';
import multer from 'multer';
import productRouter from './routes/productRoute.js';
import AddressRoute from './routes/addressRoute.js';
import orderRoute from './routes/orderRoute.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://your-frontend-domain.vercel.app',
    credentials: true
}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

const storage = multer.memoryStorage();
const upload = multer({ storage });
dotenv.config();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
})

app.use('/auth', userRouter);
app.use('/api', categoryRouter);
app.use('/file', imgUploader);
app.use("/products", productRouter);
app.use("/address", AddressRoute);
app.use("/order", orderRoute)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
});