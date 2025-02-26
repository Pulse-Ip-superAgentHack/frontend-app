'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTokens } from '@/utils/tokenStorage'

interface UserProfile {
  fullName: string
  age: number
  gender: string
  height: number
  weight: number
  memberSince: string
}

interface ActivityData {
  steps: number
  caloriesOut: number
  distance: number
  activeMinutes: number
  sedentaryMinutes: number
}

interface SleepData {
  minutesAsleep: number
  minutesAwake: number
  timeInBed: number
  efficiency: number
}

interface HeartRateData {
  restingHeartRate: number
  zones: {
    name: string
    minutes: number
    caloriesOut: number
  }[]
}

export default function AccountDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activity, setActivity] = useState<ActivityData | null>(null)
  const [sleep, setSleep] = useState<SleepData | null>(null)
  const [heartRate, setHeartRate] = useState<HeartRateData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Check for tokens
        const tokens = getTokens()
        if (!tokens) {
          router.push('/raw') // Redirect to the code input page
          return
        }
        
        // Use stored data if available
        const storedData = localStorage.getItem('fitbitData')
        if (storedData) {
          const data = JSON.parse(storedData)
          
          // Process profile data
          if (data.profile?.user) {
            setProfile({
              fullName: data.profile.user.fullName || 'N/A',
              age: data.profile.user.age || 0,
              gender: data.profile.user.gender || 'N/A',
              height: data.profile.user.height || 0,
              weight: data.profile.user.weight || 0,
              memberSince: data.profile.user.memberSince || 'N/A'
            })
          }
          
          // Process activity data
          if (data.activities?.summary) {
            setActivity({
              steps: data.activities.summary.steps || 0,
              caloriesOut: data.activities.summary.caloriesOut || 0,
              distance: data.activities.summary.distances?.[0]?.distance || 0,
              activeMinutes: (data.activities.summary.fairlyActiveMinutes || 0) + 
                            (data.activities.summary.veryActiveMinutes || 0),
              sedentaryMinutes: data.activities.summary.sedentaryMinutes || 0
            })
          }
          
          // Process sleep data
          if (data.sleep?.summary) {
            setSleep({
              minutesAsleep: data.sleep.summary.totalMinutesAsleep || 0,
              minutesAwake: data.sleep.summary.totalTimeInBed - data.sleep.summary.totalMinutesAsleep || 0,
              timeInBed: data.sleep.summary.totalTimeInBed || 0,
              efficiency: data.sleep.summary.efficiency || 0
            })
          }
          
          // Process heart data
          if (data.heart?.['activities-heart']?.[0]) {
            const heartData = data.heart['activities-heart'][0]
            setHeartRate({
              restingHeartRate: heartData.value?.restingHeartRate || 0,
              // @ts-expect-error - Fitbit API typing issue
              zones: heartData.value?.heartRateZones?.map((zone) => ({
                name: zone.name,
                minutes: zone.minutes || 0,
                caloriesOut: zone.caloriesOut || 0
              })) || []
            })
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [router])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h2>
          <p className="text-gray-700 mb-4">
            Please fetch your Fitbit data first.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Get Data
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Fitness Dashboard</h1>
        
        {/* User Profile Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.age} years</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Height</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.height} cm</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Weight</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.weight} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.memberSince}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Data Card */}
        {activity && (
          <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Today&apos;s Activity</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Steps</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.steps.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Calories Burned</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.caloriesOut.toLocaleString()} kcal</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Distance</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.distance.toFixed(2)} km</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Active Minutes</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.activeMinutes} mins</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sedentary Minutes</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.sedentaryMinutes} mins</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Sleep Data Card */}
        {sleep && (
          <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sleep Data</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sleep Duration</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.floor(sleep.minutesAsleep / 60)}h {sleep.minutesAsleep % 60}m
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Time Awake</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.floor(sleep.minutesAwake / 60)}h {sleep.minutesAwake % 60}m
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Time in Bed</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.floor(sleep.timeInBed / 60)}h {sleep.timeInBed % 60}m
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sleep Efficiency</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sleep.efficiency}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Heart Rate Card */}
        {heartRate && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Heart Rate Data</h2>
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Resting Heart Rate</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{heartRate.restingHeartRate} bpm</p>
              </div>
              
              {heartRate.zones.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Heart Rate Zones</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutes</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {heartRate.zones.map((zone, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zone.minutes} mins</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zone.caloriesOut} kcal</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 