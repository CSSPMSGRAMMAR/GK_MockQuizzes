import { connectToDatabase } from './mongodb';

const ANNOUNCEMENTS_COLLECTION = 'announcements';

export interface Announcement {
  id: string;
  title: string;
  content: string; // Can contain HTML/links
  isActive: boolean;
  priority: 'high' | 'medium' | 'low'; // high = prominent banner, medium = normal, low = subtle
  hideOtherContent: boolean; // If true, hides main content until dismissed
  createdAt: string;
  updatedAt: string;
  expiresAt?: string; // Optional expiration date
  linkUrl?: string; // Optional link URL
  linkText?: string; // Optional link text
}

// Get active announcements (sorted by priority and date)
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(ANNOUNCEMENTS_COLLECTION);

    const now = new Date().toISOString();
    
    const announcements = await collection
      .find({
        isActive: true,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gte: now } },
        ],
      })
      .sort({ priority: -1, createdAt: -1 }) // high priority first, then newest
      .toArray();

    return announcements.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      isActive: doc.isActive,
      priority: doc.priority || 'medium',
      hideOtherContent: doc.hideOtherContent || false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      expiresAt: doc.expiresAt,
      linkUrl: doc.linkUrl,
      linkText: doc.linkText,
    }));
  } catch (error) {
    console.error('Error getting active announcements:', error);
    return [];
  }
}

// Get all announcements (for admin)
export async function getAllAnnouncements(): Promise<Announcement[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(ANNOUNCEMENTS_COLLECTION);

    const announcements = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return announcements.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      isActive: doc.isActive,
      priority: doc.priority || 'medium',
      hideOtherContent: doc.hideOtherContent || false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      expiresAt: doc.expiresAt,
      linkUrl: doc.linkUrl,
      linkText: doc.linkText,
    }));
  } catch (error) {
    console.error('Error getting all announcements:', error);
    return [];
  }
}

// Create a new announcement
export async function createAnnouncement(
  announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Announcement> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(ANNOUNCEMENTS_COLLECTION);

    const now = new Date().toISOString();
    const newAnnouncement = {
      ...announcement,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newAnnouncement);

    return {
      id: result.insertedId.toString(),
      ...newAnnouncement,
    };
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
}

// Update an announcement
export async function updateAnnouncement(
  id: string,
  updates: Partial<Omit<Announcement, 'id' | 'createdAt'>> & { updatedAt?: string }
): Promise<Announcement | null> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(ANNOUNCEMENTS_COLLECTION);

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: id as any },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return null;
    }

    return {
      id: result._id.toString(),
      title: result.title,
      content: result.content,
      isActive: result.isActive,
      priority: result.priority || 'medium',
      hideOtherContent: result.hideOtherContent || false,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      expiresAt: result.expiresAt,
      linkUrl: result.linkUrl,
      linkText: result.linkText,
    };
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
}

// Delete an announcement
export async function deleteAnnouncement(id: string): Promise<boolean> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(ANNOUNCEMENTS_COLLECTION);

    const result = await collection.deleteOne({ _id: id as any });
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
}

