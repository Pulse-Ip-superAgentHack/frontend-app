'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AIAgent {
  id: string
  name: string
  fitnessType: string
  txnHash: string
  description: string
  creator: string
  price: string
}

export default function MarketplacePage() {
  // Data with real transaction hashes
  const [agents] = useState<AIAgent[]>([
    {
      id: '1',
      name: 'FitnessPro AI',
      fitnessType: 'Cardio Training',
      txnHash: '0x264018121f356990d2bf42BD62577fbE8c9a330b',
      description: 'Advanced cardio training assistant that analyzes heart rate patterns and optimizes workout intensity.',
      creator: 'Pulse Labs',
      price: '0.05 ETH'
    },
    {
      id: '2',
      name: 'StrengthCoach',
      fitnessType: 'Weight Training',
      txnHash: '0x7147CDa7A2F44e3D39bA5fA9Fe9368da3845B8f7',
      description: 'Personalized weight training guidance with form analysis and progression planning.',
      creator: 'FitTech Systems',
      price: '0.07 ETH'
    },
    {
      id: '3',
      name: 'MeditationMind',
      fitnessType: 'Mental Wellness',
      txnHash: '0xf19B945B121abE98B81d078Da13CF8F2959AF98d',
      description: 'Guided meditation and stress reduction assistant that adapts to your mental state and sleep patterns.',
      creator: 'Mindful AI',
      price: '0.04 ETH'
    },
    {
      id: '4',
      name: 'NutritionNexus',
      fitnessType: 'Diet & Nutrition',
      txnHash: '0xb4a74b410B57a4Ef37Aabb2457970B04bfe33714',
      description: 'Meal planning and nutrition tracking AI that integrates with your fitness data for optimal results.',
      creator: 'Health Horizons',
      price: '0.06 ETH'
    }
  ]);

  // Helper function to format hash display (start...end)
  const formatHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-newsreader">AI Agent Marketplace</h1>
            <p className="text-gray-600 mt-2">Discover and acquire specialized fitness AI agents built on PulseIP data</p>
          </div>
          <div className="flex gap-4">
            <select className="border border-gray-300 rounded-md p-2 bg-white text-gray-700">
              <option>All Categories</option>
              <option>Cardio Training</option>
              <option>Weight Training</option>
              <option>Mental Wellness</option>
              <option>Diet & Nutrition</option>
            </select>
            <button className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-lime-700 transition-colors">
              Create Agent
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-3 bg-gradient-to-r from-lime-400 to-lime-600"></div>
              <div className="p-5">
                <h3 className="font-newsreader text-xl font-medium mb-1">{agent.name}</h3>
                <p className="text-lime-600 text-sm mb-2">{agent.fitnessType}</p>
                
                <div className="text-sm text-gray-500 mb-3">
                  <span className="block mb-1">Creator: {agent.creator}</span>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-9">Txn:</span>
                    <Link href={`https://aeneid.explorer.story.foundation/ipa/${agent.txnHash}`} 
                          className="text-blue-500 hover:underline truncate"
                          target="_blank" rel="noopener noreferrer">
                      {formatHash(agent.txnHash)}
                    </Link>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {agent.description}
                </p>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-inter font-medium">{agent.price}</span>
                  <button className="bg-gradient-to-r from-lime-500 to-lime-600 text-white py-1.5 px-4 rounded-md hover:from-lime-600 hover:to-lime-700 transition-all text-sm">
                    Derivate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
