import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://csspmsgrammar_db_user:0RvdCgtd8X3X7MjN@cluster0.eu370ti.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB = process.env.MONGODB_DB || 'pmsgk-quiz';

// Cache the database connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    try {
      // Test if connection is still alive (lightweight check)
      await cachedClient.db('admin').command({ ping: 1 });
      return cachedDb;
    } catch {
      // Connection is dead, reset cache
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Clean up connection string - ensure it ends properly
  let connectionString = MONGODB_URI.trim();
  
  // Remove trailing slash if present (before query params)
  if (connectionString.endsWith('/') && !connectionString.includes('?')) {
    connectionString = connectionString.slice(0, -1);
  }

  // Create new connection with optimized settings for serverless
  const client = new MongoClient(connectionString, {
    maxPoolSize: 1, // Smaller pool for serverless
    minPoolSize: 0, // Allow pool to shrink
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    // Let MongoDB handle TLS automatically for mongodb+srv://
  });

  try {
    await client.connect();
    
    // Verify connection with a simple ping
    await client.db('admin').command({ ping: 1 });
    
    const db = client.db(MONGODB_DB);
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.error('Connection string (masked):', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    
    // Don't cache failed connections
    cachedClient = null;
    cachedDb = null;
    throw error;
  }
}

// Helper to check if MongoDB is configured
export function isMongoDBEnvironment(): boolean {
  return !!MONGODB_URI && MONGODB_URI.trim() !== '';
}

