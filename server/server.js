import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { GoogleGenAI } from '@google/genai'

const app = express()

app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

app.get('/', (req, res) => {
  res.send('AI Expense Tracker backend is running!')
})
app.post('/api/ai-insights', async (req, res) => {
 try {
  const { prompt } = req.body

  let response

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      })

      break
    } catch (error) {
  console.error('AI Insights Error:', error.message)

  if (
    error.status === 503 ||
    error.status === 429 ||
    error.status === 500
  ) {
    return res.status(503).json({
      error: 'The AI service is temporarily busy. Please try again in a minute.'
    })
  }

  return res.status(500).json({
    error: 'Unable to generate AI insights. Please try again later.'
  })
}
  }

  res.json({
    success: true,
    result: response.text
  })
} catch (error) {
    console.error('Gemini API error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to generate AI insights.'
    })
  }
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})