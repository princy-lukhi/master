import Joi from 'joi'

export const createExamValidator = Joi.object({
    subject: Joi.string().required(),
    examName: Joi.string().required(),
    startTime: Joi.date().greater(Date.now()).message('exam starts date or time invalid (must be greater than current time)').required(),
    endTime: Joi.date().greater(Joi.ref('startTime')).message('exam ends date or time invalid (must be greater than start time)').required(),
    questionPaper: Joi.array().items(
        Joi.object({
            question: Joi.string(),
            options: Joi.array()
        })
    )
})
export const updateExamValidator = Joi.object({
    examId : Joi.string().hex().length(24).required(),
    examName: Joi.string(),
    startTime: Joi.date().greater(Date.now()).message('exam starts date or time invalid (must be greater than current time)'),
    endTime: Joi.date().greater(Joi.ref('startTime')).message('exam ends date or time invalid (must be greater than start time)')
})
export const deleteExamValidator = Joi.object({
    examId : Joi.string().hex().length(24).required()
})

export const createQuestionValidator = Joi.object({
    examId: Joi.string().hex().length(24).required(),
    newQuestion: Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(
            Joi.object({
                text: Joi.string(),
                isCorrect: Joi.boolean()
            })
        ).min(2).max(5).required()
    })
})
export const updateQuestionValidator = Joi.object({
    examId : Joi.string().hex().length(24).required(),
    questionId : Joi.string().hex().length(24).required(),
    question: Joi.string().required(),
    options: Joi.array().items(
        Joi.object({
            text: Joi.string(),
            isCorrect: Joi.boolean()
        })
    ).min(2).max(5).required()
})
export const deleteQuestionValidator = Joi.object({
    examId : Joi.string().hex().length(24).required(),
    questionId : Joi.string().hex().length(24).required()
})


