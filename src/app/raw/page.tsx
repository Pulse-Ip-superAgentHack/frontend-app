'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { saveTokens, getTokens, isTokenExpired } from '@/utils/tokenStorage'

// Component that uses search params
function RawContent() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')

  useEffect(() => {
    // If code is provided in URL, process it
    if (code) {
      fetchDataWithCode(code)
    }

    // Check for stored data
    const storedData = localStorage.getItem('fitbitData')
    if (storedData) {
      try {
        setData(JSON.parse(storedData))
      } catch (err) {
        console.error('Error parsing stored data:', err)
      }
    }
  }, [code])

  const fetchDataWithCode = async (code: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/raw?code=${code}`)
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Save tokens and data
      saveTokens(result.tokens)
      localStorage.setItem('fitbitData', JSON.stringify(result))
      
      setData(result)
      // Clear code from URL
      router.push('/raw')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualCode) {
      setError('Please enter a code')
      return
    }
    
    await fetchDataWithCode(manualCode)
  }

  const handleRefreshData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const accessToken = await getValidToken()
      if (!accessToken) {
        throw new Error('No valid token available. Please re-authorize.')
      }
      
      // Fetch new data with valid token
      const newData = await fetchData(accessToken)
      setData(newData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const getValidToken = async () => {
    const tokens = getTokens()
    if (!tokens) return null
    
    if (isTokenExpired()) {
      try {
        // Refresh token
        const response = await fetch('/api/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refresh_token: tokens.refresh_token
          })
        })
        
        const newTokens = await response.json()
        if (newTokens.error) {
          throw new Error(newTokens.error)
        }
        
        saveTokens(newTokens)
        return newTokens.access_token
      } catch (err) {
        throw new Error('Token refresh failed. Please re-authorize.')
      }
    }
    
    return tokens.access_token
  }

  const fetchData = async (accessToken: string) => {
    // Fetch data using access token
    const response = await fetch('/api/get-data', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }
    
    // Store the data
    localStorage.setItem('fitbitData', JSON.stringify(data))
    
    return data
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Fitbit Raw Data</h1>
      
      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded-md border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {!data && !loading && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Enter Authorization Code</h2>
          <p className="text-sm text-gray-600 mb-4">
            After signing in with Fitbit, copy the code from the URL <code>shreyanshgajjar.com/?code=YOUR_CODE</code> and paste it below:
          </p>
          
          <form onSubmit={handleManualSubmit} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Paste your authorization code here"
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              Submit
            </button>
          </form>
        </div>
      )}
      
      {data && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleRefreshData}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              Refresh Data
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  )
}

// Main component with proper suspense boundary
export default function RawPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <RawContent />
    </Suspense>
  )
} 