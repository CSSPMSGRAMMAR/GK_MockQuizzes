import * as fs from 'fs';
import * as path from 'path';

const extraMaterialDir = path.join(process.cwd(), 'Extra Material');
const dataDir = path.join(process.cwd(), 'data');

const fileMappings: { [key: string]: { tsName: string; quizId: string; title: string; category: string } } = {
  'Past Paper 2021': {
    tsName: 'subject-past-paper-2021',
    quizId: 'subject-past-paper-2021',
    title: 'Past Paper 2021',
    category: 'Past Papers',
  },
  'Current Affairs': {
    tsName: 'subject-current-affairs',
    quizId: 'subject-current-affairs',
    title: 'Current Affairs Test',
    category: 'Current Affairs',
  },
  'Pakistan Studies': {
    tsName: 'subject-pakistan-studies',
    quizId: 'subject-pakistan-studies',
    title: 'Pakistan Studies Test',
    category: 'Pakistan Studies',
  },
  'islamiat Test': {
    tsName: 'subject-islamiat',
    quizId: 'subject-islamiat',
    title: 'Islamiat Test',
    category: 'Islamic Studies',
  },
  'geogrpahy Test': {
    tsName: 'subject-geography',
    quizId: 'subject-geography',
    title: 'Geography Test',
    category: 'Geography',
  },
  'GEneral Science and computer test': {
    tsName: 'subject-general-science-computer',
    quizId: 'subject-general-science-computer',
    title: 'General Science and Computer Test',
    category: 'Science & Technology',
  },
};

function convertFile(fileName: string) {
  const mapping = fileMappings[fileName];
  if (!mapping) {
    console.log(`Skipping ${fileName} - no mapping found`);
    return;
  }

  const filePath = path.join(extraMaterialDir, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions = JSON.parse(content);

  // Fix option IDs to match the expected format
  const fixedQuestions = questions.map((q: any, index: number) => {
    const fixedOptions = q.options.map((opt: any, optIndex: number) => ({
      id: `${q.id}opt${optIndex}`,
      text: opt.text,
      isCorrect: opt.isCorrect,
    }));

    return {
      ...q,
      options: fixedOptions,
    };
  });

  const tsContent = `import { MCQuestion } from '@/types/exam';

export const ${mapping.tsName.replace(/-/g, '')}: MCQuestion[] = ${JSON.stringify(fixedQuestions, null, 2)};
`;

  const outputPath = path.join(dataDir, `${mapping.tsName}.ts`);
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  console.log(`✓ Created ${outputPath} with ${fixedQuestions.length} questions`);
}

// Convert all files
Object.keys(fileMappings).forEach((fileName) => {
  try {
    convertFile(fileName);
  } catch (error) {
    console.error(`Error converting ${fileName}:`, error);
  }
});

console.log('\n✅ All files converted successfully!');

