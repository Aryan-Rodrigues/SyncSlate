import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate required fields
    if (!body.raw_notes) {
      return NextResponse.json(
        { error: 'raw_notes is required' },
        { status: 400 }
      )
    }

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
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl) {
        const projectRef = supabaseUrl.split('//')[1]?.split('.')[0]
        const cookieName = projectRef ? `sb-${projectRef}-auth-token` : null
        
        if (cookieName) {
          const cookie = cookieStore.get(cookieName)
          if (cookie?.value) {
            try {
              // The cookie value is a JSON string containing the session
              const sessionData = JSON.parse(cookie.value)
              accessToken = sessionData?.access_token || sessionData
            } catch {
              // If it's not JSON, it might be the token directly
              accessToken = cookie.value
            }
          }
        }
      }
      
      // If still not found, try to find any Supabase auth cookie
      if (!accessToken) {
        const allCookies = cookieStore.getAll()
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
    }

    // Check if the edge function URL is configured
    if (!process.env.SUMMARIZE_MEETING_URL) {
      return NextResponse.json(
        { error: 'Summarize meeting URL is not configured. Please set SUMMARIZE_MEETING_URL in your .env.local file.' },
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

    // Prepare the request body for the Edge Function
    // The Edge Function should expect: { raw_notes, title, meeting_date, participants, meeting_id }
    const edgeFunctionBody = {
      raw_notes: body.raw_notes,
      title: body.title || 'Untitled Meeting',
      meeting_date: body.meeting_date || null,
      participants: body.participants || null,
      meeting_id: body.meeting_id || null,
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
      body: JSON.stringify(edgeFunctionBody),
    })

    // Handle non-JSON responses
    const contentType = resp.headers.get('content-type')
    let data: any

    if (contentType?.includes('application/json')) {
      data = await resp.json()
    } else {
      const text = await resp.text()
      // Try to parse as JSON if it looks like JSON
      try {
        data = JSON.parse(text)
      } catch {
        // If it's not JSON, wrap it in a summary field
        data = { summary: text }
      }
    }

    // If the response is not ok, return error
    if (!resp.ok) {
      return NextResponse.json(
        { 
          error: data.error || `Edge function returned status ${resp.status}`,
          message: data.message || data.error || 'Failed to summarize meeting'
        },
        { status: resp.status }
      )
    }

    // Normalize the response - Edge Function might return summary in different fields
    const normalizedResponse = {
      summary: data.summary || data.ai_summary || data.text || data.content || data.message,
      ...data, // Include any other fields from the response
    }

    // Return the normalized response
    return NextResponse.json(normalizedResponse, { status: 200 })
  } catch (error: any) {
    console.error('Error calling summarize edge function:', error)
    return NextResponse.json(
      { 
        error: 'Failed to summarize meeting', 
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

