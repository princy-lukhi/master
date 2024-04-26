import express from 'express';
import { giveExam, showQuestionPaper } from '../../controllers/student/studentController.js';
import { examGivenTimeValid } from '../../middleware/examTimeValid.js';
import { validateData } from '../../middleware/dataValidator.js';
import { giveExamValidator, showQuestionPaperValidator } from '../../validator/studentValidator.js';
const examStudentRouter = express.Router();

examStudentRouter.post("/showQuestionPaper" , validateData(showQuestionPaperValidator), examGivenTimeValid , showQuestionPaper);
examStudentRouter.post("/giveExam" ,validateData(giveExamValidator) ,  examGivenTimeValid, giveExam);


export default examStudentRouter;
