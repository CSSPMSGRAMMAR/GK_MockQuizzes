import fs from 'fs/promises';
import path from 'path';

export type QuizUser = {
  username: string;
  password: string;
};

const QUIZ_USERS_FILE = path.join(process.cwd(), 'data', 'quiz-users.json');

// Default admin credentials (can be overridden via env)
export const ADMIN_USERNAME = process.env.QUIZ_ADMIN_USERNAME || 'NimraG';
const DEFAULT_ADMIN_PASSWORD = 'Nimra1014';

export function validateAdminCredentials(username: string, password: string): boolean {
  const adminPassword = process.env.QUIZ_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return username === ADMIN_USERNAME && password === adminPassword;
}

async function readQuizUsersFromFile(): Promise<QuizUser[]> {
  try {
    const raw = await fs.readFile(QUIZ_USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed as QuizUser[];
    }

    if (Array.isArray(parsed.users)) {
      return parsed.users as QuizUser[];
    }

    return [];
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      // File does not exist yet
      return [];
    }
    throw error;
  }
}

async function writeQuizUsersToFile(users: QuizUser[]): Promise<void> {
  await fs.mkdir(path.dirname(QUIZ_USERS_FILE), { recursive: true });
  const payload = JSON.stringify({ users }, null, 2);
  await fs.writeFile(QUIZ_USERS_FILE, payload, 'utf8');
}

export async function getQuizUsers(): Promise<QuizUser[]> {
  return readQuizUsersFromFile();
}

export async function addQuizUser(username: string, password: string): Promise<QuizUser> {
  const users = await readQuizUsersFromFile();
  const existing = users.find((u) => u.username === username);
  if (existing) {
    throw new Error('User with this username already exists');
  }

  const newUser: QuizUser = { username, password };
  const updated = [...users, newUser];
  await writeQuizUsersToFile(updated);
  return newUser;
}

export async function validateQuizUser(username: string, password: string): Promise<boolean> {
  // Allow admin credentials as valid quiz access as well
  if (validateAdminCredentials(username, password)) {
    return true;
  }

  const users = await readQuizUsersFromFile();
  return users.some((u) => u.username === username && u.password === password);
}

