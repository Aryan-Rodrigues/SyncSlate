# SyncSlate - Meeting Intelligence Platform

A modern web application for transforming meetings into actionable insights and accountability. Built with Next.js, React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

Before running the app, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (recommended) or npm - Install pnpm: `npm install -g pnpm`

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd sync-slate-ui-build-new
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   
   Or if using npm:
   ```bash
   npm install
   ```

### Running the Development Server

1. **Start the development server**
   ```bash
   pnpm dev
   ```
   
   Or if using npm:
   ```bash
   npm run dev
   ```

2. **Open in Chrome**
   - The app will automatically open at `http://localhost:3000`
   - If it doesn't open automatically, manually navigate to `http://localhost:3000` in Chrome
   - The terminal will display: `✓ Ready in [time]` and `○ Local: http://localhost:3000`

3. **View the application**
   - The app should load in your default browser (Chrome if set as default)
   - To force open in Chrome:
     - Copy the URL from the terminal (`http://localhost:3000`)
     - Open Chrome
     - Paste the URL in the address bar
     - Press Enter

## 🎯 Using the Application

### Login (Fake Authentication)

The app uses a **fake login bypass** for MVP demonstration:

- **Any email and password will work**
- Simply enter any values and click "Sign in"
- You'll be redirected to the dashboard automatically
- Example: `demo@example.com` / `password123`

### Navigation

- **Sidebar**: Use the left sidebar to navigate between pages
  - Dashboard
  - Meetings
  - Tasks
  - Search
  - Notifications
  - Settings

- **Top Bar**: 
  - Workspace selector (dropdown)
  - User profile menu (avatar icon)

### Key Features

#### 📅 Meetings
- View all meetings in a table
- Search meetings in real-time
- Click any meeting to view details
- Upload meeting notes via modal

#### 📋 Tasks
- View tasks in a Kanban board (Not Started, In Progress, Done)
- **Double-click any task card** to cycle through statuses
- Tasks are organized by status

#### 🔍 Search
- Search across meetings, tasks, and decisions
- Real-time filtering as you type
- Results grouped by type

#### 🔔 Notifications
- View all notifications
- Mark individual notifications as read
- Mark all notifications as read
- Visual distinction between read/unread

#### ⚙️ Settings
- **Profile**: Update personal information and avatar
- **Workspace**: Manage workspace details and team members
- **Notifications**: Configure notification preferences
- **Integrations**: Connect/disconnect external services

## 🛠️ Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## 📁 Project Structure

```
sync-slate-ui-build-new/
├── app/                    # Next.js app directory
│   ├── (app)/             # Main app routes (dashboard, meetings, etc.)
│   ├── (auth)/            # Authentication routes (login, signup)
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── ui/                # shadcn UI components
│   ├── modals/            # Modal components
│   └── settings/          # Settings page components
├── lib/                   # Utility functions and data
│   ├── mock-data.ts      # Mock data for MVP
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **Theme**: next-themes (dark mode support)

## 🧪 MVP Features

This is an MVP (Minimum Viable Product) version with:

- ✅ **Mock Data**: All data is in-memory (no backend required)
- ✅ **Fake Authentication**: Login bypass for easy access
- ✅ **Full Navigation**: All routes are functional
- ✅ **Interactive UI**: All buttons, forms, and modals work
- ✅ **State Management**: React useState for all interactions
- ✅ **Toast Notifications**: Feedback for all user actions

## 🌐 Browser Compatibility

- **Chrome** (Recommended) - Latest version
- **Edge** - Latest version
- **Firefox** - Latest version
- **Safari** - Latest version

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
pnpm dev -- -p 3001
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml  # or package-lock.json
pnpm install
```

### Source Map Errors

If you see source map errors in the console:

**Option 1: Just restart the dev server** (easiest)
```bash
# Stop the server (Ctrl+C) and restart
pnpm dev
```

**Option 2: Clear .next folder manually**
- **Windows**: Delete the `.next` folder in File Explorer, or use:
  ```bash
  # PowerShell
  Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
  
  # Or run the provided script
  .\clear-next.bat
  ```

- **Mac/Linux**:
  ```bash
  rm -rf .next
  # Or run the provided script
  chmod +x clear-next.sh
  ./clear-next.sh
  ```

Then restart:
```bash
pnpm dev
```

**Note**: The source maps are now disabled in development mode to prevent these warnings. They don't affect functionality. If the `.next` folder doesn't exist, that's fine - just restart the server and the new config will take effect.

### App Not Loading in Chrome

1. Check that the dev server is running (`pnpm dev`)
2. Verify the URL is correct (`http://localhost:3000`)
3. Check browser console for errors (F12)
4. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
5. Clear browser cache

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Or rebuild
pnpm build
```

## 📝 Notes

- This is a **UI demonstration** version with mock data
- No backend or database is required
- All data is stored in memory and resets on page refresh
- Perfect for recruiter demonstrations and proof of concept

## 📦 Project Size

**Source code only** (excluding node_modules and .next): **~2.3 MB**

✅ All files are under GitHub's 100 MB limit
✅ Ready to push to GitHub

### If Getting "File Too Large" Error on GitHub

This usually means large files are in Git history. See `fix-github-size.md` for solutions:
- Start with a fresh Git repository (recommended)
- Or clean Git history to remove large files

### To Reduce Size Before Sharing

1. Delete `node_modules/` folder (can be restored with `pnpm install`)
2. Delete `.next/` folder (regenerated on build)
3. See `SIZE_OPTIMIZATION.md` for detailed optimization tips

## 🚀 Next Steps

For production deployment:

1. Set up a backend API
2. Replace mock data with real API calls
3. Implement real authentication
4. Add database integration
5. Deploy to Vercel, Netlify, or your preferred hosting

## 📄 License

This project is for demonstration purposes.

---

**Happy coding! 🎉**

For questions or issues, check the terminal output or browser console for error messages.

