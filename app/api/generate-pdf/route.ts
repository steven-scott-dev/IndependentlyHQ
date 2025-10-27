import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const analysis = await request.json(); // Fixed variable name

    // Create a more structured text file
    const pdfContent = `
INDEPENDENTLY - CAREER ROADMAP
Generated on: ${new Date().toLocaleDateString()}
==================================================

YOUR HIDDEN CAREER MATCHES:
${analysis.hiddenCareers?.map((career: any, index: number) => `
${index + 1}. ${career.title}
   • Why You're Qualified: ${career.matchReason}
   • Salary Range: ${career.salaryRange}
   • Transition Difficulty: ${career.transitionDifficulty}
`).join('\n')}

PRIORITY SKILL GAPS TO ADDRESS:
${analysis.skillGaps?.map((skill: any, index: number) => `
${index + 1}. ${skill.skill} (${skill.priority.toUpperCase()} PRIORITY)
   • Importance: ${skill.reason}
   • Recommended Resources: ${skill.resources?.join(', ')}
`).join('\n')}

YOUR 90-DAY ACTION PLAN:
• WEEKS 1-4: ${analysis.actionPlan?.weeks1To4}
• WEEKS 5-8: ${analysis.actionPlan?.weeks5To8} 
• WEEKS 9-12: ${analysis.actionPlan?.weeks9To12}

SALARY PROJECTIONS:
• Current Estimated Salary: $${analysis.salaryProjections?.current?.toLocaleString()}
• Potential in 90 Days: $${analysis.salaryProjections?.in90Days?.toLocaleString()}
• Potential in 1 Year: $${analysis.salaryProjections?.in1Year?.toLocaleString()}

HIGH-ROI CERTIFICATIONS:
${analysis.certifications?.map((cert: any, index: number) => `
${index + 1}. ${cert.name}
   • Cost: $${cert.cost}
   • Duration: ${cert.duration}
   • ROI: ${cert.roi.toUpperCase()}
   • Potential Salary Impact: +$${cert.salaryImpact?.toLocaleString()}
`).join('\n')}

---
Thank you for using Independently!
Re-run your analysis anytime at: https://independently-hq.vercel.app/dashboard
    `.trim();

    // Convert to buffer for proper file download
    const buffer = Buffer.from(pdfContent, 'utf-8');

    return new Response(buffer, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="career-roadmap.txt"',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate career roadmap' },
      { status: 500 }
    );
  }
}