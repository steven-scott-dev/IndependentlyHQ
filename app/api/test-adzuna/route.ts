import { NextResponse } from 'next/server';
import { adzunaService } from '@/lib/adzuna-service';

export async function GET() {
  try {
    // Test with common skills
    const testSkills = ['react', 'python', 'aws'];
    const marketData = await adzunaService.getSkillMarketData(testSkills);
    
    return NextResponse.json({
      success: true,
      data: marketData,
      message: 'Adzuna API is working!'
    });
  } catch (error) {
    // Properly handle the error with type checking
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: 'Using fallback data'
    }, { status: 500 });
  }
}