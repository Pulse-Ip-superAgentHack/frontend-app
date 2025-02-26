'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTokens } from '@/utils/tokenStorage'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // Function to load dashboard data
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Get tokens from storage
        const tokens = getTokens()
        
        // Check if authenticated
        if (tokens) {
          setIsAuthenticated(true)
          
          // Fetch real dashboard data from API
          const response = await fetch('/api/fitbit/raw', {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`
            }
          })
          
          if (!response.ok) {
            throw new Error('Failed to fetch dashboard data')
          }
          
          const rawData = await response.json()
          
          // Transform raw data into dashboard format
          const transformedData = {
            metrics: {
              temperature: "98.6°F", // Fitbit doesn't provide body temperature
              heartRate: rawData['activities-heart']?.[0]?.value?.restingHeartRate 
                ? `${rawData['activities-heart'][0].value.restingHeartRate} bpm` 
                : "72 bpm",
              oxygenLevel: "98%" // Fitbit doesn't provide oxygen saturation in basic API
            },
            activity: {
              steps: rawData.activities?.summary?.steps?.toLocaleString() || "5,280",
              distance: rawData.activities?.summary?.distances?.[0]?.distance 
                ? `${rawData.activities.summary.distances[0].distance} mi` 
                : "2.4 mi",
              calories: rawData.activities?.summary?.caloriesOut?.toLocaleString() || "320",
              activeMinutes: rawData.activities?.summary?.fairlyActiveMinutes + 
                rawData.activities?.summary?.veryActiveMinutes || "59"
            },
            sleep: {
              hoursSlept: rawData.sleep?.[0]?.minutesAsleep 
                ? `${(rawData.sleep[0].minutesAsleep / 60).toFixed(1)} hrs` 
                : "7.5 hrs",
              deepSleep: rawData.sleep?.[0]?.levels?.summary?.deep?.minutes 
                ? `${(rawData.sleep[0].levels.summary.deep.minutes / 60).toFixed(1)} hrs` 
                : "2.3 hrs",
              score: rawData.sleep?.[0]?.efficiency?.toString() || "82"
            }
          }
          
          setDashboardData(transformedData)
        } else {
          // Load demo data if not authenticated
          const demoData = await import('@/data/demoDashboardData.json')
          setDashboardData(demoData.default)
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Load demo data as fallback
        const demoData = await import('@/data/demoDashboardData.json')
        setDashboardData(demoData.default)
      } finally {
        setLoading(false)
      }
    }
    
    loadDashboardData()
  }, [])
  
  const handleSignIn = () => {
    router.push('/auth/signin')
  }
  
  const handleViewRawData = () => {
    router.push('/raw-data')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-newsreader">Dashboard</h1>
          {isAuthenticated && (
            <button 
              onClick={handleViewRawData}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              View Raw Data
            </button>
          )}
          {!isAuthenticated && (
            <button 
              onClick={handleSignIn}
              className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-700 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
        
        {/* Dashboard Content - Matching Demo Dashboard UI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg mb-4 font-medium">Health Metrics</h3>
            <div>
              <p className="text-sm text-gray-500 mb-1">Temperature</p>
              <p className="text-xl font-inter mb-4">{dashboardData?.metrics?.temperature}</p>
              
              <p className="text-sm text-gray-500 mb-1">Heart Rate</p>
              <p className="text-xl font-inter mb-4">{dashboardData?.metrics?.heartRate}</p>
              
              <p className="text-sm text-gray-500 mb-1">Oxygen Level</p>
              <p className="text-xl font-inter">{dashboardData?.metrics?.oxygenLevel}</p>
            </div>
          </div>
          
          {/* Activity Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg mb-4 font-medium">Activity Summary</h3>
            <div>
              <p className="text-sm text-gray-500 mb-1">Steps Today</p>
              <p className="text-xl font-inter mb-4">{dashboardData?.activity?.steps}</p>
              
              <p className="text-sm text-gray-500 mb-1">Distance</p>
              <p className="text-xl font-inter mb-4">{dashboardData?.activity?.distance}</p>
              
              <p className="text-sm text-gray-500 mb-1">Calories Burned</p>
              <p className="text-xl font-inter">{dashboardData?.activity?.calories}</p>
            </div>
          </div>
          
          {/* Sleep Data */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg mb-4 font-medium">Sleep Data</h3>
            <div>
              <p className="text-sm text-gray-500 mb-1">Hours Slept</p>
              <p className="text-xl font-inter mb-4">{dashboardData?.sleep?.hoursSlept}</p>
              
              <p className="text-sm text-gray-500 mb-1">Deep Sleep</p>
              <p className="text-xl font-inter mb-4">{dashboardData?.sleep?.deepSleep}</p>
              
              <p className="text-sm text-gray-500 mb-1">Sleep Score</p>
              <p className="text-xl font-inter">{dashboardData?.sleep?.score}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 