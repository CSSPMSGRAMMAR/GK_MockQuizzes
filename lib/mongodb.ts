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
    } catch (error) {
      // Connection is dead, reset cache
      console.warn('Cached MongoDB connection is dead, creating new connection:', error);
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Clean up connection string - ensure it ends properly
  let connectionString = MONGODB_URI.trim();
  
  if (!connectionString) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  
  // Remove trailing slash if present (before query params)
  if (connectionString.endsWith('/') && !connectionString.includes('?')) {
    connectionString = connectionString.slice(0, -1);
  }

  // Create new connection with optimized settings for serverless/Vercel
  const client = new MongoClient(connectionString, {
    maxPoolSize: 1, // Smaller pool for serverless
    minPoolSize: 0, // Allow pool to shrink
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    // Optimize for serverless environments
    maxIdleTimeMS: 30000,
    // Let MongoDB handle TLS automatically for mongodb+srv://
  });

  try {
    await client.connect();
    
    // Verify connection with a simple ping
    await client.db('admin').command({ ping: 1 });
    
    const db = client.db(MONGODB_DB);
    
    // Cache the connection (only in non-serverless environments)
    // In Vercel serverless, each function invocation may be isolated
    // so caching might not persist, but it's still worth trying
    cachedClient = client;
    cachedDb = db;
    
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    const maskedUri = MONGODB_URI.replace(/:[^:@]+@/, ':****@');
    console.error('Connection string (masked):', maskedUri);
    console.error('MongoDB connection error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
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

