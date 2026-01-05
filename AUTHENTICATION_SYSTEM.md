# Authentication System - PMS GK Quiz

## Overview

A simple, hard-coded admin-based authentication system that allows:
- **Admin** to manage users via a GUI dashboard
- **Users** to login and attempt the quiz
- **User data** stored in a JSON file

## 🔐 Admin Credentials

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important:** Change the password in production! Edit `lib/auth.ts`:
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'your-secure-password-here',
};
```

## 📁 User Storage

Users are stored in: `data/users.json`

The file structure:
```json
[
  {
    "id": "user1",
    "username": "student1",
    "password": "password123",
    "name": "Student One",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

⚠️ **Security Note:** Passwords are stored in plain text. For production, implement password hashing (bcrypt, etc.).

## 🛣️ Routes

### Public Routes
- `/login` - User login page
- `/admin/login` - Admin login page

### Protected Routes (Require Authentication)
- `/` - Quiz instructions (requires user login)
- `/exam` - Exam interface (requires user login)
- `/result` - Exam results (requires user login)
- `/admin/dashboard` - Admin dashboard (requires admin login)

## 🔧 How It Works

### Admin Flow
1. Admin goes to `/admin/login`
2. Enters admin credentials (hard-coded)
3. Gets redirected to `/admin/dashboard`
4. Can add/delete users via GUI
5. Users are saved to `data/users.json`

### User Flow
1. User goes to `/login`
2. Enters username/password (created by admin)
3. Gets redirected to `/` (quiz instructions)
4. Can attempt quiz, view results
5. Session stored in localStorage

## 📝 API Endpoints

### Admin Authentication
- `POST /api/auth/admin/login` - Admin login
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

### User Authentication
- `POST /api/auth/user/login` - User login
  ```json
  {
    "username": "student1",
    "password": "password123"
  }
  ```

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
  ```json
  {
    "username": "student1",
    "password": "password123",
    "name": "Student One"
  }
  ```
- `DELETE /api/users?id=user1` - Delete user

## 🎨 Features

### Admin Dashboard
- ✅ View all users
- ✅ Add new users (username, password, name)
- ✅ Delete users
- ✅ User statistics
- ✅ Clean, simple GUI

### User Features
- ✅ Secure login
- ✅ Session management
- ✅ Protected quiz access
- ✅ Logout functionality

## 🔒 Session Management

Sessions are stored in `localStorage`:
- Admin: `pms-gk-admin-session`
- User: `pms-gk-user-session`

## 🚀 Usage

### First Time Setup
1. Start the application
2. Go to `/admin/login`
3. Login with admin credentials
4. Add users via the dashboard
5. Share credentials with students

### For Students
1. Go to `/login`
2. Enter username/password provided by admin
3. Access quiz and attempt it

## 📦 Files Structure

```
pms-gk-quiz-standalone/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login
│   │   └── dashboard/page.tsx      # Admin dashboard
│   ├── login/page.tsx              # User login
│   ├── api/
│   │   ├── auth/
│   │   │   ├── admin/login/route.ts
│   │   │   └── user/login/route.ts
│   │   └── users/route.ts          # User CRUD
│   └── ...
├── lib/
│   └── auth.ts                     # Auth utilities
└── data/
    └── users.json                  # User storage
```

## 🔐 Security Considerations

**Current Implementation (Development):**
- ✅ Hard-coded admin credentials
- ✅ Plain text password storage
- ✅ localStorage sessions
- ✅ File-based user storage

**For Production, Consider:**
- 🔒 Password hashing (bcrypt)
- 🔒 JWT tokens instead of localStorage
- 🔒 Database instead of JSON file
- 🔒 HTTPS only
- 🔒 Rate limiting
- 🔒 Input validation & sanitization
- 🔒 CSRF protection

## 🛠️ Customization

### Change Admin Credentials
Edit `lib/auth.ts`:
```typescript
export const ADMIN_CREDENTIALS = {
  username: 'your-admin-username',
  password: 'your-secure-password',
};
```

### Change User Storage Location
Edit `app/api/users/route.ts`:
```typescript
const USERS_FILE = join(process.cwd(), 'your', 'path', 'users.json');
```

## ✅ Testing

1. **Test Admin Login:**
   - Go to `/admin/login`
   - Use credentials: `admin` / `admin123`
   - Should redirect to dashboard

2. **Test User Creation:**
   - Login as admin
   - Add a new user
   - Check `data/users.json` for new entry

3. **Test User Login:**
   - Go to `/login`
   - Use created user credentials
   - Should access quiz

4. **Test Protected Routes:**
   - Logout
   - Try accessing `/` or `/exam`
   - Should redirect to `/login`

---

**Status:** ✅ Complete - Authentication system ready to use!

