import express from 'express';
import { createExam, createQuestion, deleteExam, deleteQuestion, updateExam, updateQuestion } from '../../controllers/teacher/teacherController.js';
import { examUpdateTimeValid } from '../../middleware/examTimeValid.js';
import { validateData } from '../../middleware/dataValidator.js';
import { createExamValidator, createQuestionValidator, deleteExamValidator, deleteQuestionValidator, updateExamValidator, updateQuestionValidator } from '../../validator/teacherValidator.js';
// import { createExam } from '../../controllers/teacher/teacherController.js';
const examTeacherRouter = express.Router();

examTeacherRouter.patch("/create", validateData(createExamValidator),  createExam)
examTeacherRouter.patch("/update" , validateData(updateExamValidator), examUpdateTimeValid,  updateExam)
examTeacherRouter.patch("/delete" ,validateData(deleteExamValidator) , examUpdateTimeValid,  deleteExam)
examTeacherRouter.patch("/create-question" , validateData(createQuestionValidator), examUpdateTimeValid, createQuestion)
examTeacherRouter.patch("/update-question" , validateData(updateQuestionValidator), examUpdateTimeValid, updateQuestion)
examTeacherRouter.patch("/delete-question" ,validateData(deleteQuestionValidator),examUpdateTimeValid, deleteQuestion)

export default examTeacherRouter;
