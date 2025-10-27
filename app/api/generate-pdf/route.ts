import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb, PDFImage } from 'pdf-lib'

export async function POST(request: Request) {
  try {
    const { resume, careerGoals, marketAnalysis } = await request.json()

    const pdfDoc = await PDFDocument.create()
    
    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    const fontSize = 10
    const lineHeight = 14
    const margin = 50
    const pageWidth = 612
    const pageHeight = 792

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
    let cursorY = pageHeight - margin

    // Helper functions
    const addNewPage = () => {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight])
      cursorY = pageHeight - margin
      return currentPage
    }

    const checkSpace = (linesNeeded: number) => {
      if (cursorY - (linesNeeded * lineHeight) < margin + 20) {
        addNewPage()
        return true
      }
      return false
    }

    const writeLine = (text: string, isBold = false, spacing = lineHeight, size = fontSize, x = margin) => {
      checkSpace(1)
      currentPage.drawText(text, {
        x: x,
        y: cursorY,
        size: size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0)
      })
      cursorY -= spacing
    }

    const writeSectionHeader = (text: string) => {
      checkSpace(3)
      cursorY -= lineHeight
      writeLine(text, true, lineHeight * 1.5, 12)
      // Draw a line under the header
      currentPage.drawLine({
        start: { x: margin, y: cursorY + 5 },
        end: { x: pageWidth - margin, y: cursorY + 5 },
        thickness: 1,
        color: rgb(0.2, 0.4, 0.6),
      })
      cursorY -= lineHeight
    }

    const drawBox = (text: string, width: number, height: number, color: [number, number, number] = [0.9, 0.95, 1]) => {
      checkSpace(Math.ceil(height / lineHeight))
      currentPage.drawRectangle({
        x: margin,
        y: cursorY - height,
        width: width,
        height: height,
        color: rgb(...color),
        borderColor: rgb(0.2, 0.4, 0.6),
        borderWidth: 1,
      })
      writeLine(text, true, height, 10, margin + 10)
    }

    // ==================== COVER PAGE ====================
    writeLine('INDEPENDENTLY', true, lineHeight * 3, 24, pageWidth/2 - 60)
    writeLine('Career Development Portfolio', false, lineHeight * 2, 16, pageWidth/2 - 80)
    cursorY -= lineHeight * 2
    
    // Draw a simple "logo" box
    currentPage.drawRectangle({
      x: pageWidth/2 - 40,
      y: cursorY - 80,
      width: 80,
      height: 80,
      color: rgb(0.2, 0.4, 0.6),
    })
    writeLine('IDP', true, 80, 18, pageWidth/2 - 15)
    cursorY -= 100

    writeLine(`Prepared for: ${resume.personalInfo.name}`, true, lineHeight * 2, 14)
    writeLine(resume.personalInfo.title, false, lineHeight)
    writeLine(`Generated: ${new Date().toLocaleDateString()}`, false, lineHeight * 3)
    
    drawBox('Career Alignment Score: 92%', pageWidth - margin * 2, 30, [0.8, 0.95, 0.8])
    cursorY -= lineHeight

    // ==================== EXECUTIVE SUMMARY ====================
    addNewPage()
    writeSectionHeader('EXECUTIVE SUMMARY')
    
    writeLine('Career Track: Technical Leadership → Engineering Management', true)
    writeLine(`Timeline: 18-24 month progression plan`, false, lineHeight)
    writeLine('', false, lineHeight)
    
    drawBox('Current Strengths', pageWidth - margin * 2, 80)
    writeLine('✓ Full Stack Architecture', false, lineHeight, 9, margin + 20)
    writeLine('✓ Cloud Technologies (AWS, Docker, Kubernetes)', false, lineHeight, 9, margin + 20)
    writeLine('✓ Team Leadership & Mentoring', false, lineHeight, 9, margin + 20)
    writeLine('✓ Performance Optimization', false, lineHeight, 9, margin + 20)
    cursorY -= lineHeight

    // ==================== CAREER ROADMAP VISUAL ====================
    writeSectionHeader('CAREER PROGRESSION ROADMAP')
    
    // Draw a simple timeline visualization
    const timelineStages = [
      { title: 'Current', role: 'Senior Software Engineer', timeline: 'Now' },
      { title: '6-12 Months', role: 'Staff Engineer / Tech Lead', timeline: 'Short-term' },
      { title: '12-24 Months', role: 'Engineering Manager', timeline: 'Mid-term' },
      { title: '2-3 Years', role: 'Director of Engineering', timeline: 'Long-term' }
    ]

    timelineStages.forEach((stage, index) => {
      if (index > 0 && index % 2 === 0) {
        checkSpace(8)
      }
      
      const boxWidth = (pageWidth - margin * 3) / 2
      const boxX = margin + (index % 2) * (boxWidth + margin)
      const boxY = cursorY - 60
      
      currentPage.drawRectangle({
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: 50,
        color: rgb(0.95, 0.95, 0.95),
        borderColor: rgb(0.2, 0.4, 0.6),
        borderWidth: 1,
      })
      
      currentPage.drawText(stage.title, {
        x: boxX + 10,
        y: boxY + 30,
        size: 9,
        font: boldFont,
        color: rgb(0.2, 0.4, 0.6),
      })
      
      currentPage.drawText(stage.role, {
        x: boxX + 10,
        y: boxY + 18,
        size: 8,
        font: font,
        color: rgb(0, 0, 0),
      })
      
      currentPage.drawText(stage.timeline, {
        x: boxX + 10,
        y: boxY + 6,
        size: 7,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      })
      
      if (index % 2 === 1) {
        cursorY -= 70
      }
    })
    
    cursorY -= 70

    // ==================== SKILL GAP ANALYSIS ====================
    writeSectionHeader('SKILL GAP ANALYSIS')
    
    const skillGaps = [
      { skill: 'Advanced Kubernetes', priority: 'High', progress: '30%' },
      { skill: 'System Design Leadership', priority: 'High', progress: '50%' },
      { skill: 'Budget Management', priority: 'Medium', progress: '20%' },
      { skill: 'Executive Communication', priority: 'Medium', progress: '60%' }
    ]

    skillGaps.forEach(skill => {
      checkSpace(2)
      writeLine(`• ${skill.skill}`, true, lineHeight)
      writeLine(`  Priority: ${skill.priority} | Current Mastery: ${skill.progress}`, false, lineHeight)
      
      // Simple progress bar
      const progressWidth = 100
      const progressFilled = (parseInt(skill.progress) / 100) * progressWidth
      currentPage.drawRectangle({
        x: margin + 100,
        y: cursorY + 8,
        width: progressWidth,
        height: 6,
        color: rgb(0.9, 0.9, 0.9),
      })
      currentPage.drawRectangle({
        x: margin + 100,
        y: cursorY + 8,
        width: progressFilled,
        height: 6,
        color: rgb(0.2, 0.6, 0.3),
      })
      
      cursorY -= lineHeight
    })

    // ==================== COVER LETTER ====================
    addNewPage()
    writeSectionHeader('PROFESSIONAL COVER LETTER TEMPLATE')
    
    writeLine('Dear Hiring Manager,', false, lineHeight * 1.5)
    writeLine(`As a ${resume.personalInfo.title} with ${resume.experience.length}+ years of experience`, false, lineHeight)
    writeLine('specializing in full-stack development and cloud architecture, I am excited to', false, lineHeight)
    writeLine('transition into technical leadership roles where I can leverage my expertise in:', false, lineHeight * 1.5)
    
    writeLine('• Microservices architecture and system design', false, lineHeight, 9, margin + 20)
    writeLine('• Cloud-native development (AWS, Kubernetes, Docker)', false, lineHeight, 9, margin + 20)
    writeLine('• Team leadership and engineering mentorship', false, lineHeight, 9, margin + 20)
    writeLine('• Performance optimization and scalable systems', false, lineHeight * 1.5, 9, margin + 20)
    
    writeLine('My career goals align with progressive technical leadership positions,', false, lineHeight)
    writeLine('and I am particularly interested in opportunities that combine hands-on', false, lineHeight)
    writeLine('architecture with team management responsibilities.', false, lineHeight * 1.5)
    
    writeLine('Sincerely,', false, lineHeight * 1.5)
    writeLine(resume.personalInfo.name, true, lineHeight)
    writeLine(resume.personalInfo.title, false, lineHeight)
    writeLine(resume.personalInfo.email, false, lineHeight)
    writeLine(resume.personalInfo.phone, false, lineHeight * 2)

    // ==================== MARKET INSIGHTS ====================
    writeSectionHeader('MARKET INSIGHTS & COMPENSATION')
    
    // Salary progression chart
    const salaryData = [
      { stage: 'Current', amount: 145000 },
      { stage: '6 Months', amount: 160000 },
      { stage: '1 Year', amount: 180000 },
      { stage: '2 Years', amount: 220000 }
    ]

    writeLine('Salary Progression Projection:', true, lineHeight * 1.5)
    salaryData.forEach(item => {
      const barWidth = (item.amount / 250000) * 150
      writeLine(`${item.stage}: $${item.amount.toLocaleString()}`, false, lineHeight)
      currentPage.drawRectangle({
        x: margin + 120,
        y: cursorY + 4,
        width: barWidth,
        height: 8,
        color: rgb(0.2, 0.4, 0.6),
      })
      cursorY -= lineHeight
    })

    cursorY -= lineHeight

    // ==================== ACTION PLAN ====================
    writeSectionHeader('90-DAY ACTION PLAN')
    
    const actionItems = [
      { phase: 'Month 1', tasks: ['Complete Kubernetes certification', 'Network with 3 engineering managers'] },
      { phase: 'Month 2', tasks: ['Lead architecture design session', 'Update portfolio with 2 new projects'] },
      { phase: 'Month 3', tasks: ['Apply for 5 target positions', 'Practice leadership interview scenarios'] }
    ]

    actionItems.forEach(phase => {
      checkSpace(phase.tasks.length + 2)
      writeLine(phase.phase, true, lineHeight * 1.2)
      phase.tasks.forEach(task => {
        writeLine(`  ✓ ${task}`, false, lineHeight)
      })
      cursorY -= lineHeight
    })

    // ==================== FOOTER ====================
    addNewPage()
    writeLine('INDEPENDENTLY CAREER PLATFORM', true, lineHeight * 2, 14, pageWidth/2 - 80)
    writeLine('Confidential Career Development Document', false, lineHeight * 1.5)
    writeLine(`Generated for: ${resume.personalInfo.name}`, false, lineHeight)
    writeLine(`Document ID: ${Date.now().toString(36).toUpperCase()}`, false, lineHeight)
    writeLine('© 2024 Independently. All rights reserved.', false, lineHeight * 2)

    const pdfBytes = await pdfDoc.save()
    const pdfBuffer = Buffer.from(pdfBytes)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="career-portfolio.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate career portfolio' }, { status: 500 })
  }
}