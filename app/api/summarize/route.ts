import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Get authorization token from headers first
    let accessToken = req.headers.get('authorization')
    
    // Remove 'Bearer ' prefix if present
    if (accessToken?.startsWith('Bearer ')) {
      accessToken = accessToken.substring(7)
    }
    
    // If not in header, try to get from cookies
    if (!accessToken) {
      const cookieStore = await cookies()
      
      // Try common Supabase cookie names
      const cookieNames = [
        'sb-access-token',
        `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`,
      ]
      
      for (const cookieName of cookieNames) {
        const cookie = cookieStore.get(cookieName)
        if (cookie?.value) {
          accessToken = cookie.value
          break
        }
      }
      
      // If still not found, try to find any Supabase auth cookie
      if (!accessToken) {
        const allCookies = cookieStore.getAll()
        const authCookie = allCookies.find(cookie => 
          cookie.name.includes('sb-') && cookie.name.includes('-auth-token')
        )
        if (authCookie?.value) {
          accessToken = authCookie.value
        }
      }
    }

    // Check if the edge function URL is configured
    if (!process.env.SUMMARIZE_MEETING_URL) {
      return NextResponse.json(
        { error: 'Summarize meeting URL is not configured' },
        { status: 500 }
      )
    }

    // Get Supabase anon key for the apikey header (required by Edge Functions)
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase anon key is not configured' },
        { status: 500 }
      )
    }

    // Call the Supabase Edge Function
    // Edge Functions require both 'apikey' header and optionally 'Authorization' header
    const resp = await fetch(process.env.SUMMARIZE_MEETING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey, // Required by Supabase Edge Functions
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body),
    })

    const data = await resp.json()

    // Return the response with the same status code
    return NextResponse.json(data, { status: resp.status })
  } catch (error: any) {
    console.error('Error calling summarize edge function:', error)
    return NextResponse.json(
      { error: 'Failed to summarize meeting', message: error.message },
      { status: 500 }
    )
  }
}

