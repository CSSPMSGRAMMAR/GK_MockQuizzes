# Vercel Deployment Setup

## Issue: User Creation Not Working on Vercel

The app uses file-based storage locally, but Vercel's serverless functions have a read-only filesystem. This has been fixed by using **Vercel KV (Redis)** for production.

## Setup Instructions

### 1. Install Vercel KV in Your Vercel Project

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database**
3. Select **KV** (Redis)
4. Create the KV database

### 2. Get Your KV Credentials

After creating the KV database, Vercel will automatically add these environment variables to your project:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN` (optional)

These are automatically available in your Vercel deployment.

### 3. Verify Environment Variables

In your Vercel project settings:
- Go to **Settings** → **Environment Variables**
- Ensure `KV_REST_API_URL` and `KV_REST_API_TOKEN` are present
- If deploying to multiple environments (Production, Preview, Development), add them to each

### 4. Redeploy

After setting up KV:
1. Push your code to trigger a new deployment, OR
2. Go to **Deployments** → Click **Redeploy** on the latest deployment

## How It Works

- **Local Development**: Uses file-based storage (`data/quiz-users.json`)
- **Vercel Production**: Automatically uses Vercel KV (Redis) when `KV_REST_API_URL` is detected

The code automatically detects the environment and uses the appropriate storage method.

## Testing

After deployment:
1. Go to `/admin` on your Vercel deployment
2. Unlock admin controls with your admin credentials
3. Add a new quiz user
4. The user should now be saved and persist across deployments

## Troubleshooting

If users still aren't being created:
1. Check Vercel logs: **Deployments** → Click on deployment → **Functions** tab
2. Verify KV environment variables are set correctly
3. Ensure you've created the KV database in Vercel
4. Check that `@vercel/kv` package is installed (it should be in `package.json`)

