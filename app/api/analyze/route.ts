import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { adzunaService } from '@/lib/adzuna-service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Add this function to extract skills from AI analysis
function extractSkillsForMarketData(analysis: any): string[] {
  const skills = new Set<string>();
  
  // Extract from skill gaps
  analysis.skillGaps?.forEach((gap: any) => {
    skills.add(gap.skill.toLowerCase());
  });
  
  // Extract from target roles (simplified)
  if (analysis.hiddenCareers) {
    analysis.hiddenCareers.forEach((career: any) => {
      // Add common skills for these roles
      const roleSkills = getSkillsForRole(career.title);
      roleSkills.forEach(skill => skills.add(skill));
    });
  }
  
  return Array.from(skills).slice(0, 8); // Limit to 8 skills
}

function getSkillsForRole(role: string): string[] {
  const roleSkills: any = {
    'frontend developer': ['javascript', 'react', 'typescript', 'html', 'css'],
    'backend developer': ['python', 'node.js', 'java', 'sql', 'aws'],
    'full stack developer': ['javascript', 'react', 'node.js', 'python', 'aws'],
    'devops engineer': ['aws', 'docker', 'kubernetes', 'python', 'linux'],
    'data scientist': ['python', 'sql', 'machine learning', 'r', 'statistics'],
    'product manager': ['product management', 'agile', 'sql', 'analytics'],
    'cloud engineer': ['aws', 'azure', 'docker', 'kubernetes', 'python']
  };
  
  return roleSkills[role.toLowerCase()] || ['javascript', 'python', 'aws'];
}

// Your existing AI analysis function
async function getAIAnalysis(resume: string, goals: string) {
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

  return JSON.parse(content);
}

// Main POST function
export async function POST(request: Request) {
  try {
    const { resume, goals } = await request.json();
    
    // Get AI analysis
    const aiAnalysis = await getAIAnalysis(resume, goals);
    
    // Extract skills for market data
    const skillsForMarket = extractSkillsForMarketData(aiAnalysis);
    
    // Get market data from Adzuna
    const marketData = await adzunaService.getSkillMarketData(skillsForMarket);
    
    // Combine AI analysis with market data
    const enhancedAnalysis = {
      ...aiAnalysis,
      marketInsights: marketData,
      generatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(enhancedAnalysis);
    
  } catch (error) {
    console.error('Enhanced analysis failed:', error);
    
    // Proper error handling for TypeScript
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: 'Analysis failed: ' + errorMessage },
      { status: 500 }
    );
  }
}