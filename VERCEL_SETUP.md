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
1. **Check Vercel logs**: **Deployments** → Click on deployment → **Functions** tab → Look for Redis connection errors
2. **Verify environment variables**:
   - For `REDIS_URL`: Ensure the connection string is correct and includes password
   - For Vercel KV: Ensure `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
3. **Test Redis connection**: The code will log errors if Redis connection fails
4. **Check packages**: Ensure `redis` and `@vercel/kv` packages are in `package.json` (both are included)

## Current Setup

Based on your configuration, you're using:
- **Redis URL**: `REDIS_URL` environment variable
- **Provider**: Redis Labs (Cloud Redis)

The code will automatically connect to your Redis instance using the `REDIS_URL` connection string.

