const fs = require('fs');
const path = require('path');

function parseQuizFile(filePath, category, quizId) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const questions = [];
  let i = 0;
  let questionNum = 0;

  // Skip header lines
  while (i < lines.length && (lines[i].includes('Google') || lines[i].includes('Email') || 
         lines[i].includes('Switch') || lines[i].includes('Indicates') || 
         lines[i] === '*' || lines[i].includes('Time Allowed') ||
         (!/^\d+\./.test(lines[i]) && lines[i].includes('Test')))) {
    i++;
  }

  while (i < lines.length && questions.length < 100) {
    // Find question line: "1. Question text" or "1.Question text"
    const qMatch = lines[i].match(/^(\d+)\.\s*(.+)$/);
    if (qMatch) {
      questionNum = parseInt(qMatch[1]);
      if (questionNum > 100) break; // Only parse first 100 questions
      
      const questionText = qMatch[2];
      i++;
      
      // Skip "1 point" or "0 points" line
      if (i < lines.length && lines[i].match(/^\d+\s*point/i)) {
        i++;
      }
      
      // Read 4 options
      const options = [];
      let optIndex = 0;
      while (optIndex < 4 && i < lines.length) {
        const line = lines[i];
        
        // Stop if we hit next question (but only if we already have some options)
        if (line.match(/^\d+\./)) {
          if (optIndex > 0) break; // Only break if we've started collecting options
        }
        
        // Stop if we hit footer text (after question 100)
        if (line.includes('copy of your responses') || 
            line.includes('This content is neither') ||
            line.includes('Google Forms')) {
          if (questionNum >= 100 && optIndex === 0) break;
        }
        
        // Skip metadata lines but don't break
        if (line.includes('Terms of Service') || 
            line.includes('Privacy Policy') || 
            line.includes('suspicious') ||
            line.includes('Report') || 
            line.includes('Contact form owner') ||
            (line.match(/^\d+\s*point/i) && optIndex === 0)) {
          i++;
          continue;
        }
        
        if (line.length > 0 && !line.match(/^\d+\./)) {
          options.push({
            id: `${quizId}_q${questionNum}opt${optIndex}`,
            text: line,
            isCorrect: optIndex === 0, // Default: first option is correct - NEEDS UPDATE
          });
          optIndex++;
        }
        i++;
      }
      
      // Ensure we have 4 options
      while (options.length < 4) {
        options.push({
          id: `${quizId}_q${questionNum}opt${options.length}`,
          text: 'None',
          isCorrect: false,
        });
      }
      
      if (questionText && options.length === 4) {
        questions.push({
          id: `${quizId}_q${questionNum}`,
          questionNumber: questionNum,
          category: category,
          question: questionText,
          options: options,
        });
      }
      
      // If we just processed question 100, stop
      if (questionNum >= 100) break;
    } else {
      i++;
    }
  }

  return questions;
}

// File mappings
const mappings = [
  { file: 'Past Paper 2021', category: 'Past Papers', quizId: 'pastPaper2021', varName: 'pastPaper2021Questions' },
  { file: 'geogrpahy Test', category: 'Geography', quizId: 'geographyTest', varName: 'geographyTestQuestions' },
  { file: 'GEneral Science and computer test', category: 'Science & Technology', quizId: 'generalScienceComputerTest', varName: 'generalScienceComputerTestQuestions' },
  { file: 'Current Affairs', category: 'Current Affairs', quizId: 'currentAffairsTest', varName: 'currentAffairsTestQuestions' },
  { file: 'Pakistan Studies', category: 'Pakistan Studies', quizId: 'pakistanStudiesTest', varName: 'pakistanStudiesTestQuestions' },
  { file: 'islamiat Test', category: 'Islamic Studies', quizId: 'islamiatTest', varName: 'islamiatTestQuestions' },
];

const extraDir = path.join(__dirname, '..', 'Extra Material');
const dataDir = path.join(__dirname, '..', 'data');

mappings.forEach(({ file, category, quizId, varName }) => {
  const filePath = path.join(extraDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  try {
    const questions = parseQuizFile(filePath, category, quizId);
    console.log(`✓ Parsed ${questions.length} questions from ${file}`);

    // Generate TypeScript file with proper syntax
    const formatQuestion = (q) => {
      const opts = q.options.map(opt => {
        // Use JSON.stringify to properly escape quotes and special characters
        return `      {\n        id: '${opt.id}',\n        text: ${JSON.stringify(opt.text)},\n        isCorrect: ${opt.isCorrect}\n      }`;
      }).join(',\n');
      return `  {\n    id: '${q.id}',\n    questionNumber: ${q.questionNumber},\n    category: ${JSON.stringify(q.category)},\n    question: ${JSON.stringify(q.question)},\n    options: [\n${opts}\n    ],\n  }`;
    };

    const questionsStr = questions.map(formatQuestion).join(',\n');
    const tsContent = `import { MCQuestion } from '@/types/exam';

export const ${varName}: MCQuestion[] = [\n${questionsStr}\n];
`;

    const outputFile = path.join(dataDir, `${quizId}.ts`);
    fs.writeFileSync(outputFile, tsContent, 'utf-8');
    console.log(`  → Created ${outputFile}\n`);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

console.log('✅ All files processed!');
console.log('⚠️  IMPORTANT: Correct answers are set to first option by default.');
console.log('   Please review and update correct answers in each file.');

