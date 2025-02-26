'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Component that uses searchParams
function CallbackContent() {
  const [status, setStatus] = useState('Processing...')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get the code and state from the URL
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        
        if (!code) {
          setStatus('Error: No authorization code received')
          return
        }
        
        // Get code verifier from localStorage (fallback method)
        const codeVerifier = localStorage.getItem('fitbit_code_verifier')
        
        console.log('Callback received, code:', code.substring(0, 10) + '...')
        console.log('Code verifier exists in localStorage:', !!codeVerifier)
        
        // Forward to our API route to complete the flow
        // Include all necessary parameters
        const completeUrl = `/api/auth/complete?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || '')}&code_verifier=${encodeURIComponent(codeVerifier || '')}`
        
        setStatus('Completing authentication...')
        
        // Redirect to the complete endpoint
        router.push(completeUrl)
      } catch (error) {
        console.error('Error in callback handling:', error)
        setStatus(`Authentication error: ${error.message}`)
      }
    }
    
    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <h1 className="text-2xl font-newsreader mb-4">OAuth Callback</h1>
        <p className="text-gray-600 mb-6">{status}</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500 mx-auto"></div>
      </div>
    </div>
  )
}

// Main page component with Suspense
export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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