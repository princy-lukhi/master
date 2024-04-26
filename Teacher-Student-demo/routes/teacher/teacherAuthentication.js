import express from 'express';
import { forgotPassword, forgotPasswordLink, resendOtp, signIn, signUp, verifyOtp } from '../../controllers/teacher/teacherAuthentication.js';
import { emailValidator, forgotPasswordValidator, SignInValidator, SignUpValidator, verifyOtpValidator } from '../../validator/authenticationValidator.js';
import { validateData } from '../../middleware/dataValidator.js';
const teacherAuth = express.Router();


teacherAuth.post("/sign-up" , validateData(SignUpValidator), signUp);
teacherAuth.post("/resend-otp" , validateData(emailValidator) , resendOtp);
teacherAuth.post("/verify-otp" ,  validateData(verifyOtpValidator) , verifyOtp);
teacherAuth.post("/sign-in" , validateData(SignInValidator), signIn);
teacherAuth.post("/forgot-password-link", validateData(emailValidator), forgotPasswordLink);
teacherAuth.patch("/forgot-password/:token" ,validateData(forgotPasswordValidator), forgotPassword);

export default teacherAuth;
