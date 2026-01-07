import { connectToDatabase } from './mongodb';

export type QuizUser = {
  username: string;
  password: string;
};

const QUIZ_USERS_COLLECTION = 'quiz-users';

// Default admin credentials (can be overridden via env)
export const ADMIN_USERNAME = process.env.QUIZ_ADMIN_USERNAME || 'NimraG';
const DEFAULT_ADMIN_PASSWORD = 'Nimra1014';

export function validateAdminCredentials(username: string, password: string): boolean {
  const adminPassword = process.env.QUIZ_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return username === ADMIN_USERNAME && password === adminPassword;
}

// Read all quiz users from MongoDB
async function readQuizUsers(): Promise<QuizUser[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<QuizUser>(QUIZ_USERS_COLLECTION);
    const users = await collection.find({}).toArray();
    return users;
  } catch (error) {
    console.error('Error reading quiz users from MongoDB:', error);
    return [];
  }
}

// Add a new quiz user to MongoDB
async function addQuizUserToMongoDB(username: string, password: string): Promise<QuizUser> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<QuizUser>(QUIZ_USERS_COLLECTION);
    
    // Check if user exists
    const existing = await collection.findOne({ username });
    if (existing) {
      throw new Error('User with this username already exists');
    }
    
    // Insert new user
    const newUser: QuizUser = { username, password };
    await collection.insertOne(newUser);
    return newUser;
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error;
    }
    console.error('Error adding quiz user to MongoDB:', error);
    throw error;
  }
}

export async function getQuizUsers(): Promise<QuizUser[]> {
  return readQuizUsers();
}

export async function addQuizUser(username: string, password: string): Promise<QuizUser> {
  return addQuizUserToMongoDB(username, password);
}

export async function validateQuizUser(username: string, password: string): Promise<boolean> {
  // Allow admin credentials as valid quiz access as well
  if (validateAdminCredentials(username, password)) {
    return true;
  }

  const users = await readQuizUsers();
  return users.some((u) => u.username === username && u.password === password);
}

