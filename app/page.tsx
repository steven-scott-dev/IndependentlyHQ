'use client'
import { useState } from 'react'

// Add these type definitions at the top
type SkillGap = {
  skill: string
  priority: 'high' | 'medium' | 'low'
  demand?: string
}

type Certification = {
  name: string
  cost: number
  duration: string
  salaryImpact: number
  roi: 'high' | 'medium' | 'low'
}

type SalaryProjection = {
  currentEstimate: number
  potential90Days: number
  potential1Year: number
}

type AlternativePath = {
  role: string
  transitionDifficulty: 'easy' | 'medium' | 'hard'
  salaryRange: string
}

type CareerAnalysis = {
  skillGaps?: SkillGap[]
  certifications?: Certification[]
  learningRoadmap?: {
    '30Days'?: string
    '60Days'?: string
    '90Days'?: string
  }
  salaryProjection?: SalaryProjection
  alternativePaths?: AlternativePath[]
}

export default function Home() {
  const [resume, setResume] = useState('')
  const [goals, setGoals] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CareerAnalysis | null>(null) // Add the type here

  const analyzeCareer = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, goals })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Independently
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Take control of your career growth
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Resume
              </label>
              <textarea 
                className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Paste your resume here... (or describe your skills and experience)"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Career Goals
              </label>
              <textarea
                className="w-full h-24 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="What are your career goals? (e.g., 'become senior developer', 'switch to product management', 'increase salary by 30%')"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
              />
            </div>
            
            <button 
              onClick={analyzeCareer}
              disabled={loading || !resume.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Your Career Path...
                </span>
              ) : (
                'Get My Career Roadmap →'
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Career Roadmap</h2>
            
            {/* Skill Gaps */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Gaps to Address</h3>
              <div className="grid gap-3">
                {result.skillGaps?.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{skill.skill}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      skill.priority === 'high' ? 'bg-red-100 text-red-800' :
                      skill.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {skill.priority} priority
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {result.certifications && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">High-ROI Certifications</h3>
                <div className="grid gap-4">
                  {result.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
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
                        <p className="text-green-600 font-medium">Potential salary impact: +${cert.salaryImpact?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Roadmap */}
            {result.learningRoadmap && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">90-Day Learning Plan</h3>
                <div className="grid gap-4">
                  {Object.entries(result.learningRoadmap).map(([period, plan]) => (
                    <div key={period} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 capitalize">{period}</h4>
                      <p className="text-blue-800">{plan}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Salary Projection */}
            {result.salaryProjection && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Salary Projection</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Current</p>
                    <p className="text-2xl font-bold text-gray-900">${result.salaryProjection.currentEstimate?.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">90 Days</p>
                    <p className="text-2xl font-bold text-green-600">${result.salaryProjection.potential90Days?.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">1 Year</p>
                    <p className="text-2xl font-bold text-blue-600">${result.salaryProjection.potential1Year?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}