'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    // Check for the authentication cookie that we set
    const checkAuthStatus = () => {
      setIsLoggedIn(document.cookie.includes('fitbit_authenticated=true'))
    }
    
    checkAuthStatus()
    
    // Listen for storage events in case other tabs update auth state
    window.addEventListener('storage', checkAuthStatus)
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus)
    }
  }, [])
  
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-newsreader text-xl font-medium">Pulse<span className="text-lime-600">IP</span></span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link href="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/dashboard' ? 'border-lime-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Dashboard
              </Link>
              <Link href="/account" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/account' ? 'border-lime-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Account
              </Link>
              <Link href="/raw-data" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/raw-data' ? 'border-lime-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Raw Data
              </Link>
              {process.env.NEXT_PUBLIC_ENABLE_RESEARCH !== 'false' && (
                <Link href="/research" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/research' ? 'border-lime-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Research
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <Link 
                href="/api/auth/logout" 
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Log Out
              </Link>
            ) : (
              <Link 
                href="/api/auth/initiate" 
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 