import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'

// Create Express app and HTTP server
const app = express()
const server = http.createServer(app)
const port = 4000

// Middleware
app.use(express.json({ limit: '4mb' }))
app.use(cors())

app.use('/api/status', (req, res) => {
    res.send('API Working!')
})

server.listen(port, () => console.log('Server is running on port 4000')
)
