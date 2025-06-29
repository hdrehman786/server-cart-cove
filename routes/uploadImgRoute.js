import express from 'express';
import auth from '../midleware/auth.js';
import uploadImageController from '../controllers/uploadimgcontroller.js';
import upload from '../midleware/multer.js';

const imgUploader = express.Router();

imgUploader.post('/imageupload',auth,upload.single('image'),uploadImageController);

export default imgUploader;