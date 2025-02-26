'use client'

import { motion, AnimatePresence } from 'framer-motion'

type DataModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  data: any
  type: 'sleep' | 'activity' | 'heartRate' | 'steps' | 'oxygen' | 'temperature'
}

export default function DataModal({ isOpen, onClose, title, data, type }: DataModalProps) {
  if (!isOpen) return null

  // Function to render content based on type
  const renderContent = () => {
    if (!data) {
      return (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Data Available</h3>
          <p className="mt-2 text-sm text-gray-600">
            Connect your Fitbit device to see your data here.
          </p>
        </div>
      )
    }

    switch (type) {
      case 'sleep':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Sleep</div>
                <div className="text-xl font-bold text-gray-900">{data.totalMinutesAsleep ? `${Math.floor(data.totalMinutesAsleep / 60)}h ${data.totalMinutesAsleep % 60}m` : 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Efficiency</div>
                <div className="text-xl font-bold text-gray-900">{data.efficiency || 'N/A'}%</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Sleep Stages</div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-800">Deep</span>
                  <span className="font-medium text-gray-900">{data.stages?.deep ? `${Math.floor(data.stages.deep / 60)}h ${data.stages.deep % 60}m` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Light</span>
                  <span className="font-medium text-gray-900">{data.stages?.light ? `${Math.floor(data.stages.light / 60)}h ${data.stages.light % 60}m` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">REM</span>
                  <span className="font-medium text-gray-900">{data.stages?.rem ? `${Math.floor(data.stages.rem / 60)}h ${data.stages.rem % 60}m` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Awake</span>
                  <span className="font-medium text-gray-900">{data.stages?.wake ? `${Math.floor(data.stages.wake / 60)}h ${data.stages.wake % 60}m` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'activity':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Calories Burned</div>
                <div className="text-xl font-bold text-gray-900">{data.caloriesOut || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Active Minutes</div>
                <div className="text-xl font-bold text-gray-900">{data.fairlyActiveMinutes + data.veryActiveMinutes || 'N/A'}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Steps</div>
                <div className="text-xl font-bold text-gray-900">{data.steps || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Distance</div>
                <div className="text-xl font-bold text-gray-900">{data.distances?.[0]?.distance || 'N/A'} km</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Activity Breakdown</div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-800">Sedentary</span>
                  <span className="font-medium text-gray-900">{data.sedentaryMinutes || 'N/A'} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Lightly Active</span>
                  <span className="font-medium text-gray-900">{data.lightlyActiveMinutes || 'N/A'} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Fairly Active</span>
                  <span className="font-medium text-gray-900">{data.fairlyActiveMinutes || 'N/A'} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Very Active</span>
                  <span className="font-medium text-gray-900">{data.veryActiveMinutes || 'N/A'} mins</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'heartRate':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Resting Heart Rate</div>
                <div className="text-xl font-bold text-gray-900">{data.restingHeartRate || 'N/A'} bpm</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Heart Rate Zones</div>
                <div className="text-base font-medium text-gray-900">{data.heartRateZones?.length || 0} zones detected</div>
              </div>
            </div>
            
            {data.heartRateZones && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Heart Rate Zones</div>
                <div className="mt-2 space-y-2">
                  {data.heartRateZones.map((zone: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-800">{zone.name}</span>
                      <span className="font-medium text-gray-900">{zone.min} - {zone.max} bpm</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      
      default:
        return (
          <div className="py-8 text-center">
            <p>Detailed information not available for this category.</p>
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <motion.button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {renderContent()}
              </motion.div>
              
              <div className="mt-8 flex justify-end">
                <motion.button
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 