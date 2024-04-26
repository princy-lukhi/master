import mongoose from 'mongoose'

const oneToOneChatSchema = new mongoose.Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    message: {
        type: String,
    },
    image: [{
        type: String
    }],
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'groupChat'
    }

}, { timestamps: true })

export const oneToOneChatModel = mongoose.model('oneToOneChat', oneToOneChatSchema)

