# Quick Start Guide - PMS GK Quiz Platform

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
# NextAuth.js
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# MongoDB (optional, for production)
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=pmsgk-quiz

# Admin Credentials (optional, defaults provided)
QUIZ_ADMIN_USERNAME=NimraG
QUIZ_ADMIN_PASSWORD=Nimra1014
```

### 3. Generate NextAuth Secret
```bash
openssl rand -base64 32
```
Use the output as `NEXTAUTH_SECRET`

### 4. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

## 🎯 Features

### ✅ Public Quizzes (No Login Required)
- **Demo Quiz 1**: 100 questions (q1-q100)
- **Demo Quiz 2**: 100 questions (q101-q200)
- **Demo Quiz 3**: 100 questions (q201-q300)

### 🔐 User Authentication
- Login at `/login`
- Credentials managed by admin
- Access to premium quizzes

### 👨‍💼 Admin Dashboard
- Login at `/admin/login`
- **Default Credentials**:
  - Username: `NimraG`
  - Password: `Nimra1014`
- Manage users and quiz access

## 🎨 Technologies Used

- **Next.js 16** - React framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **NextAuth.js** - Authentication
- **Zustand** - State management
- **MongoDB** - Database (production)

## 📱 Mobile-First Design

- Fully responsive
- Touch-friendly interface
- Optimized for all screen sizes

## 🔒 Security Notes

- Change `NEXTAUTH_SECRET` in production
- Change admin password in production
- Consider password hashing for users
- Use HTTPS in production

