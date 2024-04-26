import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
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
        type: String
    },
    selectedTeacher: [{ type:   mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    marks: [{
        teacherId: { type:   mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
        examId: {type:   mongoose.Schema.Types.ObjectId},
        score: Number,
        rank: Number
    }],
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

export const studentModel = mongoose.model('Student', studentSchema)

