import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";

axios.defaults.baseURL = 'http://localhost:4000' 

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const { socket, axios } = useContext(AuthContext)

    // Get all users for sidebar
    const getUser = async () => {

        try {
            const { data } = await axios.get('/api/messages/users')
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        } 

    }

    // Function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to send a message to selected user
    const sendMessages = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`,
            messageData)
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to sub messages for selected user
    const  SubToMessages = async () => {
        if (!socket) return

        socket.on('newMessage', (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true
                setMessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId] : 
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1 
                }))
            }
        })
    }

    // Function to unSub from messages
    const unSubFromMessages = () => {
        if (socket) socket.off('newMessage')
    }

    useEffect(() => {
        SubToMessages()
        return () => unSubFromMessages()
    }, [socket, selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        getUser,
        setMessages,
        sendMessages,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getMessages
    }

    return (
    <ChatContext.Provider value={value}>
        { children }
    </ChatContext.Provider>
    )
}