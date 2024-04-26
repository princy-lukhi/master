import mongoose from 'mongoose'

const groupChatSchema = new mongoose.Schema({
    name: {
        roomId: String,
        groupId: mongoose.Schema.Types.ObjectId
    },
    memberId: [{
        type: String
    }]

}, { timestamps: true })

export const groupChatModel = mongoose.model('groupChat', groupChatSchema)

