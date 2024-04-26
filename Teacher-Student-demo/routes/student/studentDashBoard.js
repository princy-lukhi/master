import express from 'express';
import { changeTeacher, dashBoard, getAllTeacher, resetPassword } from '../../controllers/student/studentController.js';
import { validateData } from '../../middleware/dataValidator.js';
import { verifyToken } from '../../middleware/verifyToken.js';
import { resetPasswordValidator } from '../../validator/authenticationValidator.js';
const studentDashboard = express.Router();

studentDashboard.get("/" , dashBoard);
studentDashboard.get("/getAllTeacher" , getAllTeacher);
studentDashboard.patch("/reset-password" , validateData(resetPasswordValidator),  resetPassword);
studentDashboard.patch("/change-teacher", verifyToken('student'), changeTeacher)


export default studentDashboard;
