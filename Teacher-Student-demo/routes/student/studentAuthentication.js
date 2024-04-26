import express from 'express';
import { forgotPassword, forgotPasswordLink, resendOtp, signIn, signUp, verifyOtp } from '../../controllers/student/studentAuthentication.js';
import { validateData} from '../../middleware/dataValidator.js';
import { emailValidator, forgotPasswordValidator, SignInValidator, studentSignUpValidator, verifyOtpValidator } from '../../validator/authenticationValidator.js';
const studentAuth = express.Router();

studentAuth.post("/sign-up" ,validateData(studentSignUpValidator), signUp);
studentAuth.post("/resend-otp" , validateData(emailValidator) , resendOtp);
studentAuth.post("/verify-otp" ,  validateData(verifyOtpValidator) , verifyOtp);
studentAuth.post("/sign-in" , validateData(SignInValidator), signIn);
studentAuth.post("/forgot-password-link", validateData(emailValidator), forgotPasswordLink);
studentAuth.patch("/forgot-password/:token" ,validateData(forgotPasswordValidator), forgotPassword);


export default studentAuth;
