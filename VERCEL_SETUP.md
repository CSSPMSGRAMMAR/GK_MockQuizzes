# Vercel Deployment Setup

## Issue: User Creation Not Working on Vercel

The app uses file-based storage locally, but Vercel's serverless functions have a read-only filesystem. This has been fixed by using **MongoDB** for production storage.

## Setup Instructions

### MongoDB Configuration

1. **Set Environment Variable in Vercel**:
   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Add `MONGODB_URI` with your MongoDB connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/`
   - **Current value**: `mongodb+srv://csspmsgrammar_db_user:0RvdCgtd8X3X7MjN@cluster0.eu370ti.mongodb.net/`

2. **Optional - Database Name**:
   - Add `MONGODB_DB` if you want to use a specific database name
   - Default: `pmsgk-quiz`

3. **Redeploy**:
   - Push your code or manually redeploy from Vercel dashboard

## How It Works

The code automatically detects the environment:

- **Local Development**: Uses file-based storage (`data/quiz-users.json` and `data/users.json`)
- **Vercel Production**: Automatically uses MongoDB when `MONGODB_URI` is detected

The code will automatically use the appropriate storage method based on available environment variables.

## Testing

After deployment:
1. Go to `/admin` on your Vercel deployment
2. Unlock admin controls with your admin credentials
3. Add a new quiz user
4. The user should now be saved and persist across deployments

## Troubleshooting

If users still aren't being created:
1. **Check Vercel logs**: **Deployments** → Click on deployment → **Functions** tab → Look for MongoDB connection errors
2. **Verify environment variables**:
   - Ensure `MONGODB_URI` is set correctly in Vercel
   - Check that the connection string includes the password
   - Verify network access: MongoDB Atlas allows connections from specific IPs (add `0.0.0.0/0` for Vercel)
3. **Test MongoDB connection**: The code will log errors if MongoDB connection fails
4. **Check packages**: Ensure `mongodb` package is in `package.json` (it's included)

## MongoDB Atlas Network Access (CRITICAL)

**This is the most common cause of connection errors!**

Make sure your MongoDB Atlas cluster allows connections from Vercel:
1. Go to MongoDB Atlas → **Network Access** (or **Security** → **Network Access**)
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (or add `0.0.0.0/0`)
   - This allows all IPs, which is needed for Vercel's dynamic IPs
   - For production, you can restrict to specific IP ranges later
4. Click **Confirm**
5. Wait 1-2 minutes for changes to propagate

**If you see SSL/TLS errors**, it's almost always because:
- Network Access is not configured to allow Vercel IPs
- The IP whitelist hasn't propagated yet (wait a few minutes)
- Your MongoDB cluster is paused (check cluster status)

## Current Setup

Based on your configuration, you're using:
- **MongoDB URI**: `mongodb+srv://csspmsgrammar_db_user:0RvdCgtd8X3X7MjN@cluster0.eu370ti.mongodb.net/`
- **Database**: `pmsgk-quiz` (default)
- **Collections**: 
  - `quiz-users` - for quiz access users
  - `users` - for general users

The code will automatically connect to your MongoDB instance using the `MONGODB_URI` connection string.

