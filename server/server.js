import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import connectDB from './lib/db.js'
import userRouter from './routes/userRoute.js'
import messageRouter from './routes/messageRoute.js'
import { Server } from 'socket.io'

// Create Express app and HTTP server
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 4000

// initialize socket.io server
export const io = new Server(server, {
    cors: {origin: '*'}
})

// Store online users
export const userSocketMap = {} // { userId: socketId }

// Socket.io connection handler
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    console.log('User Connected', userId);

    if (userId) userSocketMap[userId] = socket.id

    // Emit online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('disconnect', () => {
        console.log('User Disconnected', userId);
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
    
})

// Middleware
app.use(express.json({ limit: '4mb' }))
app.use(cors())

app.use('/api/status', (req, res) => {
    res.send('API Working!')
})
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// Connected DB
await connectDB()

server.listen(port, () => console.log(`Server running on port ${port}`)
)
