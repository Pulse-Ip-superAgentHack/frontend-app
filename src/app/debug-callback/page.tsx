'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { saveTokens } from '@/utils/tokenStorage'

// Component that uses searchParams (needs to be wrapped in Suspense)
function DebugCallbackContent() {
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Processing authentication...')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const processCallback = async () => {
      try {
        // Only get the code, ignore state
        const code = searchParams.get('code')
        
        // Get code verifier from any available source
        const codeVerifier = localStorage.getItem('fitbitCodeVerifier') || 
                            sessionStorage.getItem('fitbitCodeVerifier')
        
        console.log('Debug callback processing code:', code?.substring(0, 10))
        console.log('Code verifier exists:', !!codeVerifier)
        
        if (!code) {
          throw new Error('No code in URL')
        }
        
        if (!codeVerifier) {
          throw new Error('No code verifier found')
        }
        
        // Exchange for token
        const tokenResponse = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
            redirect_uri: 'https://pulseip.shreyanshgajjar.com/callback'
          })
        })
        
        const tokens = await tokenResponse.json()
        
        if (!tokenResponse.ok) {
          throw new Error(tokens.error || 'Token exchange failed')
        }
        
        // Save tokens
        saveTokens(tokens)
        
        // Success!
        setStatus('success')
        setMessage('Authentication successful!')
        
        // Redirect to dashboard
        setTimeout(() => router.push('/dashboard'), 1500)
      } catch (error) {
        console.error('Debug auth error:', error)
        setStatus('error')
        setMessage(String(error))
      }
    }
    
    processCallback()
  }, [searchParams, router])
  
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl mb-4">Debug OAuth Callback</h1>
      <p className="mb-4">Status: {status}</p>
      <p className="mb-4">Message: {message}</p>
      {status === 'success' && (
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </button>
      )}
      {status === 'error' && (
        <button 
          onClick={() => router.push('/')}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      )}
    </div>
  )
}

// Main page component with Suspense boundary
export default function DebugCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-6">
        <h1 className="text-2xl mb-4">Debug OAuth Callback</h1>
        <p className="mb-4">Loading...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    }>
      <DebugCallbackContent />
    </Suspense>
  )
} 