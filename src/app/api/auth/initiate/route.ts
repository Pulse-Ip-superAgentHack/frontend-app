import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';

// Create a server-side session store (not reliable in serverless environments)
const SESSION_STORE = new Map();

export async function GET(request: NextRequest) {
  try {
    // Build the authorization URL with PKCE
    const authUrl = new URL('https://www.fitbit.com/oauth2/authorize');
    authUrl.searchParams.append('client_id', process.env.FITBIT_CLIENT_ID || '23Q44W');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'activity heartrate location nutrition profile settings sleep weight');
    authUrl.searchParams.append('redirect_uri', 'https://pulseip.shreyanshgajjar.com/callback');
    
    // Simple redirect
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Failed to initiate OAuth:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
} 