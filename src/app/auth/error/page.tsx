'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// The error component that uses searchParams
function ErrorContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason') || 'unknown'
  const message = searchParams.get('message') || ''
  
  let errorTitle = 'Authentication Failed'
  let errorDescription = 'An error occurred during authentication.'
  
  switch(reason) {
    case 'no_session':
      errorDescription = 'Authentication session not found. Please try again.'
      break
    case 'session_expired':
      errorDescription = 'Authentication session expired. Please try again.'
      break
    case 'invalid_state':
      errorDescription = 'Invalid state parameter. This could be a security issue.'
      break
    case 'no_code':
      errorDescription = 'No authorization code received from Fitbit.'
      break
    case 'token_error':
      errorDescription = `Failed to exchange code for token: ${message}`
      break
    case 'missing_secret':
      errorDescription = 'Server configuration error: Missing client secret.'
      break
    default:
      errorDescription = 'An unknown error occurred.'
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <h1 className="text-2xl font-newsreader mb-4 text-red-600">{errorTitle}</h1>
        <p className="text-gray-600 mb-6">{errorDescription}</p>
        <div className="text-center text-red-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <Link href="/" className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-700 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  )
}

// Main page component with Suspense
export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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