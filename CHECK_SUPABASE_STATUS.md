# How to Check if Supabase is Initialized

There are two ways Supabase can be "initialized" in your project:

1. **Supabase CLI Initialization** (for local development and Edge Functions)
2. **Supabase Configuration** (for connecting to your Supabase project)

## 1. Check if Supabase CLI is Initialized

Supabase CLI initialization is needed if you want to:
- Develop Edge Functions locally
- Use local Supabase instance
- Deploy Edge Functions

### Check for CLI Initialization:

**Windows (PowerShell):**
```powershell
# Check if supabase directory exists
Test-Path "supabase"

# Check if config file exists
Test-Path "supabase\config.toml"
```

**Mac/Linux:**
```bash
# Check if supabase directory exists
test -d supabase && echo "Exists" || echo "Not found"

# Check if config file exists
test -f supabase/config.toml && echo "Exists" || echo "Not found"
```

**What to look for:**
- ✅ `supabase/` directory exists in project root
- ✅ `supabase/config.toml` file exists
- ✅ `supabase/functions/` directory exists (for Edge Functions)

### Current Status:
Based on the check, **Supabase CLI is NOT initialized** in your project.

### To Initialize Supabase CLI:

1. **Install Supabase CLI** (if not already installed):
   
   **⚠️ Note:** `npm install -g supabase` does NOT work. Use one of these methods:
   
   **Option 1: Scoop (Recommended for Windows)**
   ```powershell
   # Install Scoop first (if needed)
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   
   # Then install Supabase
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```
   
   **Option 2: Local Installation (No Admin Required)**
   ```bash
   npm install supabase --save-dev
   # Then use: npx supabase init
   ```
   
   **Option 3: Chocolatey**
   ```powershell
   choco install supabase
   ```
   
   See `INSTALL_SUPABASE_CLI.md` for detailed instructions.

2. **Initialize Supabase in your project:**
   ```bash
   supabase init
   ```

3. **Link to your Supabase project** (optional, for deploying Edge Functions):
   ```bash
   supabase link --project-ref your-project-ref
   ```

## 2. Check if Supabase is Configured (Environment Variables)

Your Next.js app connects to Supabase using environment variables. This is separate from CLI initialization.

### Check Configuration:

**Windows (PowerShell):**
```powershell
# Check if .env.local exists
Test-Path ".env.local"

# View environment variables (if file exists)
Get-Content .env.local | Select-String "SUPABASE"
```

**Mac/Linux:**
```bash
# Check if .env.local exists
test -f .env.local && echo "Exists" || echo "Not found"

# View Supabase variables
grep SUPABASE .env.local
```

**Required Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUMMARIZE_MEETING_URL=https://your-project.supabase.co/functions/v1/summarize-meeting
```

### Check in Code:

You can also verify Supabase is configured by checking if the client initializes:

**Check client initialization:**
```typescript
// lib/supabase/client.ts should not throw errors
import { supabase } from '@/lib/supabase/client'
```

If the environment variables are missing, you'll get an error when the app starts.

## 3. Quick Status Check Script

Create a simple check script:

**Windows (`check-supabase.ps1`):**
```powershell
Write-Host "=== Supabase Status Check ===" -ForegroundColor Cyan

# Check CLI initialization
$cliInit = Test-Path "supabase\config.toml"
Write-Host "`nCLI Initialized: " -NoNewline
if ($cliInit) {
    Write-Host "YES ✓" -ForegroundColor Green
} else {
    Write-Host "NO ✗" -ForegroundColor Red
    Write-Host "  Run: supabase init" -ForegroundColor Yellow
}

# Check environment variables
$envFile = Test-Path ".env.local"
Write-Host "`nEnvironment File: " -NoNewline
if ($envFile) {
    Write-Host "EXISTS ✓" -ForegroundColor Green
    
    $envContent = Get-Content .env.local -ErrorAction SilentlyContinue
    $hasUrl = $envContent | Select-String "NEXT_PUBLIC_SUPABASE_URL"
    $hasKey = $envContent | Select-String "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    
    Write-Host "  SUPABASE_URL: " -NoNewline
    if ($hasUrl) { Write-Host "SET ✓" -ForegroundColor Green } else { Write-Host "MISSING ✗" -ForegroundColor Red }
    
    Write-Host "  SUPABASE_ANON_KEY: " -NoNewline
    if ($hasKey) { Write-Host "SET ✓" -ForegroundColor Green } else { Write-Host "MISSING ✗" -ForegroundColor Red }
} else {
    Write-Host "NOT FOUND ✗" -ForegroundColor Red
    Write-Host "  Create .env.local with your Supabase credentials" -ForegroundColor Yellow
}

# Check Supabase CLI installation
$cliInstalled = Get-Command supabase -ErrorAction SilentlyContinue
Write-Host "`nCLI Installed: " -NoNewline
if ($cliInstalled) {
    Write-Host "YES ✓" -ForegroundColor Green
    supabase --version
} else {
    Write-Host "NO ✗" -ForegroundColor Red
    Write-Host "  Install: npm install -g supabase" -ForegroundColor Yellow
}

Write-Host "`n=== End Check ===" -ForegroundColor Cyan
```

**Mac/Linux (`check-supabase.sh`):**
```bash
#!/bin/bash

echo "=== Supabase Status Check ==="

# Check CLI initialization
if [ -f "supabase/config.toml" ]; then
    echo -e "\nCLI Initialized: YES ✓"
else
    echo -e "\nCLI Initialized: NO ✗"
    echo "  Run: supabase init"
fi

# Check environment variables
if [ -f ".env.local" ]; then
    echo -e "\nEnvironment File: EXISTS ✓"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "  SUPABASE_URL: SET ✓"
    else
        echo "  SUPABASE_URL: MISSING ✗"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "  SUPABASE_ANON_KEY: SET ✓"
    else
        echo "  SUPABASE_ANON_KEY: MISSING ✗"
    fi
else
    echo -e "\nEnvironment File: NOT FOUND ✗"
    echo "  Create .env.local with your Supabase credentials"
fi

# Check Supabase CLI installation
if command -v supabase &> /dev/null; then
    echo -e "\nCLI Installed: YES ✓"
    supabase --version
else
    echo -e "\nCLI Installed: NO ✗"
    echo "  Install: npm install -g supabase"
fi

echo -e "\n=== End Check ==="
```

## Summary

**For your current project:**

1. ✅ **Supabase is CONFIGURED** - You have `lib/supabase/client.ts` and `lib/supabase/server.ts` set up
2. ❌ **Supabase CLI is NOT initialized** - No `supabase/` directory exists
3. ❓ **Environment variables** - Check your `.env.local` file (not readable here for security)

**To use Edge Functions (for Gemini summarization):**
- You need to initialize Supabase CLI: `supabase init`
- Then create and deploy the Edge Function (see `SUPABASE_EDGE_FUNCTION_SETUP.md`)

**For regular Supabase usage (auth, database):**
- You only need the environment variables in `.env.local`
- CLI initialization is optional

