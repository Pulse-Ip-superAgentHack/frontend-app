// Full response structure from Fitbit API

// User Profile Response
export interface FitbitProfileResponse {
  user: {
    aboutMe: string;
    avatar: string;
    avatar150: string;
    avatar640: string;
    city: string;
    clockTimeDisplayFormat: string;
    country: string;
    dateOfBirth: string;
    displayName: string;
    displayNameSetting: string;
    distanceUnit: string;
    encodedId: string;
    foodsLocale: string;
    fullName: string;
    gender: string;
    glucoseUnit: string;
    height: number;
    heightUnit: string;
    locale: string;
    memberSince: string;
    mfaEnabled: boolean;
    offsetFromUTCMillis: number;
    startDayOfWeek: string;
    state: string;
    strideLengthRunning: number;
    strideLengthRunningType: string;
    strideLengthWalking: number;
    strideLengthWalkingType: string;
    timezone: string;
    waterUnit: string;
    weight: number;
    weightUnit: string;
  };
}

// Activities Response
export interface FitbitActivitiesResponse {
  activities: any[];
  goals: {
    activeMinutes: number;
    caloriesOut: number;
    distance: number;
    floors: number;
    steps: number;
  };
  summary: {
    activeScore: number;
    activityCalories: number;
    caloriesBMR: number;
    caloriesOut: number;
    distances: Array<{
      activity: string;
      distance: number;
    }>;
    elevation: number;
    fairlyActiveMinutes: number;
    floors: number;
    heartRateZones: Array<{
      caloriesOut: number;
      max: number;
      min: number;
      minutes: number;
      name: string;
    }>;
    lightlyActiveMinutes: number;
    marginalCalories: number;
    restingHeartRate: number;
    sedentaryMinutes: number;
    steps: number;
    veryActiveMinutes: number;
  };
}

// Heart Data Response
export interface FitbitHeartResponse {
  'activities-heart': Array<{
    dateTime: string;
    value: {
      customHeartRateZones: any[];
      heartRateZones: Array<{
        caloriesOut: number;
        max: number;
        min: number;
        minutes: number;
        name: string;
      }>;
      restingHeartRate: number;
    };
  }>;
  'activities-heart-intraday'?: {
    dataset: Array<{
      time: string;
      value: number;
    }>;
    datasetInterval: number;
    datasetType: string;
  };
}

// Sleep Data Response
export interface FitbitSleepResponse {
  pagination?: {
    afterDate: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    sort: string;
  };
  sleep: Array<{
    dateOfSleep: string;
    duration: number;
    efficiency: number;
    endTime: string;
    infoCode: number;
    isMainSleep: boolean;
    levels: {
      data: Array<{
        dateTime: string;
        level: string;
        seconds: number;
      }>;
      shortData: Array<{
        dateTime: string;
        level: string;
        seconds: number;
      }>;
      summary: {
        deep: {
          count: number;
          minutes: number;
          thirtyDayAvgMinutes: number;
        };
        light: {
          count: number;
          minutes: number;
          thirtyDayAvgMinutes: number;
        };
        rem: {
          count: number;
          minutes: number;
          thirtyDayAvgMinutes: number;
        };
        wake: {
          count: number;
          minutes: number;
          thirtyDayAvgMinutes: number;
        };
      };
    };
    logId: number;
    minutesAfterWakeup: number;
    minutesAsleep: number;
    minutesAwake: number;
    minutesToFallAsleep: number;
    startTime: string;
    timeInBed: number;
    type: string;
  }>;
  summary: {
    stages: {
      deep: number;
      light: number;
      rem: number;
      wake: number;
    };
    totalMinutesAsleep: number;
    totalSleepRecords: number;
    totalTimeInBed: number;
  };
}

// Steps Data Response
export interface FitbitStepsResponse {
  'activities-steps': Array<{
    dateTime: string;
    value: string;
  }>;
  'activities-steps-intraday'?: {
    dataset: Array<{
      time: string;
      value: number;
    }>;
    datasetInterval: number;
    datasetType: string;
  };
}

// Calories Data Response
export interface FitbitCaloriesResponse {
  'activities-calories': Array<{
    dateTime: string;
    value: string;
  }>;
  'activities-calories-intraday'?: {
    dataset: Array<{
      time: string;
      value: number;
    }>;
    datasetInterval: number;
    datasetType: string;
  };
}

// Weight Data Response
export interface FitbitWeightResponse {
  weight: Array<{
    bmi: number;
    date: string;
    fat: number;
    logId: number;
    source: string;
    time: string;
    weight: number;
  }>;
}

// OAuth Token Response
export interface FitbitTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_id: string;
}

// Combined data response (what your app receives)
export interface FitbitCombinedData {
  tokens: FitbitTokenResponse;
  profile: FitbitProfileResponse;
  activities: FitbitActivitiesResponse;
  heart: FitbitHeartResponse;
  sleep: FitbitSleepResponse;
  steps: FitbitStepsResponse;
  calories: FitbitCaloriesResponse;
  weight: FitbitWeightResponse;
} 