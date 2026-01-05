import fs from 'fs/promises';
import path from 'path';
import { connectToDatabase, isMongoDBEnvironment } from './mongodb';

export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  createdAt: string;
};

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const USERS_COLLECTION = 'users';

// MongoDB storage (for production)
async function readUsersFromMongoDB(): Promise<User[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<User>(USERS_COLLECTION);
    const users = await collection.find({}).toArray();
    return users;
  } catch (error) {
    console.error('Error reading users from MongoDB:', error);
    return [];
  }
}

async function writeUsersToMongoDB(users: User[]): Promise<void> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<User>(USERS_COLLECTION);
    
    // Clear existing users and insert all
    await collection.deleteMany({});
    if (users.length > 0) {
      await collection.insertMany(users);
    }
  } catch (error) {
    console.error('Error writing users to MongoDB:', error);
    throw error;
  }
}

async function addUserToMongoDB(user: User): Promise<User> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<User>(USERS_COLLECTION);
    
    // Check if user exists
    const existing = await collection.findOne({ username: user.username });
    if (existing) {
      throw new Error('Username already exists');
    }
    
    // Insert new user
    await collection.insertOne(user);
    return user;
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error;
    }
    console.error('Error adding user to MongoDB:', error);
    throw error;
  }
}

async function deleteUserFromMongoDB(id: string): Promise<void> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<User>(USERS_COLLECTION);
    await collection.deleteOne({ id });
  } catch (error) {
    console.error('Error deleting user from MongoDB:', error);
    throw error;
  }
}

// File storage (for local development)
async function readUsersFromFile(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(raw) as User[];
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading users from file:', error);
    return [];
  }
}

async function writeUsersToFile(users: User[]): Promise<void> {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Unified storage functions
export async function readUsers(): Promise<User[]> {
  if (isMongoDBEnvironment()) {
    return readUsersFromMongoDB();
  }
  return readUsersFromFile();
}

export async function writeUsers(users: User[]): Promise<void> {
  if (isMongoDBEnvironment()) {
    await writeUsersToMongoDB(users);
  } else {
    await writeUsersToFile(users);
  }
}

export async function addUser(user: User): Promise<User> {
  if (isMongoDBEnvironment()) {
    return addUserToMongoDB(user);
  }
  
  // File-based storage (local development)
  const users = await readUsersFromFile();
  if (users.some((u) => u.username === user.username)) {
    throw new Error('Username already exists');
  }
  users.push(user);
  await writeUsersToFile(users);
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  if (isMongoDBEnvironment()) {
    return deleteUserFromMongoDB(id);
  }
  
  // File-based storage (local development)
  const users = await readUsersFromFile();
  const filteredUsers = users.filter((u) => u.id !== id);
  await writeUsersToFile(filteredUsers);
}

