# PMS GK Quiz - Quick Reference Card

## 🚀 Quick Start (3 Steps)

```bash
# 1. Upgrade Node.js to 20+ (if needed)
nvm install 20 && nvm use 20

# 2. Install & Run
cd pms-gk-quiz-standalone
npm install
npm run dev

# 3. Open browser
# Visit: http://localhost:3000
```

## 📦 What You Have

- ✅ 100 MCQ Questions (All categories)
- ✅ 2-hour timed exam
- ✅ Negative marking (-0.25)
- ✅ Full navigation & review
- ✅ Detailed results & analytics
- ✅ Mobile responsive
- ✅ Ready to deploy

## 🌐 Deploy in 1 Command

```bash
# Vercel (Easiest)
vercel

# Netlify
netlify deploy --prod

# Docker
docker build -t pms-gk-quiz . && docker run -p 3000:3000 pms-gk-quiz
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Instructions page |
| `app/exam/page.tsx` | Exam interface |
| `app/result/page.tsx` | Results page |
| `data/pms-gk-mcqs.ts` | All 100 questions |
| `stores/examStore.ts` | Exam logic & state |

## 🎯 Exam Specs

```
Questions:  100
Marks:      100
Time:       120 min
Negative:   -0.25
Passing:    50%
```

## 📝 Add Questions

```typescript
// Edit: data/pms-gk-mcqs.ts
{
  id: 'q101',
  questionNumber: 101,
  category: 'Category Name',
  question: 'Your question?',
  options: [
    { id: 'q101a', text: 'A', isCorrect: false },
    { id: 'q101b', text: 'B', isCorrect: true },
    { id: 'q101c', text: 'C', isCorrect: false },
    { id: 'q101d', text: 'D', isCorrect: false },
  ],
}
```

## 🔧 Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Clean install
rm -rf node_modules .next && npm install
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Node version error | `nvm install 20 && nvm use 20` |
| Build fails | `rm -rf .next node_modules && npm install` |
| Port in use | `PORT=3001 npm run dev` |
| Memory error | `NODE_OPTIONS="--max-old-space-size=4096" npm run build` |

## 📊 Question Categories

1. General Knowledge (20)
2. Pakistan Affairs (20)
3. International Relations (10)
4. Geography (15)
5. Science (10)
6. Computer/IT (10)
7. Math (5)
8. History (5)
9. Economy (5)

## 🎨 Quick Customization

```typescript
// Change exam duration
// stores/examStore.ts
durationMinutes: 120,  // Change this

// Change passing %
passingPercentage: 50,  // Change this

// Change negative marking
negativeMarking: 0.25,  // Change this
```

## 📱 Routes

- `/` → Instructions
- `/exam` → Live exam
- `/result` → Results

## ✅ Pre-Deploy Checklist

- [ ] Node.js 20+ installed
- [ ] `npm install` completed
- [ ] `npm run build` successful
- [ ] Tested locally
- [ ] Questions reviewed
- [ ] Mobile tested

## 🚀 Deploy to Vercel

```bash
# One-time setup
npm i -g vercel

# Deploy
vercel

# Done! 🎉
```

## 📚 Full Documentation

- `README.md` - Complete guide
- `DEPLOYMENT_GUIDE.md` - Deployment options
- `IMPORTANT_NOTES.md` - Setup & troubleshooting

## 💡 Pro Tips

1. **Test locally first**: `npm run dev`
2. **Build before deploy**: `npm run build`
3. **Use Vercel**: Easiest deployment
4. **Enable analytics**: Add Google Analytics
5. **Regular updates**: Keep dependencies updated

## 🎓 For Students

**Perfect for:**
- PMS exam preparation
- Timed practice tests
- Performance tracking
- Category-wise analysis
- Self-assessment

## 📞 Need Help?

1. Check `IMPORTANT_NOTES.md`
2. Review `DEPLOYMENT_GUIDE.md`
3. Read error messages carefully
4. Clear cache and rebuild

## ⚡ Performance

- Fast load times
- Smooth animations
- Responsive design
- Optimized bundle
- CDN-ready

## 🔒 Security

- Client-side only
- No sensitive data
- HTTPS recommended
- Regular updates needed

---

## 🎯 Bottom Line

**You have a complete, production-ready PMS GK quiz application!**

**To deploy:**
1. Upgrade Node.js to 20+
2. Run `npm install`
3. Run `vercel`
4. Done! 🚀

**Good luck!** 🎓



