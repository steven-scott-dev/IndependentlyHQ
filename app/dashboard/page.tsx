'use client'
import { useState } from 'react'

export default function Dashboard() {
  const [resume, setResume] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const generateReport = async () => {
    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setReportGenerated(true)
    }, 3000)
  }

  const downloadPDF = () => {
    // PDF generation will go here
    alert('PDF download functionality coming next!')
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
          {!reportGenerated ? (
            <>
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Your Career Roadmap is Ready.</h1>
              <p className="text-gray-600 mb-8">Upload your resume to generate your personalized career roadmap</p>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Resume or Connect LinkedIn</h2>
                <textarea 
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Paste your resume text here... (We'll add LinkedIn integration soon)"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-2">Or describe your skills and experience if you don't have a resume handy</p>
              </div>

              <button 
                onClick={generateReport}
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
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Your Career Roadmap</h2>
              <p className="text-gray-600 mb-8">Your personalized career analysis is complete and ready to download.</p>
              <button 
                onClick={downloadPDF}
                className="bg-[#2563EB] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Download Your Full Report (PDF)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}