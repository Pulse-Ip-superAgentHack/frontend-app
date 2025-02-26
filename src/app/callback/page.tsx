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
        // Get the code from the URL
        const code = searchParams.get('code')
        
        if (!code) {
          setStatus('Error: No authorization code received')
          return
        }
        
        console.log('Callback received, code:', code.substring(0, 10) + '...')
        
        // Make a direct server request to exchange the code
        const response = await fetch(`/api/auth/exchange?code=${encodeURIComponent(code)}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          setStatus(`Authentication error: ${errorData.error || 'Unknown error'}`)
          return
        }
        
        // Successful authentication, redirect to dashboard
        router.push('/dashboard')
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