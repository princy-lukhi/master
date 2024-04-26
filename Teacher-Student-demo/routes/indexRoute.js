import express from 'express';
import teacherRouter from './teacher/teacher.js';
import studentRouter from './student/student.js';
import { oneToOneChatting } from '../controllers/socket/socketController.js';
const IndexRoutes = express.Router();

IndexRoutes.use("/teacher" , teacherRouter);
IndexRoutes.use("/student" , studentRouter);
IndexRoutes.get("/" , oneToOneChatting);


export default IndexRoutes;
