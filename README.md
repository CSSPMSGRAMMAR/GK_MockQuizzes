# PMS GK Quiz - Standalone Next.js Application

## ✅ Exact Extraction from Main App

This is an **exact extraction** of the PMS GK quiz module from the main Course Craft application. 

**Everything is identical:**
- ✅ Same design and color scheme
- ✅ Same styling and components
- ✅ Same state management
- ✅ Same functionality
- ✅ Only adapted for Next.js routing

## 🎯 Features

- ✅ **100 MCQ Questions** - All questions from main app
- ✅ **Timed Exam** - 2-hour duration with live countdown
- ✅ **Negative Marking** - -0.25 marks for wrong answers
- ✅ **Question Navigation** - Visual palette with status indicators
- ✅ **Mark for Review** - Flag questions to revisit
- ✅ **Auto-Save** - Progress saved to localStorage
- ✅ **Auto-Submit** - Exam submits when time expires
- ✅ **Detailed Results** - Category-wise performance analytics
- ✅ **Mobile Responsive** - Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 20.9.0 or higher

### Installation

```bash
cd pms-gk-quiz-standalone
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
pms-gk-quiz-standalone/
├── app/
│   ├── page.tsx              # Instructions page (exact copy)
│   ├── exam/
│   │   └── page.tsx         # Exam interface (exact copy)
│   ├── result/
│   │   └── page.tsx         # Results page (exact copy)
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Exact CSS from main app
├── components/
│   ├── exam/                # Exam components (exact copies)
│   │   ├── ExamTimer.tsx
│   │   ├── QuestionCard.tsx
│   │   └── QuestionNavigator.tsx
│   └── ui/                  # UI components (exact copies)
├── stores/
│   └── examStore.ts         # Zustand store (exact copy)
├── data/
│   └── pms-gk-mcqs.ts      # 100 MCQ questions (exact copy)
├── types/
│   └── exam.ts              # TypeScript interfaces
└── lib/
    └── utils.ts             # Utility functions
```

## 🎓 Exam Specifications

```
Total Questions:     100
Total Marks:         100
Duration:           120 minutes (2 hours)
Negative Marking:   -0.25 per wrong answer
Passing Score:      50%

Marking Scheme:
✓ Correct:          +1 mark
✗ Wrong:            -0.25 marks
○ Unattempted:      0 marks
```

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/` | Instructions and exam start page |
| `/exam` | Live exam interface |
| `/result` | Results and detailed analytics |

## 🎨 Design System

**Exact match with main app:**
- Primary Color: Warm Orange (`hsl(28 84% 58%)`)
- Secondary Color: Calming Blue (`hsl(214 95% 93%)`)
- Accent Color: Success Green (`hsl(142 69% 58%)`)
- Fonts: Playfair Display, Inter, Crimson Text
- All gradients, shadows, and animations preserved

## 🔧 Configuration

All exam settings in `stores/examStore.ts` (unchanged from main app):
- Total questions: 100
- Duration: 120 minutes
- Negative marking: -0.25
- Passing: 50%

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Other Platforms

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📝 Notes

- This is an **exact extraction** - no design or styling changes
- Only routing adapted for Next.js (React Router → Next.js App Router)
- All components, state, and data are identical to main app
- Ready for independent deployment

## ✅ Verification

All components, pages, styling, and functionality match the main Course Craft application exactly.

---

**Built with ❤️ - Exact copy of main app's PMS GK module**
