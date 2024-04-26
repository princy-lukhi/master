import Joi from 'joi'

export const showQuestionPaperValidator = Joi.object({
    teacherId:  Joi.string().hex().length(24).required(),
    examId:  Joi.string().hex().length(24).required()
});

export const giveExamValidator = Joi.object({
    teacherId:  Joi.string().hex().length(24).required(),
    examId:  Joi.string().hex().length(24).required(),
    answers : Joi.array().items(
        Joi.object({
            questionId : Joi.string().hex().length(24),
            answerId : Joi.string().hex().length(24)

        })
    )
});
export const modifyTeacherValidator = Joi.object({
    teacherId : Joi.string().hex().length(24).required(),
    newTeacherId:  Joi.string().hex().length(24).required()
});



