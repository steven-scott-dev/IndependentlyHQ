import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { resume, goals } = await request.json();

    const prompt = `
    Analyze this resume and career goals to create a comprehensive career roadmap.

    RESUME:
    ${resume}

    CAREER GOALS:
    ${goals}

    Provide analysis in this EXACT JSON format:
    {
      "hiddenCareers": [
        {
          "title": "Job title",
          "matchReason": "Why they're qualified",
          "salaryRange": "$XX,XXX-$XX,XXX",
          "transitionDifficulty": "easy/medium/hard"
        }
      ],
      "skillGaps": [
        {
          "skill": "Skill name",
          "priority": "high/medium/low",
          "reason": "Why it's important",
          "resources": ["Resource 1", "Resource 2"]
        }
      ],
      "actionPlan": {
        "weeks1To4": "Specific weekly tasks and learning objectives",
        "weeks5To8": "Specific weekly tasks and learning objectives", 
        "weeks9To12": "Specific weekly tasks and learning objectives"
      },
      "salaryProjections": {
        "current": 85000,
        "in90Days": 100000,
        "in1Year": 130000
      },
      "certifications": [
        {
          "name": "Certification name",
          "cost": 299,
          "duration": "3 months",
          "roi": "high/medium/low",
          "salaryImpact": 15000
        }
      ]
    }

    Make recommendations realistic and actionable. Focus on high-ROI opportunities.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    const analysis = JSON.parse(content);
    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze career path' },
      { status: 500 }
    );
  }
}