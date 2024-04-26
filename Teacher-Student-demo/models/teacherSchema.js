import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    contact: {
        type: Number
    },
    exam: [{
        subject: String,
        examName: String,
        startTime: Date,
        endTime: Date,
        questionPaper: [{
            question: {
                type: String,
                require: true
            },
            options: [
                {
                    text: {
                        type: String,
                        required: true
                    },
                    isCorrect: {
                        type: Boolean,
                        required: true,
                        default: false
                    }
                }
            ]
        }],
        studentDetails: [
            {
                examSubmitTime : Date,
                studentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Student"
                },
                score: Number,
                isScoreSend : {
                    type: Boolean,
                    required: true,
                    default: false
                },
                isRankSend :{
                    type: Boolean,
                    required: true,
                    default: false
                }
            }
        ]
    },
    ],
    role: String,
    otp: {
        type: Number,
        default: 0,
    },
    otpExpiration: Date,
    isVerify: {
        type: Boolean,
        default: false
    }


})

export const teacherModel = mongoose.model('Teacher', teacherSchema)
