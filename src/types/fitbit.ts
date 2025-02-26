export interface FitbitProfile {
  user: {
    fullName: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    memberSince: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface FitbitActivity {
  summary: {
    steps: number;
    caloriesOut: number;
    distances: Array<{distance: number}>;
    fairlyActiveMinutes: number;
    veryActiveMinutes: number;
    sedentaryMinutes: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface FitbitHeartData {
  'activities-heart': Array<{
    value: {
      restingHeartRate: number;
      heartRateZones: Array<{
        name: string;
        minutes: number;
        caloriesOut: number;
        [key: string]: any;
      }>;
      [key: string]: any;
    };
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface FitbitSleepData {
  summary: {
    totalMinutesAsleep: number;
    totalTimeInBed: number;
    efficiency: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface FitbitData {
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    [key: string]: any;
  };
  profile: FitbitProfile;
  activities: FitbitActivity;
  heart: FitbitHeartData;
  sleep: FitbitSleepData;
  steps: any;
  calories: any;
  weight: any;
  [key: string]: any;
} 