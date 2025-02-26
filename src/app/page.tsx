'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  useEffect(() => {
    // Check if user is already authenticated
    const isLoggedIn = document.cookie.includes('fitbit_authenticated=true')
    setIsAuthenticated(isLoggedIn)
    setCheckingAuth(false)
    
    // Optional: If already authenticated, redirect to dashboard
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [router])
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Fitbit Data Viewer</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to use:</h2>
          <ol className="list-decimal pl-5 space-y-3 text-gray-800">
            <li>Click <strong>&quot;Get New Data&quot;</strong> in the navigation bar</li>
            <li>Sign in with your Fitbit account and authorize the app</li>
            <li>After authorization, you&apos;ll be redirected to <code className="bg-gray-100 px-1 py-0.5 rounded">shreyanshgajjar.com</code> with a code in the URL</li>
            <li>Copy the code from the URL: <code className="bg-gray-100 px-1 py-0.5 rounded">shreyanshgajjar.com/?code=YOUR_CODE</code></li>
            <li>Click <strong>&quot;View Data&quot;</strong> and paste your code in the form</li>
            <li>Your Fitbit data will be displayed and stored for future viewing</li>
          </ol>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Why this works:</h2>
          <p className="mb-4 text-gray-800">
            This application uses OAuth 2.0 to securely access your Fitbit data. 
            The token we obtain allows us to access your data without storing your password.
            We store this token locally in your browser, so you won't need to authorize again for a while.
          </p>
          <p className="text-gray-800">
            <strong>Your data stays on your device</strong> - we don't store it on any server.
          </p>
        </div>
        
        {/* Update the sign-in button based on auth state */}
        {!checkingAuth && (
          <div className="mt-8">
            {isAuthenticated ? (
              <Link href="/dashboard" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/api/auth/initiate" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700">
                Connect with Fitbit
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
