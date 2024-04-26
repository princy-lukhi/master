
import { teacherModel } from '../../models/teacherSchema.js';
import { studentModel } from '../../models/studentSchema.js';
import { cronForSendMailToStudent } from '../../utils/cronForSendMail.js';



export const showQuestionPaper = async (req, res) => {
    try {
        const { teacherId, examId } = req.body
        const questionPaper = await teacherModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ['$_id', { $toObjectId: teacherId }] },
                }
            },
            {
                $unwind: "$exam"
            },
            {
                $match: {
                    $expr: { $eq: ['$exam._id', { $toObjectId: examId }] },
                }
            },
            {
                $project: {
                    "exam.questionPaper": {
                        question: 1,
                        _id: 1,
                        options: { text: 1, _id: 1 }
                    }
                }
            }
        ])
        if (questionPaper) {
            return res.status(200).json({ status: true, data: questionPaper[0], message: "get question paper successfully" })
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })

    }
}

export const giveExam = async (req, res) => {
    try {
        const { teacherId, examId, answers } = req.body

        const isExamGiven = await teacherModel.findOne({ _id: teacherId, "exam._id": examId, "exam.studentDetails.studentId": req.userId })
        if (isExamGiven) {
            return res.status(422).json({ message: "you already gave exam." })
        }

        const getQuestionPaper = await teacherModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ['$_id', { $toObjectId: teacherId }] }
                }
            },
            {
                $unwind: "$exam"
            },
            {
                $match: {
                    $expr: { $eq: ['$exam._id', { $toObjectId: examId }] }
                }
            },
            {
                $project: {
                    _id: 0,
                    exam: {
                        "questionPaper._id": 1,
                        "questionPaper.options": {
                            _id: 1,
                            isCorrect: 1
                        }
                    },
                    currentTime: { $toDate: { $dateToString: { date: "$$NOW", timezone: "Asia/Kolkata", format: "%Y-%m-%dT%H:%M:%S.%LZ" } } }
                }
            }
        ])

        // get score
        let score = 0;
        getQuestionPaper[0].exam.questionPaper.forEach((value, index) => {
            if (value._id == answers[index]?.questionId) {
                value.options.forEach((optionValue) => {
                    if (optionValue.isCorrect) {
                        if (optionValue._id == answers[index]?.answerId) {
                            score++;
                        }
                    }
                })
            }
        })

        // set score in teacherSchema   
        await teacherModel.findOneAndUpdate(
            {
                _id: teacherId,
                "exam._id": examId
            },
            {
                $push: {
                    "exam.$[elem].studentDetails": { studentId: req.userId, score: score, examSubmitTime: getQuestionPaper[0].currentTime }
                }
            },
            {
                arrayFilters: [{ "elem._id": examId }]
            }
        )

        // send rank and score on student email
        cronForSendMailToStudent()

        return res.status(200).json({ status: true, message: "upload exam successfully" })

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })

    }
}

export const changeTeacher = async (req, res) => {
    try {
        const { teacherId } = req.query
        const { newTeacherId } = req.body

        if (!teacherId) {
            return res.status(422).json({ message: "please enter teacherId  which you want to update in req.query" });
        }
        const isTeacher = await studentModel.findOne({ _id: req.userId, selectedTeacher: teacherId });
        if (!isTeacher) {
            return res.status(422).json({ message: "please enter your selected teacher only" });
        }

        const newTeacherAvailable = await teacherModel.findOne({ _id: newTeacherId })
        if (!newTeacherAvailable) {
            return res.status(422).json({ message: "new teacher not found" });
        }

        const student = await studentModel.findOne({ _id: req.userId });
        if (student.selectedTeacher && student.selectedTeacher.includes(newTeacherId)) {
            return res.status(422).json({ message: "You have already selected this teacher" });
        }

        if (teacherId) {
            const replaceTeacher = await studentModel.updateOne({ _id: req.userId, selectedTeacher: { $in: [teacherId.toString()] } }, { $set: { "selectedTeacher.$": newTeacherId.toString() } })
            return res.status(200).json({ status: true, data: replaceTeacher, message: "replace Teacher successfully" });
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}

export const dashBoard = async (req, res) => {
    try {
        const matchStudentData = await studentModel.findOne({ _id: req.userId })
        if (!matchStudentData) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const studentDetails = await studentModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ['$_id', { $toObjectId: req.userId }] }
                }
            },
            {
                $lookup: {
                    from: "teachers",
                    localField: "selectedTeacher",
                    foreignField: "_id",
                    as: "teacher"
                }
            },
            {
                $unwind: "$teacher"
            },
            {
                $unwind: "$teacher.exam"
            },
            {
                $project: {
                    _id: 0,
                    teacher: {
                        _id: 1,
                        exam: {
                            _id: 1,
                            subject: 1,
                            examName: 1,
                            startTime: 1,
                            endTime: 1

                        }
                    },
                    startDifference: {
                        $dateDiff: {
                            startDate: { $toDate: { $dateToString: { date: "$$NOW", timezone: "Asia/Kolkata", format: "%Y-%m-%dT%H:%M:%S.%LZ" } } },
                            endDate: "$teacher.exam.startTime",
                            unit: "second",
                            timezone: "Asia/Kolkata"
                        }
                    },
                    endDifference: {
                        $dateDiff: {
                            startDate: { $toDate: { $dateToString: { date: "$$NOW", timezone: "Asia/Kolkata", format: "%Y-%m-%dT%H:%M:%S.%LZ" } } },
                            endDate: "$teacher.exam.endTime",
                            unit: "second",
                            timezone: "Asia/Kolkata"
                        }
                    }
                }
            }
        ])
        const examDetails = {
            unComingExam: [],
            completedExam: [],
            currentExam: []
        };

        studentDetails.forEach((value, index) => {
            console.log('value.teacher.exam :>> ', value.teacher.exam);
            if (value.startDifference >= 1) {
                examDetails.unComingExam.push(value.teacher.exam);
            }
            if (value.endDifference <= 1) {
                examDetails.completedExam.push(value.teacher.exam);
            }
            if (value.startDifference <= 1 && value.endDifference >= 1) {
                examDetails.currentExam.push(value.teacher.exam);
            }
        })
        return res.status(200).json({ status: true, data: examDetails, message: "get dashboard successfully" })

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}

export const getAllTeacher = async (req, res) => {
    try {
        const matchStudentData = await studentModel.findOne({ _id: req.userId })
        if (!matchStudentData) {
            return res.status(404).json({ message: "Unauthorized" });
        }
        const getTeacherName = await teacherModel.find({}, { _id: 1, name: 1 })
        return res.status(200).json({ status: true, data: getTeacherName, message: "Get All Teacher Name successfully" })

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}


export const resetPassword = async (req, res) => {
    try {
        const { oldPassword, password, confirmPassword } = req.body

        const validPassword = await bcrypt.compare(oldPassword, teacher.password)
        if (!validPassword) {
            return res.status(404).json({ message: "old password is not correct" })
        }

        const resetPassword = await studentModel.updateOne({ _id: req.userId }, { $set: { "password": await bcrypt.hash(password, 1) } })
        if (resetPassword) {
            return res.status(200).json({ status: true, data: resetPassword, message: "password reset successfully" })
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })

    }
}