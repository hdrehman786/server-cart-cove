import expess from 'express';
import { forgotPassword, getUserDetails, loginUser, logoutUser, refreshToken, registerUser, resetPassword, updateUserDetails, uploadProfileImage, verifyEmail, verifyOtp } from '../controllers/usercontroller.js';
import auth from '../midleware/auth.js';
import upload from '../midleware/multer.js';


const userRouter = expess.Router();


userRouter.post('/register', registerUser);
userRouter.post('/verifyemail', verifyEmail);
userRouter.post('/login', loginUser);
userRouter.post('/logout',auth, logoutUser);
userRouter.put('/updateimage', auth, upload.single('image'), uploadProfileImage);
userRouter.put('/updateprofile', auth, updateUserDetails);
userRouter.put('/forgotpassword', forgotPassword);
userRouter.post('/verifyotp', verifyOtp);
userRouter.put('/resetpassword', resetPassword);
userRouter.post('/refreshtoken', refreshToken);
userRouter.get('/getuserdetails',auth,getUserDetails)

export default userRouter;


