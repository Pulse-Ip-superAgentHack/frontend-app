'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RawDataPage() {
  const [rawData, setRawData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchRawData = async () => {
    try {
      setLoading(true)
      
      // Instead of direct API calls, use our server API
      const response = await fetch('/api/fitbit/data')
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Not authenticated, redirecting...')
          // Redirect to login
          router.push('/api/auth/initiate')
          return
        }
        throw new Error(`API request failed with status ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Raw data fetched:', Object.keys(data))
      setRawData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setRawData({
        error: String(error)
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRawData()
  }, [])

  const handleRefreshData = () => {
    setLoading(true)
    fetchRawData()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-newsreader text-gray-900">Fitbit Raw Data</h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(rawData, null, 2))
                alert('Data copied to clipboard!')
              }}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              disabled={loading || !rawData}
            >
              Copy Data
            </button>
            <button 
              onClick={handleRefreshData}
              className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-700 transition-colors"
              disabled={loading}
            >
              Refresh Data
            </button>
            <button 
              onClick={() => router.push('/api/auth/logout')}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden p-4">
            <pre className="text-green-400 overflow-auto max-h-[70vh] text-xs md:text-sm">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 