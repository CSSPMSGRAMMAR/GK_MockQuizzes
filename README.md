# PMS GK Quiz - Standalone Next.js Application

A professional, standalone PMS (Provincial Management Service) Punjab General Knowledge online test platform built with Next.js 16, TypeScript, and Tailwind CSS.

## 🎯 Features

- ✅ **100 MCQ Questions** - Comprehensive PMS GK coverage
- ✅ **Timed Exam** - 2-hour duration with live countdown
- ✅ **Negative Marking** - -0.25 marks for wrong answers
- ✅ **Question Navigation** - Visual palette with status indicators
- ✅ **Mark for Review** - Flag questions to revisit
- ✅ **Auto-Save** - Progress saved to localStorage
- ✅ **Auto-Submit** - Exam submits when time expires
- ✅ **Detailed Results** - Category-wise performance analytics
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **No Backend Required** - Fully client-side application

## 🚀 Quick Start

### Prerequisites
- Node.js 20.9.0 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Navigate to the project directory
cd pms-gk-quiz-standalone

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
pms-gk-quiz-standalone/
├── app/
│   ├── page.tsx              # Home/Instructions page
│   ├── exam/
│   │   └── page.tsx          # Exam interface
│   ├── result/
│   │   └── page.tsx          # Results page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── exam/
│   │   ├── ExamTimer.tsx     # Timer component
│   │   ├── QuestionCard.tsx  # Question display
│   │   └── QuestionNavigator.tsx # Question palette
│   └── ui/                   # UI components
├── stores/
│   └── examStore.ts          # Zustand state management
├── data/
│   └── pms-gk-mcqs.ts        # 100 MCQ questions
├── types/
│   └── exam.ts               # TypeScript interfaces
└── lib/
    └── utils.ts              # Utility functions
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

## 📊 Question Categories

- General Knowledge (20)
- Pakistan Affairs (20)
- International Relations (10)
- Geography (15)
- Science (10)
- Computer/IT (10)
- Mathematics (5)
- History (5)
- Economy (5)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Persistence**: LocalStorage

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/` | Instructions and exam start page |
| `/exam` | Live exam interface |
| `/result` | Results and detailed analytics |

## 🔧 Configuration

Edit exam settings in `stores/examStore.ts`:

```typescript
const defaultConfig: ExamConfig = {
  id: 'pms-gk-2026',
  title: 'PMS Punjab General Knowledge Test 2026',
  totalQuestions: 100,
  totalMarks: 100,
  durationMinutes: 120,
  negativeMarking: 0.25,
  passingPercentage: 50,
};
```

## 📝 Adding Questions

Add new questions in `data/pms-gk-mcqs.ts`:

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

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy dist folder to Netlify
```

### Other Platforms

The app can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- GitHub Pages (with static export)
- Any Node.js hosting

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
theme: {
  extend: {
    colors: {
      // Add your custom colors
    }
  }
}
```

### Branding

Update metadata in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Title",
  description: "Your Description",
};
```

## 📄 License

This project is part of the PMS GK preparation platform.

## 🙏 Acknowledgments

- Built for PMS aspirants in Punjab
- Questions curated from official PMS syllabus
- UI inspired by competitive exam platforms

## 📞 Support

For issues or questions:
- Check the documentation
- Review code comments
- Contact: [Your Contact Info]

---

**Built with ❤️ for PMS Aspirants**

Good luck with your preparation! 🎓
