import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ParsedQuestion {
  id: string;
  questionNumber: number;
  category: string;
  question: string;
  options: Array<{ id: string; text: string; isCorrect: boolean }>;
  explanation?: string;
}

function parseExtraMaterialFile(filePath: string, category: string, quizId: string): ParsedQuestion[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const questions: ParsedQuestion[] = [];
  let currentQuestion: Partial<ParsedQuestion> | null = null;
  let optionIndex = 0;
  let questionNumber = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip header lines
    if (i < 10 || line.includes('Google Forms') || line.includes('Terms of Service') || 
        line.includes('Privacy Policy') || line.includes('Switch account') ||
        line.includes('Record ') || line.includes('Email') || line === '*' ||
        line.includes('Indicates required') || line.includes('Time Allowed') ||
        line.includes('Test (PMS)') || line.includes('Test') && !line.match(/^\d+\./)) {
      continue;
    }

    // Match question number pattern: "1. Question text" or "1.Question text"
    const questionMatch = line.match(/^(\d+)\.\s*(.+)$/);
    if (questionMatch) {
      // Save previous question if exists
      if (currentQuestion && currentQuestion.question) {
        // Ensure we have 4 options
        while ((currentQuestion.options?.length || 0) < 4) {
          currentQuestion.options?.push({
            id: `${currentQuestion.id}opt${currentQuestion.options.length}`,
            text: 'None',
            isCorrect: false,
          });
        }
        questions.push(currentQuestion as ParsedQuestion);
      }

      questionNumber = parseInt(questionMatch[1]);
      optionIndex = 0;
      currentQuestion = {
        id: `${quizId}_q${questionNumber}`,
        questionNumber: questionNumber,
        category: category,
        question: questionMatch[2].trim(),
        options: [],
      };
      continue;
    }

    // Skip "1 point" or "0 points" lines
    if (line.match(/^\d+\s*point/i)) {
      continue;
    }

    // Options: lines that don't match question pattern and aren't metadata
    if (currentQuestion && !line.match(/^(\d+)\./) && 
        !line.match(/point/i) && 
        line.length > 0 &&
        !line.includes('Google') && 
        !line.includes('Terms') &&
        !line.includes('Privacy') &&
        !line.includes('suspicious') &&
        !line.includes('Report')) {
      
      // Check if this looks like an option (not a question)
      if (optionIndex < 4 && currentQuestion.question) {
        const optionId = `${currentQuestion.id}opt${optionIndex}`;
        // Set first option as correct by default (can be updated later)
        currentQuestion.options?.push({
          id: optionId,
          text: line,
          isCorrect: optionIndex === 0, // First option as default correct
        });
        optionIndex++;
      }
    }
  }

  // Save last question
  if (currentQuestion && currentQuestion.question) {
    while ((currentQuestion.options?.length || 0) < 4) {
      currentQuestion.options?.push({
        id: `${currentQuestion.id}opt${currentQuestion.options.length}`,
        text: 'None',
        isCorrect: false,
      });
    }
    questions.push(currentQuestion as ParsedQuestion);
  }

  return questions;
}

// Map file names to categories and quiz IDs
const fileMappings = [
  { file: 'Past Paper 2021', category: 'Past Papers', quizId: 'past-paper-2021' },
  { file: 'geogrpahy Test', category: 'Geography', quizId: 'geography-test' },
  { file: 'GEneral Science and computer test', category: 'Science & Technology', quizId: 'general-science-computer-test' },
  { file: 'Current Affairs', category: 'Current Affairs', quizId: 'current-affairs-test' },
  { file: 'Pakistan Studies', category: 'Pakistan Studies', quizId: 'pakistan-studies-test' },
  { file: 'islamiat Test', category: 'Islamic Studies', quizId: 'islamiat-test' },
];

const extraMaterialDir = join(process.cwd(), 'Extra Material');
const dataDir = join(process.cwd(), 'data');

fileMappings.forEach(({ file, category, quizId }) => {
  const filePath = join(extraMaterialDir, file);
  try {
    const questions = parseExtraMaterialFile(filePath, category, quizId);
    
    // Generate TypeScript file content
    const tsContent = `import { MCQuestion } from '@/types/exam';

export const ${quizId.replace(/-/g, '')
  .replace(/([A-Z])/g, ' $1')
  .replace(/^./, str => str.toLowerCase())
  .replace(/\s+/g, '')
  .replace(/^./, str => str.toUpperCase())}Questions: MCQuestion[] = ${JSON.stringify(questions, null, 2)
  .replace(/"id":/g, 'id:')
  .replace(/"questionNumber":/g, 'questionNumber:')
  .replace(/"category":/g, 'category:')
  .replace(/"question":/g, 'question:')
  .replace(/"options":/g, 'options:')
  .replace(/"text":/g, 'text:')
  .replace(/"isCorrect":/g, 'isCorrect:')
  .replace(/"explanation":/g, 'explanation:')};
`;

    const outputFile = join(dataDir, `${quizId}.ts`);
    writeFileSync(outputFile, tsContent, 'utf-8');
    console.log(`✓ Parsed ${questions.length} questions from ${file} -> ${outputFile}`);
  } catch (error) {
    console.error(`✗ Error parsing ${file}:`, error);
  }
});

console.log('\n✅ Parsing complete!');
console.log('⚠️  Note: Correct answers are set to first option by default. Please update them manually.');

