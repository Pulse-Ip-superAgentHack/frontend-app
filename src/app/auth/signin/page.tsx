'use client'

import { useEffect } from 'react'

export default function SignInPage() {
  useEffect(() => {
    // Generate a random string for PKCE code verifier (43-128 characters)
    const generateCodeVerifier = () => {
      const array = new Uint8Array(56)
      window.crypto.getRandomValues(array)
      return Array.from(array, (byte) => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('')
    }
    
    // Base64 encode the SHA-256 hash of the code verifier
    const generateCodeChallenge = async (verifier: string) => {
      const encoder = new TextEncoder()
      const data = encoder.encode(verifier)
      const digest = await window.crypto.subtle.digest('SHA-256', data)
      
      return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    }
    
    // Generate a random state value
    const generateState = () => {
      const array = new Uint8Array(28)
      window.crypto.getRandomValues(array)
      return Array.from(array, (byte) => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('')
    }
    
    const redirectUri = 'https://pulseip.shreyanshgajjar.com/callback'
    
    const initiateOAuth = async () => {
      const codeVerifier = generateCodeVerifier()
      // Use a fixed state instead of random
      const state = "fitbit-auth-state-123456"
      
      localStorage.setItem('fitbitCodeVerifier', codeVerifier)
      localStorage.setItem('fitbitState', state)
      
      // Store the timestamp to detect stale values
      localStorage.setItem('fitbitStateTimestamp', Date.now().toString())
      
      // Define the scopes your app needs
      const scopes = [
        'activity',
        'heartrate',
        'location',
        'nutrition',
        'profile',
        'settings',
        'sleep',
        'social',
        'weight'
      ].join(' ')
      
      // Build the authorization URL
      const authUrl = new URL('https://www.fitbit.com/oauth2/authorize')
      authUrl.searchParams.append('client_id', '23Q44W') // Your client ID
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('code_challenge', await generateCodeChallenge(codeVerifier))
      authUrl.searchParams.append('code_challenge_method', 'S256')
      authUrl.searchParams.append('scope', scopes)
      authUrl.searchParams.append('state', state)
      authUrl.searchParams.append('redirect_uri', redirectUri)
      
      // Redirect to Fitbit authorization page
      window.location.href = authUrl.toString()
    }
    
    // Start the OAuth flow
    initiateOAuth()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-newsreader mb-4">Redirecting to Fitbit...</h1>
        <p className="text-gray-600 mb-6">Please wait while we redirect you to Fitbit for authentication.</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500 mx-auto"></div>
      </div>
    </div>
  )
} 