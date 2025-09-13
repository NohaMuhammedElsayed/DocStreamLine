import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {inngest, functions} from './inngest/index.js'

const app = express()

await connectDB();

//felo
// Middleware
app.use(express.json())
app.use(cors())

// Simple health-check route
app.get('/', (req, res) => {
  res.send('Server is running')
})

app.use('/api/inngest', serve({ client: inngest, functions }))

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
