import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the access token from the HTTP-only cookie
    const accessToken = request.cookies.get('fitbit_access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Get the date parameter or use today's date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Set up all our API requests
    const profileUrl = 'https://api.fitbit.com/1/user/-/profile.json';
    const activitiesUrl = `https://api.fitbit.com/1/user/-/activities/date/${dateStr}.json`;
    const sleepUrl = `https://api.fitbit.com/1.2/user/-/sleep/date/${dateStr}.json`;
    const stepsUrl = `https://api.fitbit.com/1/user/-/activities/steps/date/${dateStr}/7d.json`;
    
    // Make parallel requests
    const [profileResponse, activitiesResponse, sleepResponse, stepsResponse] = await Promise.all([
      fetch(profileUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }),
      fetch(activitiesUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }),
      fetch(sleepUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }),
      fetch(stepsUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    ]);
    
    // Handle profile response
    let profile = {};
    if (profileResponse.ok) {
      profile = await profileResponse.json();
    } else {
      console.error('Profile API error:', profileResponse.status);
      profile = { error: `API Error: ${profileResponse.status}` };
    }
    
    // Handle activities response
    let activities = {};
    if (activitiesResponse.ok) {
      activities = await activitiesResponse.json();
    } else {
      console.error('Activities API error:', activitiesResponse.status);
      activities = { error: `API Error: ${activitiesResponse.status}` };
    }
    
    // Handle sleep response
    let sleep = {};
    if (sleepResponse.ok) {
      sleep = await sleepResponse.json();
    } else {
      console.error('Sleep API error:', sleepResponse.status);
      sleep = { error: `API Error: ${sleepResponse.status}` };
    }
    
    // Handle steps response
    let steps = {};
    if (stepsResponse.ok) {
      steps = await stepsResponse.json();
    } else {
      console.error('Steps API error:', stepsResponse.status);
      steps = { error: `API Error: ${stepsResponse.status}` };
    }
    
    // Construct the response data
    const responseData = {
      profile,
      activities,
      sleep,
      'activities-steps': steps,
      tokens: {
        access_token: accessToken.substring(0, 10) + '...',
        user_id: profile.user?.encodedId || 'unknown'
      }
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 