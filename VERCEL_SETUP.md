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

### SSL/TLS Connection Errors

If you see errors like `tlsv1 alert internal error` or `MongoServerSelectionError`:

1. **Check MongoDB Atlas Network Access** (MOST COMMON FIX):
   - Go to MongoDB Atlas → **Network Access**
   - Ensure `0.0.0.0/0` is in the allowed IP list
   - If not, add it and wait 2-3 minutes
   - Check that your cluster is **running** (not paused)

2. **Verify Connection String**:
   - Ensure `MONGODB_URI` in Vercel matches your MongoDB connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/`
   - Make sure password is URL-encoded if it contains special characters

3. **Check MongoDB Atlas Database User**:
   - Go to MongoDB Atlas → **Database Access**
   - Verify the user `csspmsgrammar_db_user` exists and has read/write permissions
   - Check that the password is correct

4. **Check Vercel Logs**:
   - Go to **Deployments** → Click on deployment → **Functions** tab
   - Look for detailed MongoDB connection errors
   - The logs will show if it's a network, authentication, or SSL issue

5. **Test Connection Locally**:
   - Set `MONGODB_URI` in your local `.env.local` file
   - Try creating a user locally to verify the connection string works

### Other Issues

- **Users not persisting**: Check MongoDB Atlas → **Collections** → Verify data is being saved
- **Slow connections**: MongoDB Atlas free tier has connection limits, consider upgrading if needed

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

