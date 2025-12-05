# Supabase Edge Function Setup for Gemini Meeting Summarization

This guide explains how to set up a Supabase Edge Function to use Google Gemini for meeting summarization.

## Prerequisites

1. A Supabase project
2. Google Gemini API key
3. Supabase CLI installed (see installation options below)

## Installing Supabase CLI

**⚠️ Important:** Supabase CLI cannot be installed globally via `npm install -g supabase`. Use one of these methods instead:

### Option 1: Scoop (Recommended for Windows)

1. **Install Scoop** (if not already installed):
   ```powershell
   # Run in PowerShell (as Administrator)
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Install Supabase CLI via Scoop**:
   ```powershell
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

3. **Verify installation**:
   ```powershell
   supabase --version
   ```

### Option 2: Chocolatey (Windows)

1. **Install Chocolatey** (if not already installed):
   ```powershell
   # Run in PowerShell (as Administrator)
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install Supabase CLI**:
   ```powershell
   choco install supabase
   ```

### Option 3: Local Installation (No Admin Required)

Install Supabase CLI as a local project dependency:

1. **Install in your project**:
   ```bash
   npm install supabase --save-dev
   ```

2. **Use via npx**:
   ```bash
   npx supabase --version
   npx supabase init
   npx supabase functions new summarize-meeting
   ```

   Or add scripts to `package.json`:
   ```json
   {
     "scripts": {
       "supabase": "supabase",
       "supabase:init": "supabase init",
       "supabase:functions:new": "supabase functions new"
     }
   }
   ```

   Then run:
   ```bash
   npm run supabase:init
   ```

### Option 4: Direct Download (Windows)

1. Download the latest release from: https://github.com/supabase/cli/releases
2. Extract the `.exe` file
3. Add it to your PATH or use it directly

### Verify Installation

After installation, verify it works:
```bash
supabase --version
```

You should see something like: `supabase version 1.x.x`

## Step 1: Create the Edge Function

1. Initialize Supabase in your project (if not already done):
   ```bash
   npx supabase init
   ```

2. Create a new Edge Function:
   ```bash
   npx supabase functions new summarize-meeting
   ```

3. Navigate to the function directory:
   ```bash
   cd supabase/functions/summarize-meeting
   ```

## Step 2: Install Dependencies

Create a `package.json` file in the function directory:

```json
{
  "name": "summarize-meeting",
  "version": "1.0.0",
  "dependencies": {
    "@google/generative-ai": "^0.2.0"
  }
}
```

Install dependencies:
```bash
npm install
```

## Step 3: Implement the Edge Function

Create `index.ts` in the function directory:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.2.0'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const { raw_notes, title, meeting_date, participants } = await req.json()

    if (!raw_notes) {
      return new Response(
        JSON.stringify({ error: 'raw_notes is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Create a prompt for summarization
    const prompt = `Please provide a concise and professional summary of the following meeting notes. 
Focus on key decisions, action items, and important discussion points.

Meeting Title: ${title || 'Untitled Meeting'}
Meeting Date: ${meeting_date || 'Not specified'}
Participants: ${participants ? participants.join(', ') : 'Not specified'}

Meeting Notes:
${raw_notes}

Please provide a summary that includes:
1. Main topics discussed
2. Key decisions made
3. Action items (if any)
4. Important points raised

Summary:`

    // Generate summary using Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()

    return new Response(
      JSON.stringify({ 
        summary,
        success: true,
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error: any) {
    console.error('Error summarizing meeting:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to summarize meeting',
        message: error.message,
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
```

## Step 4: Set Environment Variables

Set your Gemini API key as a secret in Supabase:

## Step 4: Authenticate and Link Project

Before setting secrets, you need to authenticate:

1. **Login to Supabase CLI** (run in your terminal):
   ```bash
   npx supabase login
   ```
   This will open your browser to authorize the CLI. You only need to do this once.

2. **Link your Supabase project**:
   ```bash
   npx supabase link --project-ref your-project-ref
   ```
   
   To find your project ref:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to **Settings** → **General**
   - Copy the **Reference ID** (looks like: `abcdefghijklmnop`)
   
   Or link interactively:
   ```bash
   npx supabase link
   ```

**Note:** If you get "Access token not provided" error, see `SUPABASE_CLI_AUTHENTICATION.md` for detailed authentication instructions.

## Step 5: Set Environment Variables (Secrets)

Set your Gemini API key as a secret:

```bash
npx supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here
```

Replace `your-gemini-api-key-here` with your actual Gemini API key from Google AI Studio.

Verify the secret was set:
```bash
npx supabase secrets list
```

## Step 6: Deploy the Edge Function

Deploy the function to Supabase:

```bash
npx supabase functions deploy summarize-meeting
```

## Step 6: Configure Your Next.js App

Add the Edge Function URL to your `.env.local` file:

```env
SUMMARIZE_MEETING_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/summarize-meeting
```

Replace `YOUR_PROJECT_REF` with your actual Supabase project reference (found in your Supabase dashboard URL).

## Testing

You can test the Edge Function directly:

```bash
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/summarize-meeting \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "raw_notes": "Meeting notes here...",
    "title": "Test Meeting",
    "meeting_date": "2024-01-15"
  }'
```

## Notes

- The Edge Function uses Deno runtime
- Make sure your Gemini API key has sufficient quota
- The function handles CORS for browser requests
- Error handling is included for common failure scenarios

