'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getTokens } from '@/utils/tokenStorage'
import DashboardNavbar from '@/components/DashboardNavbar'

// Account content component with real data
function AccountDashboardContent() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Function to load user data
    const loadUserData = async () => {
      try {
        setLoading(true)
        
        // Get tokens from storage
        const tokens = getTokens()
        
        // If demo mode or no tokens, load demo data
        if (!tokens) {
          const demoData = await import('@/data/demoUserData.json')
          setUserData(demoData.default)
          return
        }
        
        // Fetch real user data from API
        const response = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error('Error loading user data:', error)
        // Load demo data as fallback
        const demoData = await import('@/data/demoUserData.json')
        setUserData(demoData.default)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [])
  
  if (loading) {
    return <div className="p-8 text-center">Loading account data...</div>
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-newsreader mb-8">Your Account</h1>
      
      {/* User profile section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl mb-4 font-inter">Profile</h2>
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            {userData?.avatar ? (
              <img 
                src={userData.avatar} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-500">
                {userData?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-newsreader">{userData?.name || "User Name"}</h3>
            <p className="text-gray-600 mt-1">{userData?.email || "email@example.com"}</p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Member since</p>
                <p className="font-inter">{userData?.memberSince || "January 2023"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last sync</p>
                <p className="font-inter">{userData?.lastSync || "Never"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Account stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Device info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg mb-3">Connected Devices</h3>
          {userData?.devices?.map((device, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">{device.name || "Fitbit Device"}</p>
                <p className="text-sm text-gray-500">{device.lastSync || "Last synced: Unknown"}</p>
              </div>
            </div>
          ))}
          {(!userData?.devices || userData.devices.length === 0) && (
            <p className="text-gray-500">No devices connected</p>
          )}
        </div>
        
        {/* Account settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg mb-3">Account Settings</h3>
          <ul className="space-y-2">
            <li>
              <button className="text-left w-full py-2 px-3 hover:bg-gray-50 rounded">
                <span className="font-medium">Update Profile</span>
              </button>
            </li>
            <li>
              <button className="text-left w-full py-2 px-3 hover:bg-gray-50 rounded">
                <span className="font-medium">Change Password</span>
              </button>
            </li>
            <li>
              <button className="text-left w-full py-2 px-3 hover:bg-gray-50 rounded">
                <span className="font-medium">Notification Settings</span>
              </button>
            </li>
            <li>
              <button className="text-left w-full py-2 px-3 hover:bg-gray-50 rounded text-red-600">
                <span className="font-medium">Delete Account</span>
              </button>
            </li>
          </ul>
        </div>
        
        {/* Subscription info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg mb-3">Subscription</h3>
          <div className="bg-lime-50 rounded-lg p-4 mb-4">
            <p className="font-inter font-medium text-gray-900">
              {userData?.subscription?.plan || "Free Plan"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {userData?.subscription?.nextBilling || "No billing information"}
            </p>
          </div>
          <button className="w-full bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-700 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
      
      {/* Data permissions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl mb-4 font-inter">Data Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg mb-3">Connected Services</h3>
            <ul className="space-y-3">
              {userData?.connections?.map((connection, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">{connection.name?.charAt(0) || "S"}</span>
                    </div>
                    <span>{connection.name || "Service"}</span>
                  </div>
                  <button className="text-sm text-red-600">Disconnect</button>
                </li>
              ))}
              {(!userData?.connections || userData.connections.length === 0) && (
                <p className="text-gray-500">No connected services</p>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-lg mb-3">Data Access</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Share health data with doctors</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={userData?.permissions?.shareWithDoctors || false} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Allow anonymized data for research</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={userData?.permissions?.dataForResearch || false} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Receive personalized insights</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={userData?.permissions?.personalizedInsights || true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with proper suspense boundary
export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <AccountDashboardContent />
        </Suspense>
      </div>
    </div>
  )
} 