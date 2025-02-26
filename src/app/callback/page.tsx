'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { saveTokens } from '@/utils/tokenStorage'

// Component that uses searchParams (needs to be wrapped in Suspense)
function CallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the authorization code and state from URL
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        
        // Get the stored state and code verifier
        const storedState = localStorage.getItem('fitbitState')
        const codeVerifier = localStorage.getItem('fitbitCodeVerifier')
        
        // Validate state parameter to prevent CSRF attacks
        if (!state || state !== storedState) {
          throw new Error('Invalid state parameter')
        }
        
        if (!code) {
          throw new Error('No authorization code received')
        }
        
        if (!codeVerifier) {
          throw new Error('Code verifier not found')
        }
        
        // Exchange authorization code for tokens
        const tokenResponse = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
            redirect_uri: process.env.NODE_ENV === 'production'
              ? 'https://pulseip.shreyanshgajjar.com/callback'
              : 'http://localhost:3000/callback'
          })
        })
        
        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          console.error('Token exchange failed:', errorData)
          throw new Error(errorData.error || 'Failed to exchange authorization code for tokens')
        }
        
        const tokens = await tokenResponse.json()
        
        // Save tokens to localStorage
        saveTokens(tokens)
        
        // Clear state and code verifier
        localStorage.removeItem('fitbitState')
        localStorage.removeItem('fitbitCodeVerifier')
        
        setStatus('success')
        setMessage('Authentication successful!')
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } catch (error) {
        console.error('Authentication error:', error)
        setStatus('error')
        setMessage(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`)
        
        // Redirect to home after a short delay
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
    }
    
    processCallback()
  }, [searchParams, router])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-newsreader mb-4">
          {status === 'loading' ? 'Processing Authentication' : 
           status === 'success' ? 'Authentication Successful' : 'Authentication Failed'}
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        {status === 'loading' && (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500 mx-auto"></div>
        )}
        {status === 'success' && (
          <div className="text-center text-lime-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="mt-2">Redirecting to dashboard...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="text-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="mt-2">Redirecting to home...</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
          <h1 className="text-2xl font-newsreader mb-4">Loading...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500 mx-auto"></div>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
} 