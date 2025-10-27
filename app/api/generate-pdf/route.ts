import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function POST(request: Request) {
  try {
    const analysis = await request.json()

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([612, 792])
    const { height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontSize = 12
    let cursorY = height - 50

    const writeLine = (text: string, offset = 18, isBold = false) => {
      page.drawText(text, { 
        x: 50, 
        y: cursorY, 
        size: fontSize, 
        font: isBold ? boldFont : font, 
        color: rgb(0, 0, 0) 
      })
      cursorY -= offset
    }

    writeLine('INDEPENDENTLY - CAREER ROADMAP', 24, true)
    writeLine('================================', 24)

    // Market Overview
    writeLine('MARKET OVERVIEW:', 18, true)
    writeLine(`Industry Growth Rate: ${analysis.marketData?.industryGrowthRate || 'N/A'}`)
    writeLine(`Employment Outlook: ${analysis.marketData?.employmentOutlook || 'N/A'}`)
    writeLine(`Remote Work Adoption: ${analysis.marketData?.remoteWorkAdoption || 'N/A'}`)
    writeLine(`Top Hiring Regions: ${analysis.marketData?.topHiringRegions?.join(', ') || 'N/A'}`)
    writeLine(`In-Demand Skills: ${analysis.marketData?.inDemandSkills?.join(', ') || 'N/A'}`, 24)

    // Market Trends
    if (analysis.marketData?.trends?.length > 0) {
      writeLine('KEY MARKET TRENDS:', 18, true)
      analysis.marketData.trends.forEach((trend: any, i: number) => {
        writeLine(`${i + 1}. ${trend.name}`)
        writeLine(`   Impact: ${trend.impactLevel}`)
        writeLine(`   Timeline: ${trend.timeline}`)
        writeLine(`   Description: ${trend.description}`, 24)
      })
    }

    // Hidden Careers with Market Context
    writeLine('YOUR HIDDEN CAREER MATCHES:', 18, true)
    analysis.hiddenCareers?.forEach((c: any, i: number) => {
      writeLine(`${i + 1}. ${c.title}`, 18, true)
      writeLine(`   Why You're Qualified: ${c.matchReason}`)
      writeLine(`   Salary Range: ${c.salaryRange}`)
      writeLine(`   Market Demand: ${c.marketDemand || 'High'}`)
      writeLine(`   Job Growth: ${c.jobGrowth || 'N/A'}`)
      writeLine(`   Remote Opportunities: ${c.remoteOpportunities || 'Medium'}`)
      writeLine(`   Transition Difficulty: ${c.transitionDifficulty}`, 24)
    })

    // Skill Gaps with Market Alignment
    writeLine('PRIORITY SKILL GAPS:', 18, true)
    analysis.skillGaps?.forEach((s: any, i: number) => {
      writeLine(`${i + 1}. ${s.skill} (${s.priority} priority)`, 18, true)
      writeLine(`   Importance: ${s.reason}`)
      writeLine(`   Market Demand: ${s.marketDemand || 'High'}`)
      writeLine(`   Average Salary Premium: ${s.salaryPremium || '15-25%'}`)
      writeLine(`   Resources: ${s.resources?.join(', ')}`, 24)
    })

    // Competitive Analysis
    if (analysis.marketData?.competitiveAnalysis) {
      writeLine('COMPETITIVE ANALYSIS:', 18, true)
      const comp = analysis.marketData.competitiveAnalysis
      writeLine(`Market Competition: ${comp.competitionLevel}`)
      writeLine(`Barriers to Entry: ${comp.barriersToEntry}`)
      writeLine(`Differentiation Factors: ${comp.differentiationFactors?.join(', ')}`)
      writeLine(`Target Companies: ${comp.targetCompanies?.join(', ')}`, 24)
    }

    // Salary Projections with Market Context
    writeLine('SALARY PROJECTIONS:', 18, true)
    writeLine(`Current: $${analysis.salaryProjections?.current?.toLocaleString()}`)
    writeLine(`Market Average: $${analysis.marketData?.marketAverageSalary?.toLocaleString() || 'N/A'}`)
    writeLine(`In 90 Days: $${analysis.salaryProjections?.in90Days?.toLocaleString()}`)
    writeLine(`In 1 Year: $${analysis.salaryProjections?.in1Year?.toLocaleString()}`)
    writeLine(`Top 10% Earners: $${analysis.marketData?.topEarnersSalary?.toLocaleString() || 'N/A'}`, 24)

    // Industry Insights
    if (analysis.marketData?.industryInsights) {
      writeLine('INDUSTRY INSIGHTS:', 18, true)
      const insights = analysis.marketData.industryInsights
      writeLine(`Emerging Technologies: ${insights.emergingTechnologies?.join(', ') || 'N/A'}`)
      writeLine(`Regulatory Changes: ${insights.regulatoryChanges || 'N/A'}`)
      writeLine(`Investment Trends: ${insights.investmentTrends || 'N/A'}`)
      writeLine(`Future Outlook: ${insights.futureOutlook || 'Positive'}`, 24)
    }

    // Certifications with Market Value
    writeLine('CERTIFICATIONS:', 18, true)
    analysis.certifications?.forEach((cert: any, i: number) => {
      writeLine(`${i + 1}. ${cert.name}`, 18, true)
      writeLine(`   Cost: $${cert.cost} | Duration: ${cert.duration}`)
      writeLine(`   Market Recognition: ${cert.marketRecognition || 'High'}`)
      writeLine(`   Employer Demand: ${cert.employerDemand || 'High'}`)
      writeLine(`   ROI: ${cert.roi} | Salary Impact: +$${cert.salaryImpact?.toLocaleString()}`, 24)
    })

    // Action Plan with Market Timing
    writeLine('90-DAY ACTION PLAN:', 18, true)
    writeLine(`Market Context: ${analysis.marketData?.hiringSeasons || 'Year-round hiring'}`)
    writeLine(`Weeks 1-4: ${analysis.actionPlan?.weeks1To4}`)
    writeLine(`Weeks 5-8: ${analysis.actionPlan?.weeks5To8}`)
    writeLine(`Weeks 9-12: ${analysis.actionPlan?.weeks9To12}`, 24)

    // Market Recommendations
    if (analysis.marketData?.recommendations) {
      writeLine('MARKET RECOMMENDATIONS:', 18, true)
      analysis.marketData.recommendations.forEach((rec: any, i: number) => {
        writeLine(`${i + 1}. ${rec.type}: ${rec.description}`)
        writeLine(`   Priority: ${rec.priority} | Timeline: ${rec.timeline}`, 24)
      })
    }

    // Footer
    writeLine('', 24)
    writeLine(`Generated by Independently | Market Data: ${analysis.marketData?.source || 'Internal Analysis'}`, 12)
    writeLine(`${new Date().toLocaleDateString()}`, 12)

    const pdfBytes = await pdfDoc.save()
    const pdfBuffer = Buffer.from(pdfBytes)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="career-roadmap.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate career roadmap' }, { status: 500 })
  }
}