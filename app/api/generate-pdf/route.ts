import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const analysis = await request.json();

    const reportContent = `
╔════════════════════════════════════════════════════════════════╗
║                   INDEPENDENTLY - CAREER ROADMAP              ║
║                    Your Path to Career Growth                 ║
╚════════════════════════════════════════════════════════════════╝

Generated on: ${new Date().toLocaleDateString()}
---------------------------------------------------------------------------

🎯 HIDDEN CAREER MATCHES
---------------------------------------------------------------------------
${analysis.hiddenCareers?.map((career: any, index: number) => `
${index + 1}. ${career.title.toUpperCase()}
   📍 Why You're Qualified: ${career.matchReason}
   💰 Salary Range: ${career.salaryRange}
   🚦 Transition: ${career.transitionDifficulty.toUpperCase()}
`).join('\n')}

📚 PRIORITY SKILL GAPS
---------------------------------------------------------------------------
${analysis.skillGaps?.map((skill: any, index: number) => `
${index + 1}. ${skill.skill}
   ⚠️  Priority: ${skill.priority.toUpperCase()}
   📖 Reason: ${skill.reason}
   🔗 Resources: ${skill.resources?.join(', ')}
`).join('\n')}

🗓️  90-DAY ACTION PLAN
---------------------------------------------------------------------------
📍 WEEKS 1-4: ${analysis.actionPlan?.weeks1To4}

📍 WEEKS 5-8: ${analysis.actionPlan?.weeks5To8}

📍 WEEKS 9-12: ${analysis.actionPlan?.weeks9To12}

💰 SALARY PROJECTIONS
---------------------------------------------------------------------------
• Current: $${analysis.salaryProjections?.current?.toLocaleString()}
• 90-Day Goal: $${analysis.salaryProjections?.in90Days?.toLocaleString()}
• 1-Year Goal: $${analysis.salaryProjections?.in1Year?.toLocaleString()}

🏆 HIGH-ROI CERTIFICATIONS
---------------------------------------------------------------------------
${analysis.certifications?.map((cert: any, index: number) => `
${index + 1}. ${cert.name}
   💵 Cost: $${cert.cost}
   ⏱️  Duration: ${cert.duration}
   📈 ROI: ${cert.roi.toUpperCase()}
   💰 Salary Impact: +$${cert.salaryImpact?.toLocaleString()}
`).join('\n')}

---------------------------------------------------------------------------
💡 NEXT STEPS
1. Review your hidden career matches and identify 1-2 that interest you
2. Focus on the high-priority skill gaps first
3. Follow the 90-day action plan week by week
4. Consider the recommended certifications for long-term growth
5. Re-run this analysis in 3 months to track your progress

---------------------------------------------------------------------------
Thank you for choosing Independently!
Re-run your analysis anytime: https://independently-hq.vercel.app/dashboard

"Take control of your career growth - one step at a time."
    `.trim();

    // Return as simple response
    return new Response(reportContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="career-roadmap.pdf"',
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