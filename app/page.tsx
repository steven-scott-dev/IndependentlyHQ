'use client'
import { useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const getCareerRoadmap = () => {
    // Redirect to Gumroad for payment
    window.location.href = "https://scottify38.gumroad.com/l/zbwlzgz"
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#2563EB]">Independently</span>
              <div className="w-6 h-0.5 bg-[#059669] transform rotate-45 origin-center"></div>
            </div>
            <button 
              onClick={getCareerRoadmap}
              className="bg-[#2563EB] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Your Roadmap - $97
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6">
            Stop Guessing What to Learn Next
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get AI-powered career clarity with your personalized roadmap to higher pay and better opportunities.
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Your Career Roadmap Includes:</h2>
            <div className="grid gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hidden Career Matches Report</h3>
                  <p className="text-gray-600 text-sm">Discover 3-5 high-paying, alternative career paths you're already qualified for.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Priority Skills Gap Analysis</h3>
                  <p className="text-gray-600 text-sm">A precise, prioritized list of the exact high-ROI skills and certifications you need.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Personalized 90-Day Action Plan</h3>
                  <p className="text-gray-600 text-sm">A week-by-week learning roadmap with specific courses, resources, and milestones.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Data-Driven Salary Projections</h3>
                  <p className="text-gray-600 text-sm">Potential earnings for your current path and new alternatives.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Lifetime Access</h3>
                  <p className="text-gray-600 text-sm">Re-run your analysis anytime as your career evolves.</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={getCareerRoadmap}
            disabled={isLoading}
            className="bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Processing...' : 'Get Your Career Roadmap - $97 (Limited Launch Offer)'}
          </button>
          
          <p className="text-gray-500 text-sm mt-4">One-time payment • Lifetime access • 30-day money-back guarantee</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 mb-8">Join professionals who transformed their careers</p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-500">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2563EB]">2.5x</div>
              <div className="text-sm">Faster career growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2563EB]">$28k</div>
              <div className="text-sm">Average salary increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2563EB]">94%</div>
              <div className="text-sm">Achieve career goals</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}