# GitHub Setup Guide

## If You're Getting "File Too Large" Error

GitHub has a **100 MB file size limit** for individual files. If you're getting this error, follow these steps:

### Step 1: Check for Large Files in Git History

If you've already committed large files, they're in Git history even if deleted:

```bash
# Check Git history for large files
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {print substr($0,6)}' | sort --numeric-sort --key=2 | tail -20
```

### Step 2: Remove Large Files from Git History

If you find large files in history:

```bash
# Remove large files from Git history (use with caution!)
git filter-branch --tree-filter 'rm -f path/to/large-file' HEAD
# Or use BFG Repo-Cleaner (faster)
```

### Step 3: Start Fresh (Recommended for MVP)

If you haven't pushed yet or can start fresh:

```bash
# Remove .git folder
rm -rf .git

# Initialize new repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin <your-repo-url>

# Push
git push -u origin main
```

### Step 4: Use Git LFS for Large Files (If Needed)

If you need to track large files:

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.png"
git lfs track "*.jpg"

# Add .gitattributes
git add .gitattributes
```

## Current Project Status

✅ **Total size: ~2.31 MB** (excluding node_modules and .next)
✅ **Largest file: 0.61 MB** (slack-communication.png)
✅ **All files under 100 MB limit**

## Quick Fix Commands

```bash
# 1. Make sure .gitignore is working
git status

# 2. If node_modules or .next are tracked, remove them:
git rm -r --cached node_modules
git rm -r --cached .next

# 3. Commit the changes
git commit -m "Remove large folders from tracking"

# 4. Push
git push
```

## Verify Before Pushing

```bash
# Check what will be pushed
git ls-files | xargs ls -lh | awk '{print $5, $9}' | sort -h

# Check total size of tracked files
git ls-files | xargs cat | wc -c
```

