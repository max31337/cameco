# Testing Guide - SyncingSteel HRIS System

## 🚀 Getting Started
### Step 3: Test Pending User Login Attempt
1. Navigate to http://127.0.0.1:8000/login
2. Try to login with pending user credentials (either username or email):
   - Email or Username: `testuser` OR `testuser@example.com`
   - Password: password
3. Expected behavior:
   - ❌ Login should fail
   - 📧 Error message: "Your account is pending approval. Please wait for an administrator to approve your registration."
   - User is logged out immediatelyrequisites
- PHP 8.3+
- Composer
- Node.js & npm
- SQLite (or PostgreSQL)

### Setup
```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed default admin user
php artisan db:seed --class=AdminUserSeeder

# Build frontend assets
npm run build

# OR run dev server for hot reloading
npm run dev

# Start Laravel server
php artisan serve
```

## 👤 Default Admin User

**Username:** `admin`  
**Email:** `admin@cameco.com`  
**Password:** `password`  
**Status:** Active (can login immediately)

> 💡 You can now login using either username or email!

## 🧪 Testing User Registration & Approval Flow

### Step 1: Register a New User
1. Navigate to http://127.0.0.1:8000/register
2. Fill in the registration form:
   - Name: Test User
   - Username: testuser
   - Email: testuser@example.com
   - Password: password
   - Confirm Password: password
   - ✓ Accept terms and conditions
3. Click "Create Account"
4. User will be created with **status = 'pending'**

### Step 2: Verify Registration Status
After registration, the user should:
- ✅ Be created in the database with `status = 'pending'`
- ✅ Be redirected to login page
- ❌ **NOT** be able to login (middleware blocks pending users)

### Step 3: Test Pending User Login Attempt
1. Navigate to http://127.0.0.1:8000/login
2. Try to login with pending user credentials:
   - Email or Username: testuser@example.com
   - Password: password
3. Expected behavior:
   - ❌ Login should fail
   - 📧 Error message: "Your account is pending approval. Please wait for an administrator to approve your registration."
   - User is logged out immediately

### Step 4: Approve User (Manual Database Update)
Since admin approval interface is not yet built, manually update the database:

```bash
php artisan tinker
```

```php
// Find the pending user
$user = \App\Models\User::where('email', 'testuser@example.com')->first();

// Approve the user
$admin = \App\Models\User::where('email', 'admin@cathay.com')->first();
$user->status = 'active';
$user->approved_by = $admin->id;
$user->approved_at = now();
$user->save();

// Verify
$user->status; // Should output: 'active'
```

Exit tinker: `exit`

### Step 5: Test Active User Login
1. Navigate to http://127.0.0.1:8000/login
2. Login with the now-active user:
   - Email: testuser@example.com
   - Password: password
3. Expected behavior:
   - ✅ Login successful
   - ✅ Redirected to /dashboard

## 📊 User Status Types

| Status | Description | Can Login? |
|--------|-------------|------------|
| `pending` | New registration awaiting admin approval | ❌ No |
| `active` | Approved by admin | ✅ Yes |
| `suspended` | Temporarily deactivated | ❌ No |
| `rejected` | Registration denied | ❌ No |

## 🔐 Middleware: EnsureUserIsActive

Applied to all authenticated routes in `routes/web.php`:

```php
Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
    'user.active', // ← Blocks non-active users
])->group(function () {
    // Protected routes
});
```

## 🎨 UI/UX Features

### Landing Page (http://127.0.0.1:8000)
- ✅ Full-width sections with Cathay Metal branding
- ✅ Gradient header with company colors (#0056A4, #0066B4)
- ✅ Three module sections: HR Management, Timekeeping, Payroll
- ✅ Cathay Metal logo with blue parallelogram + red triangle

### Login Page (http://127.0.0.1:8000/login)
- ✅ Cathay Metal logo in header
- ✅ Clean, centered form design
- ✅ Error messages with icons
- ✅ Remember me checkbox
- ✅ "Forgot password?" link
- ✅ "Create account" link

### Registration Page (http://127.0.0.1:8000/register)
- ✅ Cathay Metal logo in header
- ✅ Info box explaining approval process
- ✅ Terms and conditions checkbox
- ✅ "What happens next?" guide
- ✅ "Already have an account?" link

## 🐛 Known Issues / TODO

- [ ] Admin approval interface not yet built
- [ ] Email notifications not implemented
- [ ] Password reset functionality needs testing
- [ ] No role-based permissions yet (planned: spatie/laravel-permission)

## 📝 Next Steps

1. **Build Admin Approval Interface**
   - Page to list pending users
   - Approve/Reject buttons
   - Rejection reason textarea

2. **Implement Email Notifications**
   - Registration confirmation (to admins)
   - Approval notification (to user)
   - Rejection notification (to user)

3. **Add Role-Based Access Control (RBAC)**
   - Install spatie/laravel-permission
   - Define roles: Admin, Manager, Employee
   - Protect admin routes

## 🌐 URLs

- **Landing Page:** http://127.0.0.1:8000
- **Login:** http://127.0.0.1:8000/login
- **Register:** http://127.0.0.1:8000/register
- **Dashboard:** http://127.0.0.1:8000/dashboard (requires active user)

---

**Last Updated:** October 6, 2025  
**System:** SyncingSteel HRIS - Cathay Metal Corporation
