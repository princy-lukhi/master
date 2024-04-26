import { teacherModel } from '../../models/teacherSchema.js';


export const createExam = async (req, res, token) => {
    try {
        const { subject, examName, startTime, endTime, questionPaper } = req.body

        const examSubject = await teacherModel.findOne({ _id: req.userId, "exam.subject": subject })
        if (examSubject) {
            return res.status(200).json({ status: true, message: subject + "'s exam is already created." })
        }
        const setExam = await teacherModel.updateOne({ _id: req.userId }, { $push: { exam: req.body } })
        if (setExam) {
            return res.status(200).json({ status: true, data: setExam, message: "create exam successfully" })
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}

export const updateExam = async (req, res) => {
    try {
        const { examName, startTime, endTime } = req.body
        const { examId } = req.query

        const updateExamTime = await teacherModel.updateOne({ _id: req.userId, exam: { $elemMatch: { _id: examId } } }, { $set: { "exam.$.examName": examName, "exam.$.startTime": startTime, "exam.$.endTime": endTime } })
        if (updateExamTime) {
            return res.status(200).json({ status: true, data: updateExamTime, message: "update exam successfully" })
        }

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })

    }
}

export const deleteExam = async (req, res) => {
    try {
        const { examId } = req.query

        const deleteData = await teacherModel.updateOne({ _id: req.userId }, { $pull: { exam: { _id: examId } } })
        if (deleteData) {
            return res.status(200).json({ status: true, data: deleteData, message: "delete exam successfully" })
        }

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })

    }
}

export const createQuestion = async (req, res) => {
    try {
        const { newQuestion } = req.body
        const { examId } = req.query

        const allData = await teacherModel.find({ _id: req.userId, exam: { $elemMatch: { _id: examId } } });
        if (allData.length == 0) {
            return res.status(422).json({ message: "examId not found" })
        }
        let message;
        allData.filter(async (value, index) => {
            if (value.exam[index].questionPaper.length >= 12) {
                message = "Cannot add more than 12 questions";
                return message
            }
        })
        if (message) {
            return res.status(422).json({ message });
        }
        const createQuestion = await teacherModel.updateOne(
            {
                _id: req.userId,
                'exam._id': examId
            },
            {
                $push: { 'exam.$.questionPaper': newQuestion }
            }
        );
        if (createQuestion) {
            return res.status(200).json({ status: true, data: createQuestion, message: "add question successfully" })
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}

export const updateQuestion = async (req, res) => {
    try {
        const updateQuestion = req.body
        const { examId, questionId } = req.query

        const validExamId = await teacherModel.findOne({ _id: req.userId, exam: { $elemMatch: { _id: examId } } })
        if (!validExamId) {
            return res.status(422).json({ message: "examId not found" });
        }

        const validQuestionId = await teacherModel.findOne({ _id: req.userId, exam: { $elemMatch: { _id: examId, questionPaper: { $elemMatch: { _id: questionId } } } } })
        if (!validQuestionId) {
            return res.status(422).json({ message: "questionId not found" });
        }

        const isUpdateQuestion = await teacherModel.updateOne(
            {
                _id: req.userId,
                'exam._id': examId
            },
            {
                $set: {
                    'exam.$.questionPaper.$[elem]': updateQuestion
                }
            },
            {
                arrayFilters: [{ "elem._id": questionId }]
            }
        );

        return res.status(200).json({ status: true, data: isUpdateQuestion, message: "update question successfully" })

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}

export const deleteQuestion = async (req, res) => {

    try {

        const { examId, questionId } = req.query

        const validExamId = await teacherModel.findOne({ _id: req.userId, exam: { $elemMatch: { _id: examId } } })
        if (!validExamId) {
            return res.status(401).json({ message: "exam id not found" });
        }


        const validQuestionId = await teacherModel.findOne({ _id: req.userId, exam: { $elemMatch: { _id: examId, questionPaper: { $elemMatch: { _id: questionId } } } } })
        if (!validQuestionId) {
            return res.status(422).json({ message: "question Id not found" });
        }

        const deleteQuestion = await teacherModel.updateOne(
            { 'exam.questionPaper._id': questionId },
            { $pull: { 'exam.$.questionPaper': { _id: questionId } } },
            { new: true }
        )

        return res.status(200).json({ status: true, data: deleteQuestion, message: "delete question successfully" })
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}

export const dashBoard = async (req, res) => {
    try {
        const showExamDetail = await teacherModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ['$_id', { $toObjectId: req.userId }] },
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "selectedTeacher",
                    as: "student"
                }
            },
            {
                $unwind: "$exam"
            },
            {
                $project: {
                    _id: 0,
                    exam: {
                        subject: 1,
                        examName: 1,
                        startTime: 1,
                        endTime: 1,
                        studentDetails: 1
                    }
                }
            },
            {
                $sort: { "exam.studentDetails.score": -1 }

            }
        ])

        return res.status(200).json({ status: true, data: showExamDetail })
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}

export const deleteOwnAccount = async (req, res) => {
    try {
        const teacher = await teacherModel.deleteOne({ _id: req.userId })
        if (!teacher) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json({ message: "deleted successfully" })

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {oldPassword , password , confirmPassword} = req.body

        const validPassword = await bcrypt.compare(oldPassword, teacher.password)
        if (!validPassword) {
            return res.status(404).json({ message: "old password is not valid" })
        }

        const resetPassword = await teacherModel.updateOne({ _id: req.userId }, { $set: { "password":  await bcrypt.hash(password, 1) } })
        if (resetPassword) {
            return res.status(200).json({ status: true, data: resetPassword, message: "password reset successfully" })
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })

    }
}
