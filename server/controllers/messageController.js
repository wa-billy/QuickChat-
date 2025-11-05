import messageModel from "../models/message.js"
import cloudinary from "../lib/cloudinary.js"
import userModel from "../models/userModel.js"
import { io, userSocketMap } from "../server.js"


// Get all users exept the logged in user
export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id
        const filterUsers = await userModel.find({ _id: {$ne: userId} }).select("-password")

        // Count Unseen
        const unseenMessages = {}
        const promises = filterUsers.map(async () => {
            const messages = await messageModel.find({ senderId: user._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length
            }
        })
        await Promise.all(promises)
        res.json({
            success: true,
            users: filterUsers,
            unseenMessages
        })
    } catch (error) {
        console.log(error),
        res.json({
            success: false,
            message: error.message
        })
    }
} 

// Get all messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params
        const myId = req.user._id

        const messages = await messageModel.find({ 
            $or: [
                {sensderId: myId, receiverId: selectedUserId},
                {sensderId: selectedUserId, receiverId: myId},
            ]
         })
         await messageModel.updateMany({ senderId: selectedUserId, receiverId: myId }, 
        { seen: true })

        res.json({
            success: true,
            messages
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// api to mark message as seen using message id
export const  markMessageAsSeen = async (req, res) => {
    try {
        
        const { id } = req.params
        await messageModel.findByIdAndUpdate(id, { seen: true })

        res.json({
            success: true
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Send message to selected user
export const SendMessage = async (req, res) => {
    try {

        const { text, image } = req.body
        const receiverId = req.params.id
        const senderId = req.user._id
        
        let imageUrl
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = await messageModel.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // Emit new message to recevier's socket
        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        res.json({
            success: false,
            newMessage
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}