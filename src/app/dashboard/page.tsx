'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTokens } from '@/utils/tokenStorage'

import { IpMetadata, LicenseTerms } from '@story-protocol/core-sdk'
import { client } from '../../utils/storyUtils'
import { uploadJSONToIPFS } from '../../utils/uploadToIpfs'
import { createHash } from 'crypto'
import { Address, zeroAddress, zeroHash } from 'viem'

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
            console.error(`API request failed with status ${response.status}`);
            throw new Error('Failed to fetch dashboard data');
          }
          
          const rawData = await response.json();
          console.log('Dashboard data fetched:', Object.keys(rawData));
          
          // Transform raw data into dashboard format
          const transformedData = {
            metrics: {
              temperature: "98.6°F", // Fitbit doesn't provide body temperature
              heartRate: getHeartRate(rawData) || "72 bpm",
              oxygenLevel: "98%" // Fitbit doesn't provide oxygen saturation in basic API
            },
            activity: {
              steps: getSteps(rawData) || "5,280",
              distance: getDistance(rawData) || "2.4 mi",
              calories: getCalories(rawData) || "320",
              activeMinutes: getActiveMinutes(rawData) || "35"
            },
            sleep: {
              hoursSlept: getSleepHours(rawData) || "7.5 hrs",
              deepSleep: getDeepSleep(rawData) || "2.3 hrs",
              score: getSleepScore(rawData) || "82"
            }
          }
          
          setDashboardData(transformedData)
        } else {
          // Using demo data only for unauthenticated users
          console.log('Using demo data - user not authenticated');
          const demoData = await import('@/data/demoDashboardData.json');
          setDashboardData(demoData.default);
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

  const [msg1, setMsg1] = useState(""); // Track msg1
  const [msg2, setMsg2] = useState(""); // Track msg2
  const [txlink, setTxlink] = useState(""); // Track txlink

  const mintIp = async () => {
    if (!txlink) {
    const commercialRemixTerms: LicenseTerms = {
      transferable: true,
      royaltyPolicy: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E', // RoyaltyPolicyLAP address from https://docs.story.foundation/docs/deployed-smart-contracts
      defaultMintingFee: BigInt(100),
      expiration: BigInt(0),
      commercialUse: true,
      commercialAttribution: true,
      commercializerChecker: zeroAddress,
      commercializerCheckerData: zeroAddress,
      commercialRevShare: 100, // can claim 100% of derivative revenue
      commercialRevCeiling: BigInt(0),
      derivativesAllowed: true,
      derivativesAttribution: true,
      derivativesApproval: false,
      derivativesReciprocal: true,
      derivativeRevCeiling: BigInt(0),
      currency: '0x1514000000000000000000000000000000000000', // $WIP address from https://docs.story.foundation/docs/deployed-smart-contracts
      uri: '',
    }
  
    const licensingConfig = {
      isSet: false,
      mintingFee: BigInt(100),
      licensingHook: zeroAddress,
      hookData: zeroHash,
      commercialRevShare: 100,
      disabled: false,
      expectMinimumGroupRewardShare: 0,
      expectGroupRewardPool: zeroAddress,
    };
  
    const ipMetadata = {
      "title": "Fitness AI Agent",
      "description": "This is an example test eliza AI Agent registered on Story.",
      "createdAt": "1740005219",
      "creators": [
        {
          "name": "JJ T",
          "address": `${process.env.NEXT_PUBLIC_WALLET_ADDRESS}`,
          "contributionPercent": 100
        }
      ],
      "image": "https://ipfs.io/ipfs/bafybeigi3k77t5h5aefwpzvx3uiomuavdvqwn5rb5uhd7i7xcq466wvute",
      "imageHash": "0x64ccc40de203f218d16bb90878ecca4338e566ab329bf7be906493ce77b1551a",
      "mediaUrl": "https://ipfs.io/ipfs/bafybeigi3k77t5h5aefwpzvx3uiomuavdvqwn5rb5uhd7i7xcq466wvute",
      "mediaHash": "0x64ccc40de203f218d16bb90878ecca4338e566ab329bf7be906493ce77b1551a",
      "mediaType": "image/webp",
      "aiMetadata": {
        "characterFileUrl": `${process.env.NEXT_PUBLIC_ELIZA_CHARACTER_FILE}`,
        "characterFileHash": `${process.env.NEXT_PUBLIC_ELIZA_CHARACTER_HASH}`
      },
      "ipType": "AI Agent", // experimental field
      "tags": ["AI Agent", "Twitter bot", "Smart Agent"] // experimental field
    }
  
    const nftMetadata = {
      name: 'Fitness Data NFT',
      description: 'This is an NFT representing owernship of our IP Asset.',
      // image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
      // image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      // image: 'https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      // image: 'https://images.pexels.com/photos/1117493/pexels-photo-1117493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      image: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    }
  
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')
  
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc',
      // spgNftContract: '0xfE265a91dBe911db06999019228a678b86C04959',
      licenseTermsData: [{ terms: commercialRemixTerms, licensingConfig }], // IP already has non-commercial social remixing terms. You can add more here.
      allowDuplicates: true,
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    })
    let newMsg1 = `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}, Token ID: ${response.tokenId}, License Terms ID: ${response.licenseTermsIds}`
    let newMsg2 = `View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`
    setTxlink(`https://aeneid.explorer.story.foundation/ipa/${response.ipId}`)
    setMsg1(newMsg1)
    setMsg2(newMsg2)
    
    console.log(newMsg1)
    console.log(newMsg2)
  }
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
          <div>
            <h1 className="text-4xl font-newsreader">Dashboard</h1>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-1">
                Viewing demo data. <button onClick={handleSignIn} className="text-lime-600 underline">Sign in</button> to see your real data.
              </p>
            )}
          </div>
          
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

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={mintIp}
            className="bg-blue-500 text-white px-4 py-2 mt-4"
          >Sell fitbit data</button>
        </div>
      </div>
    </div>
  )
}

// Helper functions to extract data from API response
function getHeartRate(data) {
  try {
    if (data && data['activities-heart'] && Array.isArray(data['activities-heart']) && data['activities-heart'].length > 0) {
      const hr = data['activities-heart'][0]?.value?.restingHeartRate;
      return hr ? `${hr} bpm` : null;
    }
    return null;
  } catch (e) {
    console.error("Error extracting heart rate:", e);
    return null;
  }
}

function getSteps(data) {
  try {
    if (data.activities && data.activities.summary) {
      const steps = data.activities.summary.steps;
      return steps ? steps.toLocaleString() : null;
    }
    return null;
  } catch (e) {
    console.error("Error extracting steps:", e);
    return null;
  }
}

function getDistance(data) {
  try {
    if (data.activities && data.activities.summary && data.activities.summary.distances) {
      const distance = data.activities.summary.distances.find(d => d.activity === "total");
      return distance ? `${distance.distance.toFixed(1)} mi` : null;
    }
    return null;
  } catch (e) {
    console.error("Error extracting distance:", e);
    return null;
  }
}

function getCalories(data) {
  try {
    if (data.activities && data.activities.summary) {
      const calories = data.activities.summary.caloriesOut;
      return calories ? calories.toLocaleString() : null;
    }
    return null;
  } catch (e) {
    console.error("Error extracting calories:", e);
    return null;
  }
}

function getActiveMinutes(data) {
  try {
    if (data.activities && data.activities.summary) {
      const fairlyActive = data.activities.summary.fairlyActiveMinutes || 0;
      const veryActive = data.activities.summary.veryActiveMinutes || 0;
      return (fairlyActive + veryActive).toString();
    }
    return null;
  } catch (e) {
    console.error("Error extracting active minutes:", e);
    return null;
  }
}

function getSleepHours(data) {
  try {
    if (data.sleep && data.sleep.summary) {
      const minutes = data.sleep.summary.totalMinutesAsleep;
      return minutes ? `${(minutes / 60).toFixed(1)} hrs` : null;
    }
    return null;
  } catch (e) {
    console.error("Error extracting sleep hours:", e);
    return null;
  }
}

function getDeepSleep(data) {
  try {
    if (data.sleep && data.sleep.summary && data.sleep.summary.stages) {
      const deep = data.sleep.summary.stages.deep;
      return deep ? `${(deep / 60).toFixed(1)} hrs` : null;
    }
    return null;
  } catch (e) {
    console.error("Error extracting deep sleep:", e);
    return null;
  }
}

function getSleepScore(data) {
  try {
    if (data.sleep && data.sleep.summary) {
      return data.sleep.summary.efficiency?.toString() || null;
    }
    return null;
  } catch (e) {
    console.error("Error extracting sleep score:", e);
    return null;
  }
} 