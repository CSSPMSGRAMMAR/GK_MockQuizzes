import fs from 'fs/promises';
import path from 'path';

export type QuizUser = {
  username: string;
  password: string;
};

const QUIZ_USERS_FILE = path.join(process.cwd(), 'data', 'quiz-users.json');
const QUIZ_USERS_KEY = 'pmsgk:quiz-users';

// Default admin credentials (can be overridden via env)
export const ADMIN_USERNAME = process.env.QUIZ_ADMIN_USERNAME || 'NimraG';
const DEFAULT_ADMIN_PASSWORD = 'Nimra1014';

export function validateAdminCredentials(username: string, password: string): boolean {
  const adminPassword = process.env.QUIZ_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return username === ADMIN_USERNAME && password === adminPassword;
}

// Check if we're in a production environment with Redis
function isRedisEnvironment(): boolean {
  return !!(process.env.REDIS_URL || (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN));
}

// Cached Redis clients
let kvClient: any = null;
let redisClient: any = null;
let redisClientPromise: Promise<any> | null = null;

// Get Vercel KV client (cached)
async function getKVClient(): Promise<any> {
  if (kvClient) return kvClient;
  
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const kvModule = await import('@vercel/kv');
      kvClient = kvModule.kv;
      return kvClient;
    } catch {
      return null;
    }
  }
  return null;
}

// Get standard Redis client (cached, with connection reuse)
async function getStandardRedisClient(): Promise<any> {
  if (redisClient) return redisClient;
  
  if (redisClientPromise) {
    return redisClientPromise;
  }
  
  if (process.env.REDIS_URL) {
    redisClientPromise = (async () => {
      try {
        const { createClient } = await import('redis');
        const client = createClient({ 
          url: process.env.REDIS_URL,
          socket: {
            reconnectStrategy: (retries) => {
              if (retries > 10) {
                return new Error('Too many reconnection attempts');
              }
              return Math.min(retries * 100, 3000);
            }
          }
        });
        
        client.on('error', (err) => console.error('Redis Client Error:', err));
        
        if (!client.isOpen) {
          await client.connect();
        }
        
        redisClient = client;
        return redisClient;
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
        redisClientPromise = null;
        return null;
      }
    })();
    
    return redisClientPromise;
  }
  
  return null;
}

async function readQuizUsersFromRedis(): Promise<QuizUser[]> {
  if (!isRedisEnvironment()) return [];
  
  try {
    // Try Vercel KV first
    const kv = await getKVClient();
    if (kv) {
      const users = await kv.get(QUIZ_USERS_KEY) as QuizUser[] | null;
      return users || [];
    }
    
    // Try standard Redis
    const redis = await getStandardRedisClient();
    if (redis) {
      const data = await redis.get(QUIZ_USERS_KEY);
      if (!data) return [];
      return JSON.parse(data) as QuizUser[];
    }
    
    return [];
  } catch (error) {
    console.error('Error reading from Redis:', error);
    return [];
  }
}

async function writeQuizUsersToRedis(users: QuizUser[]): Promise<void> {
  if (!isRedisEnvironment()) {
    throw new Error('Redis environment not configured');
  }
  
  try {
    // Try Vercel KV first
    const kv = await getKVClient();
    if (kv) {
      await kv.set(QUIZ_USERS_KEY, users);
      return;
    }
    
    // Try standard Redis
    const redis = await getStandardRedisClient();
    if (redis) {
      await redis.set(QUIZ_USERS_KEY, JSON.stringify(users));
      return;
    }
    
    throw new Error('No Redis client available');
  } catch (error) {
    console.error('Error writing to Redis:', error);
    throw error;
  }
}

// File storage (for local development)
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

// Unified storage functions
async function readQuizUsers(): Promise<QuizUser[]> {
  if (isRedisEnvironment()) {
    return readQuizUsersFromRedis();
  }
  return readQuizUsersFromFile();
}

async function writeQuizUsers(users: QuizUser[]): Promise<void> {
  if (isRedisEnvironment()) {
    await writeQuizUsersToRedis(users);
  } else {
    await writeQuizUsersToFile(users);
  }
}

export async function getQuizUsers(): Promise<QuizUser[]> {
  return readQuizUsers();
}

export async function addQuizUser(username: string, password: string): Promise<QuizUser> {
  const users = await readQuizUsers();
  const existing = users.find((u) => u.username === username);
  if (existing) {
    throw new Error('User with this username already exists');
  }

  const newUser: QuizUser = { username, password };
  const updated = [...users, newUser];
  await writeQuizUsers(updated);
  return newUser;
}

export async function validateQuizUser(username: string, password: string): Promise<boolean> {
  // Allow admin credentials as valid quiz access as well
  if (validateAdminCredentials(username, password)) {
    return true;
  }

  const users = await readQuizUsers();
  return users.some((u) => u.username === username && u.password === password);
}

