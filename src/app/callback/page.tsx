'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { saveTokens } from '@/utils/tokenStorage'

// Component that uses search params
function CallbackContent() {
  const [status, setStatus] = useState('Processing your login...')
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')

  useEffect(() => {
    const processCode = async () => {
      if (!code) {
        setStatus('No authorization code found')
        setTimeout(() => router.push('/'), 2000)
        return
      }

      try {
        setStatus('Exchanging authorization code for tokens...')
        const response = await fetch(`/api/auth/callback?code=${code}`)
        const data = await response.json()

        if (data.error || data.errors) {
          throw new Error(data.error || data.errors?.[0]?.message)
        }

        // Save tokens and data
        saveTokens(data.tokens)
        localStorage.setItem('fitbitData', JSON.stringify(data))
        
        setStatus('Login successful! Redirecting...')
        setTimeout(() => router.push('/account'), 1000)
      } catch (error) {
        console.error('Login error:', error)
        setStatus(`Error: ${error instanceof Error ? error.message : 'Login failed'}`)
        setTimeout(() => router.push('/'), 3000)
      }
    }

    processCode()
  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="animate-pulse mb-4">
          <div className="mx-auto w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Fitbit Login</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}

// Main component with proper suspense boundary
export default function Callback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse">
          <div className="mx-auto w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Loading...</h2>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
} 