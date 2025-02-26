'use client'

import { useEffect, useState } from 'react'
import { getTokens } from '@/utils/tokenStorage'
import { useRouter } from 'next/navigation'

export default function RawDataPage() {
  const [rawData, setRawData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRawData = async () => {
      try {
        setLoading(true)
        const tokens = getTokens()
        
        if (!tokens) {
          // Redirect to login if no tokens
          router.push('/auth/signin')
          return
        }
        
        // Fetch raw data from API
        const response = await fetch('/api/fitbit/raw', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch raw data')
        }
        
        const data = await response.json()
        setRawData(data)
      } catch (error) {
        console.error('Error fetching raw data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRawData()
  }, [router])
  
  const handleCopyData = () => {
    navigator.clipboard.writeText(JSON.stringify(rawData, null, 2))
      .then(() => alert('Data copied to clipboard'))
      .catch(err => console.error('Failed to copy data:', err))
  }
  
  const handleRefreshData = () => {
    setLoading(true)
    fetchRawData()
  }
  
  const handleLogout = () => {
    localStorage.removeItem('fitbitTokens')
    localStorage.removeItem('fitbitData')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading raw data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Fitbit Raw Data</h1>
          <div className="flex space-x-4">
            <button 
              onClick={handleCopyData}
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Copy Data
            </button>
            <button 
              onClick={handleRefreshData}
              className="bg-green-600 text-white py-2 px-4 rounded"
            >
              Refresh Data
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded"
            >
              Log Out
            </button>
          </div>
        </div>
        
        <pre className="bg-gray-900 p-6 rounded-lg overflow-auto max-h-[70vh] text-xs md:text-sm">
          <code className="text-green-400">
            {JSON.stringify(rawData, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  )
} 