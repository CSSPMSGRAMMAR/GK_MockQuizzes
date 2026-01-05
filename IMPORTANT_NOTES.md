# Important Notes for PMS GK Quiz Standalone

## ⚠️ Node.js Version Requirement

**IMPORTANT**: This Next.js 16 application requires Node.js version **20.9.0 or higher**.

Your current system has Node.js 18.20.8, which is not compatible.

### How to Upgrade Node.js

#### Option 1: Using NVM (Recommended)

```bash
# Install NVM if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source
source ~/.bashrc

# Install Node 20
nvm install 20

# Use Node 20
nvm use 20

# Set as default
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
```

#### Option 2: Using Package Manager

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### After Upgrading Node.js

```bash
cd pms-gk-quiz-standalone

# Clean install
rm -rf node_modules package-lock.json
npm install

# Build
npm run build

# Run
npm run dev
```

## 📦 Alternative: Use Earlier Next.js Version

If you cannot upgrade Node.js, you can downgrade Next.js:

```bash
cd pms-gk-quiz-standalone

# Downgrade to Next.js 14 (compatible with Node 18)
npm install next@14 react@18 react-dom@18

# Update package.json
# Change "next": "16.1.1" to "next": "^14.2.0"

# Rebuild
npm run build
```

## 🚀 Quick Start (After Node Upgrade)

```bash
cd pms-gk-quiz-standalone
npm install
npm run dev
```

Visit: http://localhost:3000

## 📁 What's Included

### Complete Standalone Application
- ✅ All 100 MCQ questions
- ✅ Full exam functionality
- ✅ Timer, navigation, marking
- ✅ Results with analytics
- ✅ Mobile responsive
- ✅ No backend required

### File Structure
```
pms-gk-quiz-standalone/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Instructions page
│   ├── exam/page.tsx      # Exam interface
│   └── result/page.tsx    # Results page
├── components/            # React components
│   ├── exam/             # Exam-specific components
│   └── ui/               # UI components
├── stores/               # Zustand state management
├── data/                 # MCQ questions
├── types/                # TypeScript definitions
└── lib/                  # Utilities
```

## 🎯 Features

1. **Instructions Page** (`/`)
   - Exam overview
   - Rules and regulations
   - Terms acceptance
   - Start exam button

2. **Exam Page** (`/exam`)
   - Live timer
   - Question display
   - Option selection
   - Navigation palette
   - Mark for review
   - Submit functionality

3. **Result Page** (`/result`)
   - Score summary
   - Statistics
   - Category performance
   - Detailed solutions
   - Retake option

## 🔧 Configuration

All exam settings in `stores/examStore.ts`:
- Total questions: 100
- Duration: 120 minutes
- Negative marking: -0.25
- Passing: 50%

## 📝 Adding More Questions

Edit `data/pms-gk-mcqs.ts` to add questions:

```typescript
{
  id: 'q101',
  questionNumber: 101,
  category: 'Your Category',
  question: 'Your question?',
  options: [
    { id: 'q101a', text: 'Option A', isCorrect: false },
    { id: 'q101b', text: 'Option B', isCorrect: true },
    { id: 'q101c', text: 'Option C', isCorrect: false },
    { id: 'q101d', text: 'Option D', isCorrect: false },
  ],
}
```

## 🚀 Deployment

### Vercel (Easiest)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Docker
```bash
docker build -t pms-gk-quiz .
docker run -p 3000:3000 pms-gk-quiz
```

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 🐛 Troubleshooting

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Port in Use
```bash
PORT=3001 npm run dev
```

### Memory Issues
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## 📚 Documentation

- `README.md` - Main documentation
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `IMPORTANT_NOTES.md` - This file

## ✅ Pre-Deployment Checklist

- [ ] Node.js 20+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] Local testing done (`npm run dev`)
- [ ] Questions reviewed
- [ ] Mobile tested
- [ ] Timer working
- [ ] Results accurate

## 🎓 For PMS Aspirants

This application provides:
- Real exam environment
- Timed practice
- Negative marking simulation
- Performance analytics
- Category-wise breakdown

Perfect for PMS Punjab exam preparation!

## 📞 Support

If you encounter issues:
1. Check Node.js version: `node --version`
2. Clear cache: `rm -rf .next node_modules`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

---

**Ready to deploy after Node.js upgrade!** 🚀

Good luck with your PMS preparation! 🎓



