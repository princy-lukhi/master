import express from 'express';
import { verifyToken } from '../../middleware/verifyToken.js';
import teacherAuth from './teacherAuthentication.js';
import teacherDashboard from './teacherDashboard.js';
import examTeacherRouter from './teacherExam.js';
const teacherRouter = express.Router();

teacherRouter.use("/auth" , teacherAuth);  
teacherRouter.use("/exam" , verifyToken(['teacher']), examTeacherRouter );
teacherRouter.use("/dashboard", verifyToken(['teacher']), teacherDashboard);

export default teacherRouter;
