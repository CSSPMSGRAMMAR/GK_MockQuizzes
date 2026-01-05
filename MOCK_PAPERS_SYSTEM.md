# Mock Papers System - Multiple Quizzes

## Overview

The system now supports multiple mock papers/quizzes. Users can select which mock test they want to attempt after logging in.

## 🎯 User Flow

1. **Login** → `/login`
2. **Select Mock Paper** → `/quizzes` (NEW!)
3. **View Instructions** → `/quiz/[quizId]`
4. **Take Exam** → `/exam?quiz=[quizId]`
5. **View Results** → `/result?quiz=[quizId]`

## 📁 Quiz Configuration

Quizzes are stored in: `data/quizzes.json`

Example structure:
```json
[
  {
    "id": "pms-gk-mock-1",
    "title": "PMS GK Mock Paper 1",
    "description": "First mock test for PMS General Knowledge preparation",
    "totalQuestions": 100,
    "totalMarks": 100,
    "durationMinutes": 120,
    "negativeMarking": 0.25,
    "passingPercentage": 50,
    "available": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🛣️ Routes

### New Routes
- `/quizzes` - Quiz selection page (shows all available mock papers)
- `/quiz/[quizId]` - Instructions page for specific quiz
- `/exam?quiz=[quizId]` - Exam interface (with quiz ID)
- `/result?quiz=[quizId]` - Results page (with quiz ID)

### Updated Routes
- `/login` - Now redirects to `/quizzes` after login
- `/` - Now redirects to `/quizzes` if logged in

## 🎨 Features

### Quiz Selection Page (`/quizzes`)
- ✅ Shows all available mock papers
- ✅ Beautiful card-based layout
- ✅ Quiz details (questions, marks, duration, negative marking)
- ✅ One-click start button
- ✅ User welcome message
- ✅ Logout functionality

### Quiz Instructions Page (`/quiz/[quizId]`)
- ✅ Dynamic quiz configuration
- ✅ Quiz-specific instructions
- ✅ Back to quiz selection
- ✅ Start exam button

### Exam Page
- ✅ Shows selected quiz title in header
- ✅ Quiz ID tracked via URL parameter
- ✅ All exam features work as before

### Results Page
- ✅ Quiz ID tracked
- ✅ "Back to Mock Papers" button
- ✅ Retake redirects to same quiz

## 🔧 Adding New Mock Papers

To add a new mock paper:

1. Edit `data/quizzes.json`
2. Add a new quiz object:
```json
{
  "id": "pms-gk-mock-4",
  "title": "PMS GK Mock Paper 4",
  "description": "Fourth mock test",
  "totalQuestions": 100,
  "totalMarks": 100,
  "durationMinutes": 120,
  "negativeMarking": 0.25,
  "passingPercentage": 50,
  "available": true,
  "createdAt": "2024-01-04T00:00:00.000Z"
}
```

3. The quiz will automatically appear on the selection page!

## 📊 Current Mock Papers

By default, 3 mock papers are configured:
- **Mock Paper 1** - `pms-gk-mock-1`
- **Mock Paper 2** - `pms-gk-mock-2`
- **Mock Paper 3** - `pms-gk-mock-3`

## 🔄 Quiz ID Tracking

The quiz ID is passed through the flow:
- Selected on `/quizzes` page
- Passed to `/quiz/[quizId]` instructions
- Passed to `/exam?quiz=[quizId]` exam
- Passed to `/result?quiz=[quizId]` results

This allows:
- Tracking which mock paper was attempted
- Future: Different question sets per quiz
- Future: Per-quiz analytics
- Future: Per-quiz results history

## 🎯 Future Enhancements

Potential improvements:
- [ ] Different question sets per mock paper
- [ ] Per-quiz attempt history
- [ ] Quiz-specific analytics
- [ ] Admin can create/edit quizzes via GUI
- [ ] Quiz availability dates
- [ ] Quiz categories/tags
- [ ] Quiz difficulty levels

## 📝 Notes

- Currently, all quizzes use the same 100 MCQs
- Quiz configuration is stored in JSON file
- Quiz ID is used for tracking and routing
- Each quiz can have different settings (duration, marks, etc.)

---

**Status:** ✅ Complete - Multiple mock papers system ready!

