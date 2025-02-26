'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Component that uses search params
function TestContent() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    if (code) {
      fetch(`/api/test?code=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(Array.isArray(data.error) 
              ? data.error[0].message 
              : data.error)
            setLoading(false)
            return
          }
          setData(data)
          setLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setLoading(false)
        })
    } else {
      setError('No authorization code provided')
      setLoading(false)
    }
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg max-w-lg w-full">
          <h3 className="text-red-800 font-medium text-lg mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  // Rest of your component...
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Fitbit Test Data</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Access Token:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {data.tokens?.access_token}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Profile Data:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(data.profile, null, 2)}
        </pre>
      </div>
    </div>
  )
}

// Main component with proper suspense boundary
export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <TestContent />
    </Suspense>
  )
} 