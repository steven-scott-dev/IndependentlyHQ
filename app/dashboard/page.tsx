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
  const [error, setError] = useState<string | null>(null)

  const analyzeCareer = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, goals })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }
      
      const data = await response.json()
      setAnalysisResult(data)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to analyze your career path. Please try again.')
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
        throw new Error('Download failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers.get('content-disposition')
      let filename = 'career-roadmap.pdf'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Download failed:', error)
      setError('Failed to download career roadmap. Please try again.')
    }
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setResume('')
    setGoals('')
    setError(null)
  }

  const useSampleData = () => {
    setResume(`John Doe - Software Developer

SKILLS:
- JavaScript, React, Node.js
- HTML, CSS, Python basics  
- Git, MongoDB, REST APIs
- Agile methodologies, Team collaboration

EXPERIENCE:
Mid-Level Developer at TechCorp (2 years)
- Built responsive web applications with React and Node.js
- Collaborated with design and backend teams on feature implementation
- Implemented new features and fixed bugs in existing codebase
- Participated in code reviews and agile development processes

Junior Developer at StartupXYZ (1 year)
- Developed frontend components using React
- Worked with REST APIs and database integration
- Assisted in testing and deployment processes

EDUCATION:
BS Computer Science - State University (2018-2022)

PROJECTS:
- E-commerce website with React and Node.js
- Task management application with real-time updates
- Portfolio website with responsive design`)

    setGoals('Become a senior full-stack developer, learn cloud technologies (AWS), and increase my salary by 40% within the next year.')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#2563EB]">Independently</span>
            <div className="w-6 h-0.5 bg-[#059669] transform rotate-45 origin-center"></div>
          </div>
          <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            Lifetime Access
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {!analysisResult ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Your Career Roadmap is Ready</h1>
                <p className="text-gray-600">Upload your resume to generate your personalized career roadmap</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Your Resume
                    </label>
                    <button
                      onClick={useSampleData}
                      className="text-xs text-[#2563EB] hover:text-blue-700 font-medium"
                    >
                      Use Sample Data
                    </button>
                  </div>
                  <textarea 
                    className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Paste your resume text here... (We'll add LinkedIn integration soon)"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Or describe your skills and experience if you don't have a resume handy
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Career Goals
                  </label>
                  <textarea
                    className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="What are your career goals? (e.g., 'become senior developer', 'switch to product management', 'increase salary by 30%', 'learn new technologies')"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                  />
                </div>

                <button 
                  onClick={analyzeCareer}
                  disabled={isProcessing || !resume.trim()}
                  className="w-full bg-[#2563EB] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
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

                {/* Tips */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Best Results</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Include all your skills, experiences, and education</li>
                    <li>• Be specific about your career goals and desired salary</li>
                    <li>• Mention any technologies or industries you're interested in</li>
                    <li>• The more detail you provide, the more personalized your roadmap will be</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div>
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Your Career Roadmap is Complete!</h2>
                <p className="text-gray-600 mb-6">Your personalized career analysis is ready. Download your full report below.</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button 
                    onClick={downloadPDF}
                    className="bg-[#2563EB] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    📄 Download Your Full Report (PDF)
                  </button>
                  <button 
                    onClick={resetAnalysis}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    🔄 Analyze Another Resume
                  </button>
                </div>
              </div>

              {/* Preview of Results */}
              <div className="border-t pt-8 space-y-8">
                {/* Hidden Careers */}
                <div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center">
                    <span className="mr-2">🎯</span>
                    Hidden Career Matches
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {analysisResult.hiddenCareers?.map((career, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">{career.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            career.transitionDifficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            career.transitionDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {career.transitionDifficulty} transition
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{career.matchReason}</p>
                        <p className="text-[#059669] font-medium">💰 {career.salaryRange}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill Gaps */}
                <div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center">
                    <span className="mr-2">📚</span>
                    Priority Skill Gaps
                  </h3>
                  <div className="grid gap-4">
                    {analysisResult.skillGaps?.map((skill, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-900 text-lg">{skill.skill}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                skill.priority === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
                                skill.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                'bg-green-100 text-green-800 border border-green-200'
                              }`}>
                                {skill.priority} priority
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{skill.reason}</p>
                            <div className="text-sm">
                              <strong className="text-gray-700">Recommended Resources:</strong>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {skill.resources?.map((resource, resIndex) => (
                                  <span key={resIndex} className="px-2 py-1 bg-white rounded border text-gray-600 text-xs">
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salary Projections */}
                {analysisResult.salaryProjections && (
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center">
                      <span className="mr-2">💰</span>
                      Salary Projections
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-6 bg-white rounded-lg border border-gray-200 text-center shadow-sm">
                        <p className="text-sm text-gray-600 mb-2">Current</p>
                        <p className="text-3xl font-bold text-gray-900">${analysisResult.salaryProjections.current?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-2">Estimated based on your profile</p>
                      </div>
                      <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center shadow-sm">
                        <p className="text-sm text-green-600 mb-2">In 90 Days</p>
                        <p className="text-3xl font-bold text-green-700">${analysisResult.salaryProjections.in90Days?.toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-2">After implementing this plan</p>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 text-center shadow-sm">
                        <p className="text-sm text-blue-600 mb-2">In 1 Year</p>
                        <p className="text-3xl font-bold text-blue-700">${analysisResult.salaryProjections.in1Year?.toLocaleString()}</p>
                        <p className="text-xs text-blue-600 mt-2">With continued growth</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {analysisResult.certifications && analysisResult.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center">
                      <span className="mr-2">🏆</span>
                      High-ROI Certifications
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {analysisResult.certifications.map((cert, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-gray-900 text-lg">{cert.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              cert.roi === 'high' ? 'bg-green-100 text-green-800 border border-green-200' :
                              cert.roi === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {cert.roi} ROI
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex justify-between">
                              <span>Cost:</span>
                              <span className="font-medium">${cert.cost}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Duration:</span>
                              <span className="font-medium">{cert.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Salary Impact:</span>
                              <span className="text-green-600 font-bold">+${cert.salaryImpact?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Plan */}
                {analysisResult.actionPlan && (
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center">
                      <span className="mr-2">🗓️</span>
                      90-Day Action Plan
                    </h3>
                    <div className="grid gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2 text-lg">Weeks 1-4: Foundation Building</h4>
                        <p className="text-blue-800">{analysisResult.actionPlan.weeks1To4}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2 text-lg">Weeks 5-8: Skill Development</h4>
                        <p className="text-green-800">{analysisResult.actionPlan.weeks5To8}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2 text-lg">Weeks 9-12: Implementation & Job Search</h4>
                        <p className="text-purple-800">{analysisResult.actionPlan.weeks9To12}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Need help? Contact support@independently.com</p>
          <p className="mt-1">© 2024 Independently. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}