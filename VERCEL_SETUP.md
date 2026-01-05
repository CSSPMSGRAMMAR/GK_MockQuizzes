# Vercel Deployment Setup

## Issue: User Creation Not Working on Vercel

The app uses file-based storage locally, but Vercel's serverless functions have a read-only filesystem. This has been fixed by using **Redis** for production storage.

## Setup Instructions

### Option 1: Using Redis URL (Current Setup)

You've already set up Redis with a `REDIS_URL` connection string. The code now supports this!

1. **Verify Environment Variable**:
   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Ensure `REDIS_URL` is set with your Redis connection string
   - Format: `redis://default:password@host:port`

2. **Redeploy**:
   - Push your code or manually redeploy from Vercel dashboard

### Option 2: Using Vercel KV (Alternative)

If you prefer to use Vercel's native KV:

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database**
3. Select **KV** (Redis)
4. Create the KV database

Vercel will automatically add:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

## How It Works

The code automatically detects which Redis setup you're using:

- **Local Development**: Uses file-based storage (`data/quiz-users.json`)
- **Vercel Production with `REDIS_URL`**: Uses standard Redis connection
- **Vercel Production with `KV_REST_API_URL`**: Uses Vercel KV

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

