'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getTokens } from '@/utils/tokenStorage'

// Remove or use FitbitData
// You can comment it out if not using
// import { FitbitData } from '@/types/fitbit'

// Or define proper types to use it
interface FitbitData {
  profile?: {
    user: {
      fullName: string
      age: number
      height: number
      weight: number
      averageDailySteps: number
    }
  }
  activities?: {
    summary: {
      steps: number
      calories: number
      distance: number
      activeMinutes: number
    }
  }
  sleep?: {
    summary: {
      totalMinutesAsleep: number
      totalTimeInBed: number
    }
  }
  heartRate?: {
    'activities-heart': Array<{
      value: {
        restingHeartRate: number
      }
    }>
  }
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
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
          const response = await fetch('/api/dashboard', {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`
            }
          })
          
          if (!response.ok) {
            throw new Error('Failed to fetch dashboard data')
          }
          
          const data = await response.json()
          setDashboardData(data)
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-newsreader">Dashboard</h1>
          <div className="flex space-x-4">
            {!isAuthenticated ? (
              <button 
                onClick={handleSignIn}
                className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-700 transition-colors"
              >
                Sign In
              </button>
            ) : (
              <button 
                onClick={handleViewRawData}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                View Raw Data
              </button>
            )}
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Health Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg mb-3">Health Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="text-2xl font-inter">{dashboardData?.metrics?.temperature || "98.6°F"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Heart Rate</p>
                <p className="text-2xl font-inter">{dashboardData?.metrics?.heartRate || "72 bpm"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Oxygen Level</p>
                <p className="text-2xl font-inter">{dashboardData?.metrics?.oxygenLevel || "98%"}</p>
              </div>
            </div>
          </div>
          
          {/* Activity Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg mb-3">Activity Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Steps Today</p>
                <p className="text-2xl font-inter">{dashboardData?.activity?.steps || "5,280"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Distance</p>
                <p className="text-2xl font-inter">{dashboardData?.activity?.distance || "2.4 mi"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Calories Burned</p>
                <p className="text-2xl font-inter">{dashboardData?.activity?.calories || "320"}</p>
              </div>
            </div>
          </div>
          
          {/* Sleep Data */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg mb-3">Sleep Data</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Hours Slept</p>
                <p className="text-2xl font-inter">{dashboardData?.sleep?.hoursSlept || "7.5 hrs"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deep Sleep</p>
                <p className="text-2xl font-inter">{dashboardData?.sleep?.deepSleep || "2.3 hrs"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sleep Score</p>
                <p className="text-2xl font-inter">{dashboardData?.sleep?.score || "82"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 