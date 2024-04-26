import { teacherModel } from "../models/teacherSchema.js"
import mongoose from 'mongoose'
import { studentModel } from "../models/studentSchema.js";
const ObjectId = new mongoose.Types.ObjectId;



export const examUpdateTimeValid = async (req, res, next) => {
    try {
        const {examId} = req.query
        const getTeacherId = await teacherModel.findOne({ _id: req.userId })
        if (!getTeacherId) {
            return res.status(400).json({ message: "Unauthorized" })
        }

        const getExamId = await teacherModel.findOne({ _id: req.userId, exam: { $elemMatch: { _id: examId } } })
        if (!getExamId) {
            return res.status(400).json({ message: "exam Id not valid" })
        }

        const getExamTime = await teacherModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ['$_id', { $toObjectId: req.userId }] },
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
                    startDifference: {
                        $dateDiff: {
                            startDate: { $toDate: { $dateToString: { date: "$$NOW", timezone: "Asia/Kolkata", format: "%Y-%m-%dT%H:%M:%S.%LZ" } } },
                            endDate: "$exam.startTime",
                            unit: "second",
                            timezone: "Asia/Kolkata"
                        }
                    },
                    endDifference: {
                        $dateDiff: {
                            startDate: { $toDate: { $dateToString: { date: "$$NOW", timezone: "Asia/Kolkata", format: "%Y-%m-%dT%H:%M:%S.%LZ" } } },
                            endDate: "$exam.endTime",
                            unit: "second",
                            timezone: "Asia/Kolkata"
                        }
                    }
                }
            }
        ])
        if (getExamTime[0].endDifference <= 1) {
            return res.status(200).json({ message: "exam time is out" })
        }
        next()

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })

    }
}

export const examGivenTimeValid = async (req, res, next) => {
    try {
        const { teacherId, examId } = req.body

        const student = await studentModel.findOne({ _id: req.userId })
        if (!student) {
            return res.status(400).json({ message: "Unauthorized" })
        }

        const checkTeacherId = await studentModel.findOne({ _id: req.userId, selectedTeacher: teacherId })
        if (!checkTeacherId) {
            return res.status(400).json({ message: "you can not give exam , teacher id not valid" })
        }

        const isTeacherAvailable = await teacherModel.findOne({ _id: teacherId })
        if (!isTeacherAvailable) {
            return res.status(400).json({ message: "teacher not available" })
        }

        const examIdValid = await teacherModel.findOne({ _id: teacherId, exam: { $elemMatch: { _id: examId } } })
        if (!examIdValid) {
            return res.status(400).json({ message: "examId not valid" })
        }

        const getExamTime = await teacherModel.aggregate([
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
                    startDifference: {
                        $dateDiff: {
                            startDate: { $toDate: { $dateToString: { date: "$$NOW", timezone: "Asia/Kolkata", format: "%Y-%m-%dT%H:%M:%S.%LZ" } } },
                            endDate: "$exam.startTime",
                            unit: "second",
                            timezone: "Asia/Kolkata"
                        }
                    },
                    endDifference: {
                        $dateDiff: {
                            startDate: { $toDate: { $dateToString: { date: "$$NOW", timezone: "Asia/Kolkata", format: "%Y-%m-%dT%H:%M:%S.%LZ" } } },
                            endDate: "$exam.endTime",
                            unit: "second",
                            timezone: "Asia/Kolkata"
                        }
                    }
                }
            }
        ])
        if (getExamTime[0].startDifference >= 1) {
            return res.status(200).json({ message: "Exam has not started yet" })
        }
        if (getExamTime[0].endDifference <= 1) {
            return res.status(200).json({ message: "Exam is over" })
        }
        next()

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })

    }
}