import { createClient } from '@supabase/supabase-js'

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

// Validate URL is a valid URL
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(
    `Invalid NEXT_PUBLIC_SUPABASE_URL: "${supabaseUrl}"\n` +
    'Please provide a valid URL.\n' +
    'Example: https://your-project.supabase.co'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
