'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getTokens } from '@/utils/tokenStorage'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if token exists
    const tokens = getTokens()
    setIsLoggedIn(!!tokens)
    
    // Set up a listener for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      const tokens = getTokens()
      setIsLoggedIn(!!tokens)
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleSignup = () => {
    // Clear any stored data before starting new auth flow
    localStorage.removeItem('fitbitData')
    
    const FITBIT_CLIENT_ID = process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID
    const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI
    const SCOPES = [
      'activity',
      'cardio_fitness',
      'electrocardiogram',
      'heartrate',
      'irregular_rhythm_notifications',
      'location',
      'nutrition',
      'oxygen_saturation',
      'profile',
      'respiratory_rate',
      'settings',
      'sleep',
      'social',
      'temperature',
      'weight'
    ].join(' ')

    const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${FITBIT_CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    
    window.location.href = authUrl
  }

  const handleLogout = () => {
    localStorage.removeItem('fitbitTokens')
    localStorage.removeItem('fitbitData')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <nav className="w-full bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-semibold text-xl hover:text-gray-300 transition-colors">
              Hackathon
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <Link 
              href="/raw" 
              className="text-white hover:text-gray-300 transition-colors"
            >
              View Data
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  href="/account" 
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={handleSignup}
                className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 