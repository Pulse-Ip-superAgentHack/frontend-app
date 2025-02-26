interface TokenData {
  access_token: string
  refresh_token: string
  expires_in: number
  user_id: string
  scope: string
}

export const saveTokens = (tokens: TokenData) => {
  const expiresAt = Date.now() + tokens.expires_in * 1000 - 300000 // 5 minutes buffer
  localStorage.setItem('fitbitTokens', JSON.stringify({
    ...tokens,
    expiresAt
  }))

  // Trigger a storage event for multi-tab support
  window.dispatchEvent(new Event('storage'))
}

export const getTokens = (): (TokenData & { expiresAt: number }) | null => {
  const tokens = localStorage.getItem('fitbitTokens')
  if (!tokens) return null
  return JSON.parse(tokens)
}

export const isTokenExpired = () => {
  const tokens = getTokens()
  if (!tokens) return true
  return Date.now() >= tokens.expiresAt
}

export const getValidToken = async (): Promise<string | null> => {
  const tokens = getTokens()
  if (!tokens) return null

  // If token is not expired, return it
  if (!isTokenExpired()) {
    return tokens.access_token
  }

  try {
    // Otherwise, try to refresh it
    const response = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: tokens.refresh_token })
    })
    
    const newTokens = await response.json()
    if (newTokens.error) throw new Error(newTokens.error)
    
    saveTokens(newTokens)
    return newTokens.access_token
  } catch (error) {
    console.error('Token refresh failed:', error)
    localStorage.removeItem('fitbitTokens')
    localStorage.removeItem('fitbitData')
    window.dispatchEvent(new Event('storage'))
    return null
  }
} 