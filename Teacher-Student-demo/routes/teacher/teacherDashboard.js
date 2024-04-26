import express from 'express';
import { dashBoard, deleteOwnAccount, resetPassword } from '../../controllers/teacher/teacherController.js';
import { validateData } from '../../middleware/dataValidator.js';
import { resetPasswordValidator } from '../../validator/authenticationValidator.js';
const teacherDashboard = express.Router();

teacherDashboard.get("/" , dashBoard);
teacherDashboard.delete("/deleteOwnAccount" ,deleteOwnAccount)
teacherDashboard.patch("/reset-password" , validateData(resetPasswordValidator) , resetPassword);


export default teacherDashboard;
