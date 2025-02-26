import { NextRequest, NextResponse } from 'next/server'
import { getTokens } from '@/utils/tokenStorage'

export async function GET(request: NextRequest) {
  try {
    // Get authentication token
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Extract token
    const token = authHeader.split(' ')[1]
    
    // Fetch raw data from Fitbit API
    const endpoints = [
      'profile',
      'activities/recent',
      'activities/steps/date/today/1w',
      'sleep/date/today',
      'activities/heart/date/today/1d',
      'body/log/weight/date/today/1m',
      'devices'
    ]
    
    const results = {}
    
    // For demo, we'll return the tokens and mock data
    // In production, you would make actual API calls to Fitbit
    
    // Add tokens to results (just for display, normally you wouldn't expose these)
    const tokens = getTokens()
    results['tokens'] = tokens
    
    // Mock profile data
    results['profile'] = {
      user: {
        age: 19,
        ambassador: false,
        avatar: "https://static0.fitbit.com/images/profile/defaultProfile_100.png",
        avatar150: "https://static0.fitbit.com/images/profile/defaultProfile_150.png",
        avatar640: "https://static0.fitbit.com/images/profile/defaultProfile_640.png",
        averageDailySteps: 9,
        challengesBeta: true,
        clockTimeDisplayFormat: "12hour",
        corporate: false,
        corporateAdmin: false,
        dateOfBirth: "2005-08-21",
        displayName: "Test User",
        distanceUnit: "en_US",
        encodedId: "2342ABCDEF",
        features: {
          exerciseGoal: true
        },
        firstName: "Test",
        foodsLocale: "en_US",
        fullName: "Test User",
        gender: "MALE",
        glucoseUnit: "en_US",
        height: 180.5,
        heightUnit: "en_US",
        isBugReportEnabled: true,
        isChild: false,
        isCoach: false,
        lastName: "User",
        locale: "en_US",
        memberSince: "2022-01-15",
        mfaEnabled: true,
        offsetFromUTCMillis: -18000000,
        startDayOfWeek: "SUNDAY",
        strideLengthRunning: 0,
        strideLengthWalking: 0,
        timezone: "America/New_York",
        topBadges: [],
        weight: 75.5,
        weightUnit: "en_US"
      }
    }
    
    // Mock devices data
    results['devices'] = [
      {
        battery: "High",
        batteryLevel: 95,
        deviceVersion: "Charge 5",
        features: [],
        id: "123456789",
        lastSyncTime: "2023-02-26T12:34:56.000",
        mac: "ABCDEF123456",
        type: "TRACKER"
      }
    ]
    
    // Mock heartrate data
    results['activities-heart'] = [
      {
        dateTime: "2023-02-26",
        value: {
          customHeartRateZones: [],
          heartRateZones: [
            {
              caloriesOut: 777.123,
              max: 94,
              min: 30,
              minutes: 840,
              name: "Out of Range"
            },
            {
              caloriesOut: 232.123,
              max: 132,
              min: 94,
              minutes: 60,
              name: "Fat Burn"
            }
          ],
          restingHeartRate: 68
        }
      }
    ]
    
    // Mock sleep data
    results['sleep'] = [
      {
        dateOfSleep: "2023-02-26",
        duration: 28800000,
        efficiency: 92,
        endTime: "2023-02-26T07:30:00.000",
        infoCode: 0,
        isMainSleep: true,
        levels: {
          data: [
            {
              dateTime: "2023-02-26T00:00:00.000",
              level: "deep",
              seconds: 3600
            },
            {
              dateTime: "2023-02-26T01:00:00.000",
              level: "light",
              seconds: 7200
            },
            {
              dateTime: "2023-02-26T03:00:00.000",
              level: "rem",
              seconds: 5400
            },
            {
              dateTime: "2023-02-26T04:30:00.000",
              level: "light",
              seconds: 5400
            },
            {
              dateTime: "2023-02-26T06:00:00.000",
              level: "wake",
              seconds: 1200
            },
            {
              dateTime: "2023-02-26T06:20:00.000",
              level: "light",
              seconds: 2400
            }
          ],
          summary: {
            deep: {
              count: 1,
              minutes: 60,
              thirtyDayAvgMinutes: 54
            },
            light: {
              count: 3,
              minutes: 250,
              thirtyDayAvgMinutes: 240
            },
            rem: {
              count: 1,
              minutes: 90,
              thirtyDayAvgMinutes: 88
            },
            wake: {
              count: 1,
              minutes: 20,
              thirtyDayAvgMinutes: 22
            }
          }
        },
        logId: 987654321,
        minutesAfterWakeup: 0,
        minutesAsleep: 420,
        minutesAwake: 20,
        minutesToFallAsleep: 0,
        startTime: "2023-02-26T00:00:00.000",
        timeInBed: 450,
        type: "stages"
      }
    ]
    
    // Mock activity data
    results['activities'] = {
      "activities": [],
      "goals": {
        "activeMinutes": 30,
        "caloriesOut": 2200,
        "distance": 8.05,
        "floors": 10,
        "steps": 10000
      },
      "summary": {
        "activeScore": -1,
        "activityCalories": 1200,
        "caloriesBMR": 1502,
        "caloriesOut": 2702,
        "distances": [
          {
            "activity": "total",
            "distance": 7.63
          },
          {
            "activity": "tracker",
            "distance": 7.63
          },
          {
            "activity": "loggedActivities",
            "distance": 0
          },
          {
            "activity": "veryActive",
            "distance": 3.41
          },
          {
            "activity": "moderatelyActive",
            "distance": 0.91
          },
          {
            "activity": "lightlyActive",
            "distance": 3.31
          },
          {
            "activity": "sedentaryActive",
            "distance": 0
          }
        ],
        "elevation": 26.83,
        "fairlyActiveMinutes": 19,
        "floors": 9,
        "heartRateZones": [
          {
            "caloriesOut": 1080.4012,
            "max": 94,
            "min": 30,
            "minutes": 600,
            "name": "Out of Range"
          },
          {
            "caloriesOut": 450.2384,
            "max": 132,
            "min": 94,
            "minutes": 45,
            "name": "Fat Burn"
          },
          {
            "caloriesOut": 159.4356,
            "max": 160,
            "min": 132,
            "minutes": 15,
            "name": "Cardio"
          },
          {
            "caloriesOut": 0,
            "max": 220,
            "min": 160,
            "minutes": 0,
            "name": "Peak"
          }
        ],
        "lightlyActiveMinutes": 250,
        "marginalCalories": 1096.77,
        "restingHeartRate": 68,
        "sedentaryMinutes": 1140,
        "steps": 9830,
        "veryActiveMinutes": 40
      }
    }
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching raw data:', error)
    return NextResponse.json({ error: 'Failed to fetch raw data' }, { status: 500 })
  }
} 