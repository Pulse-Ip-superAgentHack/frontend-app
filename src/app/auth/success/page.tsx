'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthSuccess() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to dashboard after short delay
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [router])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <h1 className="text-2xl font-newsreader mb-4">Authentication Successful!</h1>
        <p className="text-gray-600 mb-6">
          You've successfully connected your Fitbit account.
        </p>
        <div className="text-center text-lime-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    </div>
  )
} 