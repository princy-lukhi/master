
import cron from 'node-cron'
import { sendMail } from './sendEmail.js';
import { teacherModel } from '../models/teacherSchema.js';
import { studentModel } from '../models/studentSchema.js';

export const cronForSendMailToStudent = () => {

    cron.schedule(`10 * * * *`, async () => {
        console.log("cron start");
        const scoreSendTime = await teacherModel.aggregate([
            {
                $unwind: "$exam"
            },
            {
                $unwind: "$exam.studentDetails"
            },
            {
                $setWindowFields: {
                    partitionBy: "exam.studentDetails.studentId",
                    sortBy: { "exam.studentDetails.score": -1 },
                    output: {
                        Rank: {
                            $denseRank: {}
                        }
                    }
                }
            },
            {
                $project: {
                    exam: {
                        subject: 1,
                        examName: 1,
                        endTime: 1,
                        questionPaper: 1,
                        studentDetails: {
                            examSubmitTime: 1,
                            studentId: 1,
                            score: 1,
                            isScoreSend: 1,
                            isRankSend: 1,
                            rank: "$Rank"
                        }
                    }
                }
            }

        ])
        scoreSendTime.forEach(async (value, index) => {

            const { subject, examName, endTime, questionPaper, studentDetails } = value.exam
            const { examSubmitTime, studentId, score, rank, isScoreSend, isRankSend } = studentDetails
            const currentTime = new Date().getTime() + (5.5 * 60 * 60 * 1000)


            // send score at after 2 hours of  exam Submit time 
            if (examSubmitTime) {
                const scoreSendTime = examSubmitTime.getTime() + 2 * 60 * 60 * 1000

                if (currentTime >= scoreSendTime) {

                    const getStudentDetails = await studentModel.findOne({ _id: studentId }, { email: 1 })

                    console.log('getStudentDetails.email, score, subject, questionPaper.length, examName :>> ', getStudentDetails.email, getStudentDetails._id, score, subject, questionPaper.length, examName);
                    if (!isScoreSend) {
                        await sendMail(getStudentDetails.email, `Your score of  ${subject} subject in  ${examName}`,  `score : ${score} / ${questionPaper.length}`)

                        const setIsScoreSend = await teacherModel.updateMany(
                            {},
                            { $set: { 'exam.$[].studentDetails.$[studentElem].isScoreSend': true } },
                            { arrayFilters: [{ "studentElem.studentId": studentId }] }
                        )
                        await studentModel.updateOne(
                            {
                                _id: getStudentDetails._id
                            },
                            {
                                $push: {
                                    marks: { teacherId: value._id, subject: subject, test: examName, score: score, rank: rank }
                                }
                            }
                        )
                    }

                }
            }


            // send rank at end time of exam
            const rankSendTime = endTime.getTime()
            if (currentTime >= rankSendTime) {

                const getStudentDetails = await studentModel.findOne({ _id: studentId }, { email: 1 })

                if (!isRankSend) {
                    await sendMail(getStudentDetails.email,`Your rank in  ${examName} of  subject ${subject}` , `rank : ${rank}`)
                    const setIsRankSend = await teacherModel.updateMany(
                        {},
                        { $set: { 'exam.$[].studentDetails.$[studentElem].isRankSend': true } },
                        { arrayFilters: [{ "studentElem.studentId": studentId }] }
                    )
                }
                 
            }
        })
        console.log("cron end");
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
}