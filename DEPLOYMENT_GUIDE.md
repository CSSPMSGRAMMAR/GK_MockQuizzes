# PMS GK Quiz - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the easiest way to deploy Next.js applications.

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to project directory
cd pms-gk-quiz-standalone

# 3. Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? pms-gk-quiz (or your choice)
# - Directory? ./
# - Override settings? No

# Your app will be live at: https://your-project.vercel.app
```

**Or use Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel auto-detects Next.js
5. Click "Deploy"

### Option 2: Netlify

```bash
# 1. Build the project
npm run build

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod

# Follow prompts and select the .next folder
```

**Or use Netlify Dashboard:**
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `.next` folder
3. Or connect your Git repository

### Option 3: AWS Amplify

```bash
# 1. Install Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configure Amplify
amplify configure

# 3. Initialize
amplify init

# 4. Add hosting
amplify add hosting

# 5. Publish
amplify publish
```

### Option 4: Docker

```dockerfile
# Create Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t pms-gk-quiz .
docker run -p 3000:3000 pms-gk-quiz
```

### Option 5: Traditional VPS (Ubuntu/Debian)

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone or upload your project
git clone your-repo-url
cd pms-gk-quiz-standalone

# 4. Install dependencies
npm install

# 5. Build
npm run build

# 6. Install PM2 for process management
npm install -g pm2

# 7. Start the app
pm2 start npm --name "pms-gk-quiz" -- start

# 8. Setup PM2 to start on boot
pm2 startup
pm2 save

# 9. Setup Nginx reverse proxy
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/pms-gk-quiz

# Add:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/pms-gk-quiz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 10. Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔧 Environment Variables

Create `.env.local` for environment-specific settings:

```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 📊 Performance Optimization

### 1. Enable Static Export (if no server features needed)

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

Then build:
```bash
npm run build
# Deploy the 'out' folder
```

### 2. Enable Compression

Already enabled in Next.js by default.

### 3. CDN Configuration

For static assets, use a CDN:
- Cloudflare
- AWS CloudFront
- Fastly

## 🔒 Security Checklist

- [ ] Enable HTTPS
- [ ] Set up CSP headers
- [ ] Configure CORS if needed
- [ ] Rate limiting (if using API)
- [ ] Regular dependency updates

## 📈 Monitoring

### Add Analytics

```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Memory Issues

```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## 📱 Mobile App (Future)

Convert to mobile app using:
- React Native Web
- Capacitor
- PWA (Progressive Web App)

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
```

## 📊 Cost Estimates

### Free Tier Options:
- **Vercel**: Free for personal projects
- **Netlify**: 100GB bandwidth/month free
- **GitHub Pages**: Free for public repos

### Paid Options:
- **Vercel Pro**: $20/month
- **AWS**: ~$5-20/month (depends on traffic)
- **DigitalOcean**: $5-10/month (VPS)

## ✅ Pre-Deployment Checklist

- [ ] All questions reviewed and correct
- [ ] Timer working properly
- [ ] Results calculation accurate
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] SEO metadata added
- [ ] Analytics configured
- [ ] Error tracking setup
- [ ] Backup strategy in place

## 🎯 Post-Deployment

1. **Test thoroughly** on production
2. **Monitor performance** using analytics
3. **Collect user feedback**
4. **Regular updates** to questions
5. **Security patches** for dependencies

---

**Your PMS GK Quiz is ready to deploy! 🚀**

Choose the deployment option that best fits your needs and budget.



