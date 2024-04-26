import express from 'express';
import { verifyToken } from '../../middleware/verifyToken.js';
import studentAuth from './studentAuthentication.js';
import studentDashboard from './studentDashBoard.js';
import examStudentRouter from './studentExam.js';

const studentRouter = express.Router();


studentRouter.use("/auth", studentAuth);
studentRouter.use("/exam", verifyToken(['student']), examStudentRouter)
studentRouter.use("/dashboard", verifyToken(['student']), studentDashboard);


export default studentRouter;
