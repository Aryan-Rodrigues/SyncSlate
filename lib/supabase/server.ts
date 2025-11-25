import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Read from .env.local (Next.js automatically loads these)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

// Validate that environment variables are set
if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable.\n' +
    'Please create a .env.local file in the root directory with:\n' +
    'NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.\n' +
    'Please create a .env.local file in the root directory with:\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key'
  )
}

// Validate URL format
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(
    `Invalid NEXT_PUBLIC_SUPABASE_URL format: "${supabaseUrl}"\n` +
    'The URL must start with http:// or https://\n' +
    'Example: https://your-project.supabase.co'
  )
}

export const supabaseServer = async () => {
  const cookieStore = await cookies()
  
  // Get all cookies to find Supabase session
  const allCookies = cookieStore.getAll()
  
  // Supabase stores session in a cookie with format: sb-<project-ref>-auth-token
  // Extract project ref from URL
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0]
  const cookieName = projectRef ? `sb-${projectRef}-auth-token` : null
  
  // Try to find the auth cookie
  let accessToken: string | undefined
  if (cookieName) {
    const authCookie = cookieStore.get(cookieName)
    if (authCookie?.value) {
      try {
        // The cookie value is a JSON string containing the session
        const sessionData = JSON.parse(authCookie.value)
        accessToken = sessionData?.access_token || sessionData
      } catch {
        // If it's not JSON, it might be the token directly
        accessToken = authCookie.value
      }
    }
  }
  
  // Also try to find any Supabase auth cookie as fallback
  if (!accessToken) {
    const authCookie = allCookies.find(cookie => 
      cookie.name.includes('sb-') && cookie.name.includes('-auth-token')
    )
    if (authCookie?.value) {
      try {
        const sessionData = JSON.parse(authCookie.value)
        accessToken = sessionData?.access_token || sessionData
      } catch {
        accessToken = authCookie.value
      }
    }
  }

  // Create client with the session if available
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return supabase
}
