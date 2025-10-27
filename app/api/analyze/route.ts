import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const { resume, goals } = await request.json()

  const prompt = `
  Act as a senior career coach. Analyze this resume and career goals:

  RESUME:
  ${resume}

  CAREER GOALS:
  ${goals}

  Provide a comprehensive career analysis in this EXACT JSON format:
  {
    "skillGaps": [
      {"skill": "skill name", "priority": "high/medium/low", "demand": "percentage of target jobs"}
    ],
    "certifications": [
      {"name": "cert name", "cost": 100, "duration": "3 months", "salaryImpact": 15000, "roi": "high/medium/low"}
    ],
    "learningRoadmap": {
      "30Days": "specific actionable steps",
      "60Days": "specific actionable steps", 
      "90Days": "specific actionable steps"
    },
    "salaryProjection": {
      "currentEstimate": 85000,
      "potential90Days": 100000,
      "potential1Year": 130000
    },
    "alternativePaths": [
      {"role": "alternative role", "transitionDifficulty": "easy/medium/hard", "salaryRange": "100k-150k"}
    ]
  }

  Make data realistic and actionable. Focus on high-ROI recommendations.
  `

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
    })

    const analysis = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('OpenAI error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}