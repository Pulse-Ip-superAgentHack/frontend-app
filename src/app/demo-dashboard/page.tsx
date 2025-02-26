'use client'

import { useState } from 'react'
import DataModal from '@/components/DataModal'
import { motion } from 'framer-motion'

export default function DemoDashboard() {
  const [timeRange, setTimeRange] = useState('week')
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: '',
    data: null,
    type: null as any
  })
  
  // Dummy data
  const healthData = {
    oxygen: {
      value: 97.5,
      change: 0.2,
      time: '12:45 PM'
    },
    heartRate: {
      current: 89,
      resting: 68,
      change: 0.2,
      time: '12:02',
      zones: [
        { name: 'Out of Range', min: 30, max: 91 },
        { name: 'Fat Burn', min: 91, max: 127 },
        { name: 'Cardio', min: 127, max: 154 },
        { name: 'Peak', min: 154, max: 220 }
      ]
    },
    temperature: {
      value: 98.57,
      change: 0.4,
      time: '09:45 AM'
    },
    steps: {
      today: 8243,
      goal: 10000,
      weekly: [6502, 7820, 9103, 5720, 8243, 10280, 7654]
    },
    sleep: {
      hours: 7.2,
      quality: 'Good',
      deep: 1.4,
      light: 4.2,
      rem: 1.6,
      awake: 0.2,
      totalMinutesAsleep: 432,
      efficiency: 92,
      stages: {
        deep: 84,
        light: 252,
        rem: 96,
        wake: 12
      }
    },
    activity: {
      calories: 1840,
      activeMinutes: 42,
      distance: 5.7,
      sedentaryMinutes: 720,
      lightlyActiveMinutes: 180,
      fairlyActiveMinutes: 22,
      veryActiveMinutes: 20,
      steps: 8243,
      distances: [{ distance: 5.7 }]
    }
  }
  
  const openModal = (type: string, title: string, data: any) => {
    setModalData({
      isOpen: true,
      title,
      data,
      type
    })
  }
  
  const closeModal = () => {
    setModalData({
      ...modalData,
      isOpen: false
    })
  }
  
  // Generate random data for chart
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => ({
      month,
      value: Math.floor(Math.random() * 10) + 90
    }))
  }
  
  const chartData = generateChartData()

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <h2 className="text-xl text-gray-600">Health Records</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full px-4 py-2 shadow flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="ml-2 text-sm font-medium">Sep 02 - Sep 09</span>
            </div>
          </div>
        </div>
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Temperature Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openModal('temperature', 'Temperature', healthData.temperature)}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">Temperature</p>
                <div className="flex items-end">
                  <h3 className="text-5xl font-bold text-gray-900">{healthData.temperature.value}°</h3>
                  <span className="ml-2 text-xs bg-lime-100 text-lime-800 px-2 py-1 rounded-full">30min</span>
                </div>
              </div>
              <span className="text-xs text-gray-500">{healthData.temperature.time}</span>
            </div>
            <div className="mt-4 text-xs text-gray-600">
              {healthData.temperature.change > 0 ? '+' : ''}{healthData.temperature.change}% from last week
            </div>
          </motion.div>
          
          {/* Oxygen Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openModal('oxygen', 'Oxygen Saturation', healthData.oxygen)}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Oxygen</p>
                <div className="flex items-end">
                  <h3 className="text-5xl font-bold">{healthData.oxygen.value}</h3>
                  <span className="text-3xl font-bold ml-1">%</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">{healthData.oxygen.time}</span>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {healthData.oxygen.change > 0 ? '+' : ''}{healthData.oxygen.change}% from last week
            </div>
          </motion.div>
          
          {/* Heart Rate Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openModal('heartRate', 'Heart Rate', healthData.heartRate)}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pulse</p>
                <div className="flex items-end">
                  <h3 className="text-5xl font-bold">{healthData.heartRate.current}</h3>
                  <span className="text-xl font-medium ml-1 mb-1">bpm</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">{healthData.heartRate.time}</span>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {healthData.heartRate.change > 0 ? '+' : ''}{healthData.heartRate.change}% from last week
            </div>
          </motion.div>
        </div>
        
        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800">
                  Analytics
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">Tracker</h3>
              </div>
              <div className="text-sm text-gray-600">{healthData.temperature.time}</div>
            </div>
            
            <div className="h-64 relative">
              {/* Chart visualization - simplified version */}
              <div className="absolute bottom-0 left-0 right-0 top-0 flex items-end justify-between">
                {chartData.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex flex-col items-center" 
                    style={{width: `${100/chartData.length}%`}}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.div 
                      className={`w-4 rounded-t-full ${index % 3 === 0 ? 'bg-lime-400' : 'bg-gray-200'}`} 
                      style={{height: 0}}
                      animate={{height: `${item.value - 85}%`}}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    ></motion.div>
                    <div className="text-xs text-gray-600 mt-2">{item.month}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-600">
                <div>10%</div>
                <div>08%</div>
                <div>00%</div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                Tracker
              </div>
              <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                MedicalAnalytics
              </div>
              <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                FitnessMetrics
              </div>
              <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                PatientInsights
              </div>
              <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                AI Healthcare
              </div>
            </div>
          </div>
           
          {/* Body Visualization */}
          <div className="bg-white rounded-2xl shadow-md p-6 relative">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Body Analysis</h3>
            
            <div className="flex justify-center">
              <div className="relative h-64 w-56">
                {/* Simple body outline - in real implementation you'd use an SVG */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="180" height="220" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M90 30 A20 20 0 1 0 90 30" stroke="#333" strokeWidth="2" />
                    <line x1="90" y1="50" x2="90" y2="100" stroke="#333" strokeWidth="2" />
                    <line x1="90" y1="70" x2="60" y2="90" stroke="#333" strokeWidth="2" />
                    <line x1="90" y1="70" x2="120" y2="90" stroke="#333" strokeWidth="2" />
                    <line x1="90" y1="100" x2="60" y2="150" stroke="#333" strokeWidth="2" />
                    <line x1="90" y1="100" x2="120" y2="150" stroke="#333" strokeWidth="2" />
                    <circle cx="75" cy="95" r="15" fill="#D1F7A0" opacity="0.6" />
                    <circle cx="105" cy="95" r="15" fill="#D1F7A0" opacity="0.6" />
                  </svg>
                </div>
                
                {/* Metrics */}
                <div className="absolute top-1/4 left-0 bg-lime-100 text-lime-800 rounded-full px-2 py-1 text-xs">
                  ↗ 06%
                </div>
                <div className="absolute top-1/3 right-0 bg-lime-100 text-lime-800 rounded-full px-2 py-1 text-xs">
                  ↗ 278%
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-6 right-6 rotate-6">
              <div className="text-4xl font-bold text-gray-900">TAKE A</div>
              <div className="text-4xl font-bold text-gray-900">BREATH</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Steps Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openModal('steps', 'Steps', healthData.steps)}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">Steps</h3>
            <div className="flex items-end">
              <div className="text-3xl font-bold">{healthData.steps.today.toLocaleString()}</div>
              <div className="text-sm text-gray-500 ml-2">/ {healthData.steps.goal.toLocaleString()}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div 
                className="bg-lime-400 h-2.5 rounded-full" 
                style={{ width: `${(healthData.steps.today/healthData.steps.goal)*100}%` }}
              ></div>
            </div>
          </motion.div>
          
          {/* Sleep Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openModal('sleep', 'Sleep', healthData.sleep)}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sleep</h3>
            <div className="text-3xl font-bold">{healthData.sleep.hours} hrs</div>
            <div className="flex items-center mt-4">
              <div className="flex-1">
                <div className="text-xs text-gray-500">Deep</div>
                <div className="text-sm font-medium">{healthData.sleep.deep} hrs</div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Light</div>
                <div className="text-sm font-medium">{healthData.sleep.light} hrs</div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">REM</div>
                <div className="text-sm font-medium">{healthData.sleep.rem} hrs</div>
              </div>
            </div>
          </motion.div>
          
          {/* Activity Card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openModal('activity', 'Activity', healthData.activity)}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">Activity</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs text-gray-500">Calories</div>
                <div className="text-xl font-bold">{healthData.activity.calories}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Active</div>
                <div className="text-xl font-bold">{healthData.activity.activeMinutes}m</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Distance</div>
                <div className="text-xl font-bold">{healthData.activity.distance}km</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modal for detailed data */}
      <DataModal 
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        data={modalData.data}
        type={modalData.type}
      />
    </div>
  )
} 