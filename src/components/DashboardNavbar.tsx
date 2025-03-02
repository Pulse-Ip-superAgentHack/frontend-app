'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getTokens, removeTokens } from '@/utils/tokenStorage'

const DashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  
  // Format current date: e.g., "Wed, Feb 26"
  const today = new Date()
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }
  const formattedDate = today.toLocaleDateString('en-US', dateOptions)

  useEffect(() => {
    // Check authentication status
    const tokens = getTokens()
    setIsAuthenticated(!!tokens)
    
    // Listen for storage events (for multi-tab support)
    const handleStorageChange = () => {
      const tokens = getTokens()
      setIsAuthenticated(!!tokens)
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogin = () => {
    router.push('/auth/signin')
  }

  const handleLogout = () => {
    removeTokens()
    localStorage.removeItem('fitbitData')
    setIsAuthenticated(false)
    router.push('/')
  }

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Updated Logo - Green with Inter font, no icon */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/dashboard" className="flex items-center">
            <div className="overflow-hidden h-14 w-[100px] relative">
              <Image 
                src="/pulse_logo.png" 
                alt="Pulse Logo" 
                fill
                sizes="100px"
                className="object-cover object-center scale-125"
                style={{ objectPosition: "center 50%" }}
              />
            </div>
          </Link>
        </motion.div>
        
        {/* Right section - Date & buttons */}
        <div className="flex items-center space-x-4">
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Date display with font-inter for numbers */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5">
              <span className="text-sm text-gray-800">
                <span className="font-newsreader-light">Wed, </span>
                <span className="font-inter">Feb 26</span>
              </span>
            </div>
          </motion.div>
          
          {/* Authentication button */}
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors px-4 py-2 text-sm"
            >
              Log Out
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="rounded-full bg-lime-600 text-white hover:bg-lime-700 transition-colors px-4 py-2 text-sm"
            >
              Sign In
            </button>
          )}
          
          {/* Marketplace icon */}
          <Link href="/marketplace" className="rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center justify-center h-8 w-8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5"
            >
              <path d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75z" />
            </svg>
          </Link>
          
          {/* User account icon - Navigate to dashboard */}
          <Link href="/dashboard" className="rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center justify-center h-8 w-8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5"
            >
              <path 
                fillRule="evenodd" 
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute right-4 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <Link 
            href="/demo-dashboard" 
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            href="/raw" 
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            View Raw Data
          </Link>
          <Link 
            href="/account" 
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Account
          </Link>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </motion.div>
      )}
    </nav>
  )
}

export default DashboardNavbar 