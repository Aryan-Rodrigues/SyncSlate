# How to Authenticate Supabase CLI

When running `npx supabase secrets set` or other Supabase CLI commands, you need to authenticate first.

## Option 1: Interactive Login (Recommended)

Run this command in your **own terminal** (not through the automated system):

```bash
npx supabase login
```

This will:
1. Open your browser automatically
2. Ask you to sign in to Supabase (if not already signed in)
3. Authorize the CLI
4. Save your access token locally

**Note:** You only need to do this once. The token is saved for future use.

---

## Option 2: Manual Token Setup

If you can't use interactive login, you can manually set the access token:

### Step 1: Get Your Access Token

1. Go to: https://supabase.com/dashboard/account/tokens
2. Sign in to your Supabase account
3. Click **"Generate new token"**
4. Give it a name (e.g., "CLI Access Token")
5. Copy the token (you won't see it again!)

### Step 2: Set the Environment Variable

**Windows PowerShell:**
```powershell
# For current session only
$env:SUPABASE_ACCESS_TOKEN = "your-token-here"

# Or set permanently (for current user)
[System.Environment]::SetEnvironmentVariable("SUPABASE_ACCESS_TOKEN", "your-token-here", "User")
```

**Windows Command Prompt:**
```cmd
set SUPABASE_ACCESS_TOKEN=your-token-here
```

**Linux/Mac:**
```bash
# For current session only
export SUPABASE_ACCESS_TOKEN="your-token-here"

# Or set permanently (add to ~/.bashrc or ~/.zshrc)
echo 'export SUPABASE_ACCESS_TOKEN="your-token-here"' >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Verify It Works

```bash
npx supabase secrets list
```

If it works, you'll see your secrets (or an empty list if none exist).

---

## Option 3: Use --token Flag

You can also pass the token directly to commands:

```bash
npx supabase secrets set GEMINI_API_KEY=your-gemini-key --token your-supabase-access-token
```

---

## Setting Secrets for Edge Functions

Once authenticated, you can set secrets:

```bash
# Set Gemini API key
npx supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here

# Verify it was set
npx supabase secrets list
```

**Important:** 
- Replace `your-gemini-api-key-here` with your actual Gemini API key
- You need to link your project first (see below)

---

## Linking Your Project

Before setting secrets, make sure your project is linked:

```bash
# Link to your Supabase project
npx supabase link --project-ref your-project-ref
```

To find your project ref:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **General**
4. Copy the **Reference ID** (it looks like: `abcdefghijklmnop`)

Or you can link interactively:
```bash
npx supabase link
```

This will show you a list of your projects to choose from.

---

## Troubleshooting

### "Access token not provided"

- Make sure you've run `npx supabase login` OR set `SUPABASE_ACCESS_TOKEN` environment variable
- If using environment variable, restart your terminal after setting it

### "Project not found"

- Make sure you've linked your project with `npx supabase link`
- Verify your project ref is correct

### "Permission denied"

- Make sure your access token has the right permissions
- Try generating a new token from the dashboard

### Token Expired

If your token expires, just run `npx supabase login` again to get a new one.

---

## Quick Reference

```bash
# 1. Login (one-time setup)
npx supabase login

# 2. Link project (if not already linked)
npx supabase link --project-ref your-project-ref

# 3. Set secrets
npx supabase secrets set GEMINI_API_KEY=your-key-here

# 4. Verify
npx supabase secrets list

# 5. Deploy function
npx supabase functions deploy summarize-meeting
```

