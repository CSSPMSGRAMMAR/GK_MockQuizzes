import { connectToDatabase } from './mongodb';

export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  createdAt: string;
  // Attempt tracking
  totalAttempts: number;
  quizAttempts: Record<string, number>; // quizId -> attempt count
  lastAttemptAt?: string; // ISO timestamp of last quiz submission
};

const USERS_COLLECTION = 'users';

// Read all users from MongoDB
export async function readUsers(): Promise<User[]> {
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

// Write all users to MongoDB (replaces all existing users)
export async function writeUsers(users: User[]): Promise<void> {
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

// Add a new user to MongoDB
export async function addUser(user: User): Promise<User> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<User>(USERS_COLLECTION);
    
    // Check if user exists
    const existing = await collection.findOne({ username: user.username });
    if (existing) {
      throw new Error('Username already exists');
    }
    
    // Initialize attempt tracking for new user
    const newUser: User = {
      ...user,
      totalAttempts: user.totalAttempts || 0,
      quizAttempts: user.quizAttempts || {},
    };
    
    // Insert new user
    await collection.insertOne(newUser);
    return newUser;
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error;
    }
    console.error('Error adding user to MongoDB:', error);
    throw error;
  }
}

// Delete a user from MongoDB
export async function deleteUser(id: string): Promise<void> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<User>(USERS_COLLECTION);
    await collection.deleteOne({ id });
  } catch (error) {
    console.error('Error deleting user from MongoDB:', error);
    throw error;
  }
}

// Record a quiz attempt for a user
export async function recordQuizAttempt(userId: string, quizId: string): Promise<void> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<User>(USERS_COLLECTION);
    
    const user = await collection.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    
    // Initialize attempt tracking if not present
    const totalAttempts = (user.totalAttempts || 0) + 1;
    const quizAttempts = user.quizAttempts || {};
    quizAttempts[quizId] = (quizAttempts[quizId] || 0) + 1;
    
    await collection.updateOne(
      { id: userId },
      {
        $set: {
          totalAttempts,
          quizAttempts,
          lastAttemptAt: new Date().toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Error recording quiz attempt in MongoDB:', error);
    throw error;
  }
}

