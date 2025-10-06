# DEBUGGING GUIDE - Profile Completion Not Saving

## Problem
When filling out http://127.0.0.1:8000/admin/profile/complete, nothing saves.

## What We've Verified
✅ **Backend is working** - Direct endpoint test confirms saveProgress() saves data correctly
✅ **Server is running** - Laravel server on http://127.0.0.1:8000
✅ **Database works** - Employee records can be created/updated

## Root Cause
**Frontend JavaScript is not calling the backend API**

## Steps to Fix

### 1. Build Frontend Assets
The frontend React code needs to be compiled:

```powershell
# Run this in the esbuild terminal
npm run dev
```

**OR for production:**
```powershell
npm run build
```

### 2. Check Browser Console
Open http://127.0.0.1:8000/admin/profile/complete and press F12:
- Look for JavaScript errors (red text)
- Check Network tab when you click "Next" or "Save"
- Verify POST request to `/admin/profile/save-progress` is being made

### 3. Common Issues

#### Issue: "npm run dev" not running
**Solution:** Start it in the esbuild terminal window

#### Issue: CSRF token error (419)
**Solution:** Refresh the page (F5) to get new CSRF token

#### Issue: No network request visible
**Solution:** Frontend build is stale, run `npm run build`

#### Issue: 404 error on save-progress
**Solution:** Clear route cache: `php artisan route:clear`

### 4. Manual Test Process

1. **Reset user:**
   ```powershell
   php tests/Custom/reset_user.php
   ```

2. **Start servers:**
   - Terminal 1: `php artisan serve` 
   - Terminal 2: `npm run dev`

3. **Test in browser:**
   - Go to http://127.0.0.1:8000
   - Login as admin@cameco.com / password
   - Fill step 1 fields
   - Click "Next"
   - Open F12 → Network tab
   - **Should see:** POST to /admin/profile/save-progress with status 200

4. **Verify saved:**
   ```powershell
   php tests/Custom/check_db.php
   ```

### 5. Quick Test Commands

```powershell
# Reset everything
php tests/Custom/reset_user.php

# Test backend directly (should work)
php tests/Custom/test_endpoint_direct.php

# Check if data saved
php tests/Custom/check_db.php

# View logs
Get-Content storage/logs/laravel.log -Tail 50
```

### 6. Expected Behavior

**When working correctly:**
1. Fill step 1 (name, DOB, gender, status)
2. Click "Next"
3. Console shows: "SaveProgress called - Current Step: 1"
4. Console shows: "Progress saved successfully"
5. Page moves to step 2
6. Database has employee record with step 1 data

**When user clicks "Skip":**
1. Saves current step data first
2. Marks profile as skipped
3. Redirects to dashboard
4. Dashboard shows percentage based on saved data

## Current Status
- ✅ Backend: **WORKING**
- ❌ Frontend: **NEEDS BUILD** 
- ⚠️ Server: **RUNNING** but frontend assets may be stale

## Next Action Required
**Run `npm run dev` in a separate terminal to compile the React frontend!**
