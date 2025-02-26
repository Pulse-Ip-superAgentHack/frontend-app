'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Component that uses searchParams (needs Suspense)
function ErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const reasonParam = searchParams.get('reason') || 'unknown_error'
    const messageParam = searchParams.get('message') || ''
    
    setReason(reasonParam)
    setMessage(messageParam)
    
    // Log additional info for debugging
    console.error('Auth error:', { reason: reasonParam, message: messageParam })
    
    // If code verifier issue, log localStorage values
    if (reasonParam === 'no_verifier') {
      const hasVerifier = !!localStorage.getItem('fitbit_code_verifier')
      console.log('LocalStorage verifier exists:', hasVerifier)
    }
  }, [searchParams])

  // Human readable error messages
  const getErrorMessage = () => {
    switch (reason) {
      case 'no_session':
        return 'No authentication session was found. Please try again.'
      case 'session_expired': 
        return 'Your authentication session has expired. Please try again.'
      case 'invalid_state':
        return 'Invalid state parameter. This could be a security issue.'
      case 'no_code':
        return 'No authorization code was received from Fitbit.'
      case 'no_verifier':
        return 'Code verifier not found. This is required for secure authentication.'
      case 'token_error':
        return `Token exchange failed: ${message || 'Unknown error'}`
      case 'missing_secret':
        return 'Application configuration error. Please contact support.'
      case 'server_error':
        return 'A server error occurred during authentication.'
      default:
        return 'An unknown error occurred during authentication.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <h1 className="text-2xl font-newsreader mb-4">Authentication Failed</h1>
        <p className="text-gray-600 mb-6">{getErrorMessage()}</p>
        
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 text-left">
          <p className="text-red-700 text-sm">
            Error: {reason}
            {message && <span className="block mt-1">{message}</span>}
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/')}
          className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  )
}

// Main page component with Suspense wrapper
export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
          <h1 className="text-2xl font-newsreader mb-4">Loading...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500 mx-auto"></div>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
} 