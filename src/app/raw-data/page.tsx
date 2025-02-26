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
        
        // Get the tokens from storage
        const tokens = getTokens()
        
        if (!tokens || !tokens.access_token) {
          console.error('No access token available')
          return
        }
        
        // Fix: Properly format date parameters
        const today = new Date()
        const dateStr = today.toISOString().split('T')[0] // Format: YYYY-MM-DD
        
        // Use proper date formatting and endpoint structure
        const activitiesUrl = `https://api.fitbit.com/1/user/-/activities/date/${dateStr}.json`
        const sleepUrl = `https://api.fitbit.com/1.2/user/-/sleep/date/${dateStr}.json`
        const stepsUrl = `https://api.fitbit.com/1/user/-/activities/steps/date/${dateStr}/7d.json`
        
        // Get user profile to properly identify the user
        const profileUrl = 'https://api.fitbit.com/1/user/-/profile.json'
        
        // Make requests with proper authorization
        const [profileResponse, activitiesResponse, sleepResponse, stepsResponse] = await Promise.all([
          fetch(profileUrl, {
            headers: {
              'Authorization': `Bearer ${tokens.access_token}`
            }
          }),
          fetch(activitiesUrl, {
            headers: {
              'Authorization': `Bearer ${tokens.access_token}`
            }
          }),
          fetch(sleepUrl, {
            headers: {
              'Authorization': `Bearer ${tokens.access_token}`
            }
          }),
          fetch(stepsUrl, {
            headers: {
              'Authorization': `Bearer ${tokens.access_token}`
            }
          })
        ])
        
        // Process the responses
        const profile = await profileResponse.json()
        const activities = activitiesResponse.ok ? await activitiesResponse.json() : { error: `API Error: ${activitiesResponse.status}` }
        const sleep = sleepResponse.ok ? await sleepResponse.json() : { error: `API Error: ${sleepResponse.status}` }
        const steps = stepsResponse.ok ? await stepsResponse.json() : { error: `API Error: ${stepsResponse.status}` }
        
        // Use the actual user ID from the profile
        const userData = {
          tokens: {
            access_token: tokens.access_token.substring(0, 10) + '...',
            user_id: profile.user?.encodedId || 'unknown'
          },
          activities,
          sleep,
          'activities-steps': steps
        }
        
        setRawData(userData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setRawData({
          error: String(error)
        })
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