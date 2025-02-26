'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTokens } from '@/utils/tokenStorage'
import { motion, AnimatePresence } from 'framer-motion'

const DashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  
  // Format current date: e.g., "Wed, Feb 26"
  const today = new Date()
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }
  const formattedDate = today.toLocaleDateString('en-US', dateOptions)

  const handleLogout = () => {
    localStorage.removeItem('fitbitTokens')
    localStorage.removeItem('fitbitData')
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
          <Link href="/demo-dashboard" className="flex items-center">
            <div className="rounded-full p-3 flex items-center shadow-sm">
              <span className="font-inter font-bold text-gray-900">Pulse <span className="text-lime-600">IP</span></span>
            </div>
          </Link>
        </motion.div>
        
        {/* Right section - Date & icons */}
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
          
          {/* Marketplace icon - Updated SVG */}
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
          
          {/* User account icon */}
          <Link href="/account" className="rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center justify-center h-8 w-8">
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
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden absolute right-4 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
      </AnimatePresence>
    </nav>
  )
}

export default DashboardNavbar 