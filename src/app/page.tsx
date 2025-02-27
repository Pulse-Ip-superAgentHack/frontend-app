'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LandingPage() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden relative">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.4
      }}></div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-newsreader font-bold text-gray-800 leading-tight mb-6">
              Connect Your Fitness Data to <span className="text-lime-600">Your Life</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Empowering your wellness journey with real-time, accurate health insights tailored for your personal fitness goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => router.push('/api/auth/initiate')}
                className="bg-lime-600 text-white py-3 px-8 rounded-md hover:bg-lime-700 transition-all shadow-md text-lg"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Get Started
              </button>
              <Link href="/dashboard" className="border border-gray-300 text-gray-700 py-3 px-8 rounded-md hover:bg-gray-50 transition-all text-center text-lg">
                Learn More
              </Link>
            </div>
            
            <p className="mt-8 text-gray-500 text-sm">
              Trusted by fitness enthusiasts around the world
            </p>
          </div>
          
          <div className="relative">
            {/* 3D Elements */}
            <div className="relative h-[400px] perspective">
              <div className="absolute top-10 left-20 w-24 h-24 bg-blue-200 rounded-md transform rotate-12 transition-transform duration-700 ease-in-out shadow-lg" 
                style={{ transform: isHovering ? 'rotateX(10deg) rotateY(20deg) translateZ(20px)' : 'rotateX(5deg) rotateY(10deg) translateZ(0)' }}>
              </div>
              <div className="absolute top-40 left-40 w-20 h-20 bg-lime-200 rounded-md transform -rotate-6 transition-transform duration-700 ease-in-out delay-100 shadow-lg"
                style={{ transform: isHovering ? 'rotateX(-15deg) rotateY(-10deg) translateZ(40px)' : 'rotateX(-5deg) rotateY(-5deg) translateZ(0)' }}>
              </div>
              <div className="absolute top-60 left-10 w-28 h-28 bg-pink-200 rounded-md transform rotate-45 transition-transform duration-700 ease-in-out delay-200 shadow-lg"
                style={{ transform: isHovering ? 'rotateX(20deg) rotateY(-15deg) translateZ(30px)' : 'rotateX(10deg) rotateY(-5deg) translateZ(0)' }}>
              </div>
              <div className="absolute top-20 left-60 w-32 h-32 bg-yellow-200 rounded-md transform -rotate-12 transition-transform duration-700 ease-in-out delay-150 shadow-lg"
                style={{ transform: isHovering ? 'rotateX(-10deg) rotateY(25deg) translateZ(50px)' : 'rotateX(-5deg) rotateY(15deg) translateZ(0)' }}>
              </div>
              <div className="absolute top-80 left-50 w-36 h-36 bg-purple-200 rounded-md transform rotate-15 transition-transform duration-700 ease-in-out delay-300 shadow-lg"
                style={{ transform: isHovering ? 'rotateX(15deg) rotateY(-20deg) translateZ(60px)' : 'rotateX(5deg) rotateY(-10deg) translateZ(0)' }}>
              </div>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="mt-24 bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h2 className="text-3xl font-newsreader font-bold text-gray-800 mb-6">How to Use PulseIP</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="bg-lime-100 text-lime-800 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-1">1</div>
                <div>
                  <h3 className="font-medium text-gray-900">Connect Your Fitbit</h3>
                  <p className="text-gray-600 mt-1">Click "Get Started" and sign in with your Fitbit account to authorize the app.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-lime-100 text-lime-800 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-1">2</div>
                <div>
                  <h3 className="font-medium text-gray-900">View Your Data</h3>
                  <p className="text-gray-600 mt-1">After authorization, you'll be redirected to the dashboard with your health data.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-lime-100 text-lime-800 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-1">3</div>
                <div>
                  <h3 className="font-medium text-gray-900">Access Insights</h3>
                  <p className="text-gray-600 mt-1">Explore your activity, sleep, heart rate, and more through our intuitive interface.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Why This Works</h3>
              <p className="text-gray-600 mb-4">
                This application uses OAuth 2.0 to securely access your Fitbit data. The token we obtain allows us to access your data without storing your password.
              </p>
              <p className="text-gray-600 mb-4">
                We store this token locally in your browser, so you won't need to authorize again for a while.
              </p>
              <p className="text-gray-600 font-medium">
                Your data stays on your device - we don't store it on any server.
              </p>
              
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-blue-700 text-sm">
                  <strong>Privacy First:</strong> We never see or store your personal health data. Everything happens securely on your device.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-newsreader font-bold text-gray-800 mb-6">Ready to experience your data in a new way?</h2>
          <button 
            onClick={() => router.push('/api/auth/initiate')}
            className="bg-lime-600 text-white py-3 px-8 rounded-md hover:bg-lime-700 transition-all shadow-md text-lg"
          >
            Connect Your Fitbit
          </button>
        </div>
      </div>
    </div>
  )
}
