import fs from 'fs/promises';
import path from 'path';

export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  createdAt: string;
};

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const USERS_KEY = 'pmsgk:users';

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

async function readUsersFromRedis(): Promise<User[]> {
  if (!isRedisEnvironment()) return [];
  
  try {
    // Try Vercel KV first
    const kv = await getKVClient();
    if (kv) {
      const users = await kv.get(USERS_KEY) as User[] | null;
      return users || [];
    }
    
    // Try standard Redis
    const redis = await getStandardRedisClient();
    if (redis) {
      const data = await redis.get(USERS_KEY);
      if (!data) return [];
      return JSON.parse(data) as User[];
    }
    
    return [];
  } catch (error) {
    console.error('Error reading users from Redis:', error);
    return [];
  }
}

async function writeUsersToRedis(users: User[]): Promise<void> {
  if (!isRedisEnvironment()) {
    throw new Error('Redis environment not configured');
  }
  
  try {
    // Try Vercel KV first
    const kv = await getKVClient();
    if (kv) {
      await kv.set(USERS_KEY, users);
      return;
    }
    
    // Try standard Redis
    const redis = await getStandardRedisClient();
    if (redis) {
      await redis.set(USERS_KEY, JSON.stringify(users));
      return;
    }
    
    throw new Error('No Redis client available');
  } catch (error) {
    console.error('Error writing users to Redis:', error);
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
  if (isRedisEnvironment()) {
    return readUsersFromRedis();
  }
  return readUsersFromFile();
}

export async function writeUsers(users: User[]): Promise<void> {
  if (isRedisEnvironment()) {
    await writeUsersToRedis(users);
  } else {
    await writeUsersToFile(users);
  }
}

