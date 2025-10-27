'use client'
import { useState } from 'react'

interface AnalysisResult {
  hiddenCareers: Array<{
    title: string
    matchReason: string
    salaryRange: string
    transitionDifficulty: string
  }>
  skillGaps: Array<{
    skill: string
    priority: string
    reason: string
    resources: string[]
  }>
  actionPlan: {
    weeks1To4: string
    weeks5To8: string
    weeks9To12: string
  }
  salaryProjections: {
    current: number
    in90Days: number
    in1Year: number
  }
  certifications: Array<{
    name: string
    cost: number
    duration: string
    roi: string
    salaryImpact: number
  }>
}

export default function Dashboard() {
  const [resume, setResume] = useState('')
  const [goals, setGoals] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const analyzeCareer = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, goals })
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const data = await response.json()
      setAnalysisResult(data)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Failed to analyze your career path. Please try again.')
    }
    setIsProcessing(false)
  }

  const downloadPDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisResult)
      })
      
      if (!response.ok) {
        throw new Error('PDF generation failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'career-roadmap.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download PDF. Please try again.')
    }
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setResume('')
    setGoals('')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#2563EB]">Independently</span>
            <div className="w-6 h-0.5 bg-[#059669] transform rotate-45 origin-center"></div>
          </div>
          <div className="text-sm text-gray-600">Lifetime Access</div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {!analysisResult ? (
            <>
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Your Career Roadmap is Ready.</h1>
              <p className="text-gray-600 mb-8">Upload your resume to generate your personalized career roadmap</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Resume
                  </label>
                  <textarea 
                    className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Paste your resume text here..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Career Goals
                  </label>
                  <textarea
                    className="w-full h-24 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="What are your career goals? (e.g., 'become senior developer', 'switch to product management', 'increase salary by 30%')"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                  />
                </div>

                <button 
                  onClick={analyzeCareer}
                  disabled={isProcessing || !resume.trim()}
                  className="w-full bg-[#2563EB] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Our AI is analyzing your experience... Building your personalized 90-day plan.
                    </span>
                  ) : (
                    'Generate My Career Roadmap'
                  )}
                </button>
              </div>
            </>
          ) : (
            <div>
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Your Career Roadmap</h2>
                <p className="text-gray-600 mb-6">Your personalized career analysis is complete and ready to download.</p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={downloadPDF}
                    className="bg-[#2563EB] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Download Your Full Report (PDF)
                  </button>
                  <button 
                    onClick={resetAnalysis}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Analyze Another Resume
                  </button>
                </div>
              </div>

              {/* Preview of Results */}
              <div className="border-t pt-8 space-y-8">
                {/* Hidden Careers */}
                <div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-4">🎯 Hidden Career Matches</h3>
                  <div className="grid gap-4">
                    {analysisResult.hiddenCareers?.map((career, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{career.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            career.transitionDifficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            career.transitionDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {career.transitionDifficulty} transition
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{career.matchReason}</p>
                        <p className="text-[#059669] font-medium">Salary: {career.salaryRange}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill Gaps */}
                <div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-4">📚 Priority Skill Gaps</h3>
                  <div className="grid gap-3">
                    {analysisResult.skillGaps?.map((skill, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{skill.skill}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              skill.priority === 'high' ? 'bg-red-100 text-red-800' :
                              skill.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {skill.priority} priority
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{skill.reason}</p>
                          <div className="text-xs text-gray-500">
                            <strong>Resources:</strong> {skill.resources?.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salary Projections */}
                {analysisResult.salaryProjections && (
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-4">💰 Salary Projections</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-sm text-gray-600 mb-1">Current</p>
                        <p className="text-2xl font-bold text-gray-900">${analysisResult.salaryProjections.current?.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                        <p className="text-sm text-green-600 mb-1">In 90 Days</p>
                        <p className="text-2xl font-bold text-green-700">${analysisResult.salaryProjections.in90Days?.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                        <p className="text-sm text-blue-600 mb-1">In 1 Year</p>
                        <p className="text-2xl font-bold text-blue-700">${analysisResult.salaryProjections.in1Year?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {analysisResult.certifications && analysisResult.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-4">🏆 High-ROI Certifications</h3>
                    <div className="grid gap-4">
                      {analysisResult.certifications.map((cert, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              cert.roi === 'high' ? 'bg-green-100 text-green-800' :
                              cert.roi === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {cert.roi} ROI
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Cost: ${cert.cost} • Duration: {cert.duration}</p>
                            <p className="text-green-600 font-medium">Salary Impact: +${cert.salaryImpact?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Plan */}
                {analysisResult.actionPlan && (
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-4">🗓️ 90-Day Action Plan</h3>
                    <div className="grid gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Weeks 1-4</h4>
                        <p className="text-blue-800">{analysisResult.actionPlan.weeks1To4}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">Weeks 5-8</h4>
                        <p className="text-green-800">{analysisResult.actionPlan.weeks5To8}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2">Weeks 9-12</h4>
                        <p className="text-purple-800">{analysisResult.actionPlan.weeks9To12}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}