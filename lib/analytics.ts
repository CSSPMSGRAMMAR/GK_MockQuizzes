import { connectToDatabase } from './mongodb';

const VISITS_COLLECTION = 'visits';
const FREE_QUIZ_ATTEMPTS_COLLECTION = 'free-quiz-attempts';
const STATS_COLLECTION = 'analytics-stats';

// Track a website visit
export async function trackVisit(): Promise<void> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(VISITS_COLLECTION);
    
    // Insert visit record with timestamp
    await collection.insertOne({
      timestamp: new Date(),
      createdAt: new Date().toISOString(),
    });
    
    // Update total visits counter atomically
    const statsCollection = db.collection(STATS_COLLECTION);
    await statsCollection.updateOne(
      { type: 'total-visits' },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error tracking visit:', error);
    // Don't throw - analytics shouldn't break the app
  }
}

// Get current active visitors (visits in last 15 minutes)
export async function getCurrentVisitors(): Promise<number> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(VISITS_COLLECTION);
    
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const count = await collection.countDocuments({
      timestamp: { $gte: fifteenMinutesAgo },
    });
    
    return count;
  } catch (error) {
    console.error('Error getting current visitors:', error);
    return 0;
  }
}

// Get total visits count
export async function getTotalVisits(): Promise<number> {
  try {
    const db = await connectToDatabase();
    const statsCollection = db.collection(STATS_COLLECTION);
    
    const stats = await statsCollection.findOne({ type: 'total-visits' });
    return stats?.count || 0;
  } catch (error) {
    console.error('Error getting total visits:', error);
    return 0;
  }
}

// Track a free quiz attempt
export async function trackFreeQuizAttempt(quizId: string): Promise<void> {
  try {
    const db = await connectToDatabase();
    const attemptsCollection = db.collection(FREE_QUIZ_ATTEMPTS_COLLECTION);
    
    // Insert attempt record
    await attemptsCollection.insertOne({
      quizId,
      timestamp: new Date(),
      createdAt: new Date().toISOString(),
    });
    
    // Update counters atomically
    const statsCollection = db.collection(STATS_COLLECTION);
    
    // Update total free quiz attempts
    await statsCollection.updateOne(
      { type: 'total-free-attempts' },
      { $inc: { count: 1 } },
      { upsert: true }
    );
    
    // Update per-quiz counter
    await statsCollection.updateOne(
      { type: 'quiz-attempts', quizId },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error tracking free quiz attempt:', error);
    // Don't throw - analytics shouldn't break the app
  }
}

// Get total free quiz attempts
export async function getTotalFreeQuizAttempts(): Promise<number> {
  try {
    const db = await connectToDatabase();
    const statsCollection = db.collection(STATS_COLLECTION);
    
    const stats = await statsCollection.findOne({ type: 'total-free-attempts' });
    return stats?.count || 0;
  } catch (error) {
    console.error('Error getting total free quiz attempts:', error);
    return 0;
  }
}

// Get free quiz attempts per quiz
export async function getFreeQuizAttemptsByQuiz(): Promise<Record<string, number>> {
  try {
    const db = await connectToDatabase();
    const statsCollection = db.collection(STATS_COLLECTION);
    
    const stats = await statsCollection.find({ type: 'quiz-attempts' }).toArray();
    const result: Record<string, number> = {};
    
    stats.forEach((stat: any) => {
      result[stat.quizId] = stat.count || 0;
    });
    
    return result;
  } catch (error) {
    console.error('Error getting free quiz attempts by quiz:', error);
    return {};
  }
}

// Get analytics summary for admin dashboard
export interface AnalyticsSummary {
  currentVisitors: number;
  totalVisits: number;
  totalFreeQuizAttempts: number;
  freeQuizAttemptsByQuiz: Record<string, number>;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const [currentVisitors, totalVisits, totalFreeAttempts, attemptsByQuiz] = await Promise.all([
      getCurrentVisitors(),
      getTotalVisits(),
      getTotalFreeQuizAttempts(),
      getFreeQuizAttemptsByQuiz(),
    ]);
    
    return {
      currentVisitors,
      totalVisits,
      totalFreeQuizAttempts: totalFreeAttempts,
      freeQuizAttemptsByQuiz: attemptsByQuiz,
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return {
      currentVisitors: 0,
      totalVisits: 0,
      totalFreeQuizAttempts: 0,
      freeQuizAttemptsByQuiz: {},
    };
  }
}

