'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

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

// Content component that uses search params
function DashboardContent() {
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
            // Handle API error response
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-yellow-800 font-medium">No Data Available</h3>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  // Add raw data display for debugging
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Debug Information</h2>
          <div className="overflow-x-auto">
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-semibold">{data.profile?.user.fullName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Age</p>
              <p className="text-lg font-semibold">{data.profile?.user.age} years</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Height</p>
              <p className="text-lg font-semibold">{data.profile?.user.height} cm</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="text-lg font-semibold">{data.profile?.user.weight} kg</p>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Today&apos;s Activity</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Steps</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.activities?.summary.steps || 0}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Calories</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.activities?.summary.calories || 0} kcal</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Distance</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.activities?.summary.distance || 0} km</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Active Minutes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.activities?.summary.activeMinutes || 0} mins</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sleep Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Sleep Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Sleep Time</p>
              <p className="text-lg font-semibold">
                {Math.floor((data.sleep?.summary.totalMinutesAsleep || 0) / 60)}h {(data.sleep?.summary.totalMinutesAsleep || 0) % 60}m
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Time in Bed</p>
              <p className="text-lg font-semibold">
                {Math.floor((data.sleep?.summary.totalTimeInBed || 0) / 60)}h {(data.sleep?.summary.totalTimeInBed || 0) % 60}m
              </p>
            </div>
          </div>
        </div>

        {/* Heart Rate Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Heart Rate</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Resting Heart Rate</p>
            <p className="text-lg font-semibold">
              {data.heartRate?.['activities-heart'][0]?.value.restingHeartRate || 'N/A'} bpm
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with proper suspense boundary
export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
} 