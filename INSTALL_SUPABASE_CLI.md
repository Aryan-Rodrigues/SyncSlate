# How to Install Supabase CLI on Windows

**⚠️ Important:** Supabase CLI **cannot** be installed globally via `npm install -g supabase`. The CLI intentionally blocks this method.

## Recommended: Scoop (Easiest for Windows)

### Step 1: Install Scoop

Open PowerShell **as Administrator** and run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### Step 2: Add Supabase Bucket

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
```

### Step 3: Install Supabase CLI

```powershell
scoop install supabase
```

### Step 4: Verify Installation

```powershell
supabase --version
```

You should see the version number (e.g., `supabase version 1.234.5`)

---

## Alternative: Chocolatey

### Step 1: Install Chocolatey

Open PowerShell **as Administrator** and run:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Step 2: Install Supabase CLI

```powershell
choco install supabase
```

### Step 3: Verify Installation

```powershell
supabase --version
```

---

## Alternative: Local Installation (No Admin Required)

If you don't have admin rights or prefer not to use package managers:

### Step 1: Install as Dev Dependency

In your project directory:

```bash
npm install supabase --save-dev
```

### Step 2: Use via npx

All Supabase commands will need `npx` prefix:

```bash
# Check version
npx supabase --version

# Initialize Supabase
npx supabase init

# Create Edge Function
npx supabase functions new summarize-meeting

# Deploy Edge Function
npx supabase functions deploy summarize-meeting
```

### Step 3: Add npm Scripts (Optional)

Add to your `package.json`:

```json
{
  "scripts": {
    "supabase": "supabase",
    "supabase:init": "supabase init",
    "supabase:functions:new": "supabase functions new",
    "supabase:functions:deploy": "supabase functions deploy"
  }
}
```

Then you can run:
```bash
npm run supabase:init
npm run supabase:functions:new summarize-meeting
```

---

## Alternative: Direct Download

1. Go to: https://github.com/supabase/cli/releases
2. Download the latest `supabase_X.X.X_windows_amd64.zip`
3. Extract the `supabase.exe` file
4. Either:
   - Add it to your PATH, OR
   - Place it in your project folder and use `.\supabase.exe` instead of `supabase`

---

## Troubleshooting

### "supabase: command not found"

After installing via Scoop or Chocolatey, you may need to:
1. Close and reopen your terminal
2. Or refresh your PATH:
   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   ```

### Permission Errors

If you get permission errors:
- Use the **Local Installation** method (no admin required)
- Or run PowerShell as Administrator

### Still Having Issues?

Check the official Supabase CLI installation guide:
https://github.com/supabase/cli#install-the-cli

---

## Quick Start After Installation

Once Supabase CLI is installed:

```bash
# 1. Initialize Supabase in your project
supabase init

# 2. Verify it worked
ls supabase  # Should see config.toml

# 3. Create your Edge Function
supabase functions new summarize-meeting
```

