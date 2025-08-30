// scripts/setup-database.ts
// This script should be run with Node.js to set up your Appwrite database

import { Client, Databases, IndexType } from 'node-appwrite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize SDK
const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '') // Your project ID
  .setKey(process.env.APPWRITE_API_KEY || ''); // Your secret API key

const DATABASE_ID = 'focusflow-db';

interface AttributeConfig {
  key: string;
  type: 'string' | 'integer' | 'float' | 'boolean' | 'datetime' | 'json' | 'url' | 'enum';
  size?: number;
  required: boolean;
  min?: number;
  max?: number;
  elements?: string[];
}

interface IndexConfig {
  key: string;
  type: IndexType;
  attributes: string[];
}

interface CollectionConfig {
  name: string;
  permissions: string[];
  attributes: AttributeConfig[];
  indexes: IndexConfig[];
}

async function createDatabase() {
  try {
    console.log('Creating database...');
    const promise = databases.create(DATABASE_ID, 'Task Manager Database');
    const database = await promise;
    console.log('✅ Database created:', database.name);
    return database;
  } catch (error: any) {
    if (error.code === 409) {
      console.log('✅ Database already exists');
      try {
        const database = await databases.get(DATABASE_ID);
        return database;
      } catch (getError) {
        console.error('Error getting existing database:', getError);
        throw getError;
      }
    }
    console.error('Error creating database:', error);
    throw error;
  }
}

async function createCollection(collectionId: string, config: CollectionConfig) {
  try {
    console.log(`Creating collection: ${config.name}...`);
    
    // Create collection
    const promise = databases.createCollection(
      DATABASE_ID,
      collectionId,
      config.name,
      config.permissions
    );
    const collection = await promise;

    console.log(`✅ Collection created: ${collection.name}`);

    // Create attributes
    for (const attr of config.attributes) {
      try {
        console.log(`  Adding attribute: ${attr.key}`);
        
        let attributePromise;
        
        switch (attr.type) {
          case 'string':
            attributePromise = databases.createStringAttribute(
              DATABASE_ID,
              collectionId,
              attr.key,
              attr.size || 255,
              attr.required
            );
            break;
          case 'integer':
            attributePromise = databases.createIntegerAttribute(
              DATABASE_ID,
              collectionId,
              attr.key,
              attr.required,
              attr.min,
              attr.max
            );
            break;
          case 'float':
            attributePromise = databases.createFloatAttribute(
              DATABASE_ID,
              collectionId,
              attr.key,
              attr.required,
              attr.min,
              attr.max
            );
            break;
          case 'boolean':
            attributePromise = databases.createBooleanAttribute(
              DATABASE_ID,
              collectionId,
              attr.key,
              attr.required
            );
            break;
          case 'datetime':
            attributePromise = databases.createDatetimeAttribute(
              DATABASE_ID,
              collectionId,
              attr.key,
              attr.required
            );
            break;
          case 'json':
            // For JSON attributes, we'll use string type in Appwrite
            attributePromise = databases.createStringAttribute(
              DATABASE_ID,
              collectionId,
              attr.key,
              65535, // Max size for JSON data
              attr.required
            );
            break;
          case 'url':
            attributePromise = databases.createUrlAttribute(
              DATABASE_ID,
              collectionId,
              attr.key,
              attr.required
            );
            break;
          case 'enum':
            attributePromise = databases.createEnumAttribute(
              DATABASE_ID,
              collectionId,
              attr.key,
              attr.elements || [],
              attr.required
            );
            break;
        }

        if (attributePromise) {
          await attributePromise;
        }

        // Wait a bit to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (attrError: any) {
        console.log(`  ⚠️  Attribute ${attr.key} might already exist:`, attrError.message);
      }
    }

    // Wait for attributes to be ready
    console.log('  Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create indexes
    for (const index of config.indexes) {
      try {
        console.log(`  Adding index: ${index.key}`);
        const indexPromise = databases.createIndex(
          DATABASE_ID,
          collectionId,
          index.key,
          index.type,
          index.attributes
        );
        await indexPromise;
        
        // Wait a bit between index creation
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (indexError: any) {
        console.log(`  ⚠️  Index ${index.key} might already exist:`, indexError.message);
      }
    }

    return collection;
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`✅ Collection ${config.name} already exists`);
      try {
        const collection = await databases.getCollection(DATABASE_ID, collectionId);
        return collection;
      } catch (getError) {
        console.error('Error getting existing collection:', getError);
        throw getError;
      }
    }
    console.error('Error creating collection:', error);
    throw error;
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    console.log('Endpoint:', process.env.PUBLIC_APPWRITE_ENDPOINT);
    console.log('Project ID:', process.env.PUBLIC_APPWRITE_PROJECT_ID);
    console.log('API Key:', process.env.APPWRITE_API_KEY ? '***configured***' : '❌ MISSING');

    if (!process.env.APPWRITE_API_KEY) {
      throw new Error('APPWRITE_API_KEY environment variable is required');
    }

    // Create database
    await createDatabase();

    // Define collections
    const collections: Record<string, CollectionConfig> = {
      'users': {
        name: 'Users',
        permissions: ['read("any")', 'create("users")'],
        attributes: [
          { key: 'email', type: 'string', size: 255, required: true },
          { key: 'name', type: 'string', size: 255, required: true },
          { key: 'googleId', type: 'string', size: 255, required: false },
          { key: 'avatar', type: 'url', required: false },
          { key: 'timezone', type: 'string', size: 100, required: true },
          { key: 'preferences', type: 'json', required: true }
        ],
        indexes: [
          { key: 'email', type: IndexType.Unique, attributes: ['email'] },
          { key: 'googleId', type: IndexType.Key, attributes: ['googleId'] }
        ]
      },
      'tasks': {
        name: 'Tasks',
        permissions: ['read("users")', 'create("users")'],
        attributes: [
          { key: 'userId', type: 'string', size: 36, required: true },
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'description', type: 'string', size: 2000, required: false },
          { key: 'type', type: 'enum', elements: ['task'], required: true },
          { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high', 'urgent'], required: true },
          { key: 'status', type: 'enum', elements: ['pending', 'in-progress', 'completed', 'cancelled'], required: true },
          { key: 'startDateTime', type: 'datetime', required: true },
          { key: 'endDateTime', type: 'datetime', required: false },
          { key: 'allDay', type: 'boolean', required: true },
          { key: 'timezone', type: 'string', size: 100, required: true },
          { key: 'tags', type: 'json', required: false },
          { key: 'googleCalendarEventId', type: 'string', size: 255, required: false },
          { key: 'reminders', type: 'json', required: false },
          { key: 'attachments', type: 'json', required: false },
          { key: 'estimatedHours', type: 'float', required: false },
          { key: 'actualHours', type: 'float', required: false },
          { key: 'dependencies', type: 'json', required: false },
          { key: 'subtasks', type: 'json', required: false },
          { key: 'parentTaskId', type: 'string', size: 36, required: false },
          { key: 'progress', type: 'integer', min: 0, max: 100, required: true },
          { key: 'assignedTo', type: 'json', required: false }
        ],
        indexes: [
          { key: 'userId', type: IndexType.Key, attributes: ['userId'] },
          { key: 'status', type: IndexType.Key, attributes: ['status'] },
          { key: 'priority', type: IndexType.Key, attributes: ['priority'] },
          { key: 'startDateTime', type: IndexType.Key, attributes: ['startDateTime'] },
          { key: 'userStatus', type: IndexType.Key, attributes: ['userId', 'status'] }
        ]
      },
      'reminders': {
        name: 'Reminders',
        permissions: ['read("users")', 'create("users")'],
        attributes: [
          { key: 'userId', type: 'string', size: 36, required: true },
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'description', type: 'string', size: 2000, required: false },
          { key: 'type', type: 'enum', elements: ['reminder'], required: true },
          { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high', 'urgent'], required: true },
          { key: 'status', type: 'enum', elements: ['pending', 'completed', 'cancelled'], required: true },
          { key: 'startDateTime', type: 'datetime', required: true },
          { key: 'allDay', type: 'boolean', required: true },
          { key: 'timezone', type: 'string', size: 100, required: true },
          { key: 'tags', type: 'json', required: false },
          { key: 'googleCalendarEventId', type: 'string', size: 255, required: false },
          { key: 'reminders', type: 'json', required: false },
          { key: 'recurringPattern', type: 'json', required: false },
          { key: 'snoozeUntil', type: 'datetime', required: false },
          { key: 'isRecurring', type: 'boolean', required: true }
        ],
        indexes: [
          { key: 'userId', type: IndexType.Key, attributes: ['userId'] },
          { key: 'status', type: IndexType.Key, attributes: ['status'] },
          { key: 'startDateTime', type: IndexType.Key, attributes: ['startDateTime'] },
          { key: 'isRecurring', type: IndexType.Key, attributes: ['isRecurring'] }
        ]
      },
      'meetings': {
        name: 'Meetings',
        permissions: ['read("users")', 'create("users")'],
        attributes: [
          { key: 'userId', type: 'string', size: 36, required: true },
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'description', type: 'string', size: 2000, required: false },
          { key: 'type', type: 'enum', elements: ['meeting'], required: true },
          { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high', 'urgent'], required: true },
          { key: 'status', type: 'enum', elements: ['pending', 'in-progress', 'completed', 'cancelled'], required: true },
          { key: 'startDateTime', type: 'datetime', required: true },
          { key: 'endDateTime', type: 'datetime', required: true },
          { key: 'allDay', type: 'boolean', required: true },
          { key: 'timezone', type: 'string', size: 100, required: true },
          { key: 'tags', type: 'json', required: false },
          { key: 'googleCalendarEventId', type: 'string', size: 255, required: false },
          { key: 'googleMeetUrl', type: 'url', required: false },
          { key: 'reminders', type: 'json', required: false },
          { key: 'location', type: 'string', size: 255, required: false },
          { key: 'meetingType', type: 'enum', elements: ['in-person', 'online', 'hybrid'], required: true },
          { key: 'attendees', type: 'json', required: false },
          { key: 'agenda', type: 'string', size: 5000, required: false },
          { key: 'meetingRoom', type: 'string', size: 255, required: false },
          { key: 'googleMeetSettings', type: 'json', required: false }
        ],
        indexes: [
          { key: 'userId', type: IndexType.Key, attributes: ['userId'] },
          { key: 'status', type: IndexType.Key, attributes: ['status'] },
          { key: 'startDateTime', type: IndexType.Key, attributes: ['startDateTime'] },
          { key: 'meetingType', type: IndexType.Key, attributes: ['meetingType'] }
        ]
      },
      'categories': {
        name: 'Categories',
        permissions: ['read("users")', 'create("users")'],
        attributes: [
          { key: 'userId', type: 'string', size: 36, required: true },
          { key: 'name', type: 'string', size: 100, required: true },
          { key: 'color', type: 'string', size: 7, required: true },
          { key: 'icon', type: 'string', size: 50, required: false },
          { key: 'isDefault', type: 'boolean', required: true }
        ],
        indexes: [
          { key: 'userId', type: IndexType.Key, attributes: ['userId'] }
        ]
      },
      'notifications': {
        name: 'Notifications',
        permissions: ['read("users")', 'create("users")'],
        attributes: [
          { key: 'userId', type: 'string', size: 36, required: true },
          { key: 'itemId', type: 'string', size: 36, required: true },
          { key: 'type', type: 'enum', elements: ['reminder', 'overdue', 'upcoming', 'meeting_reminder'], required: true },
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'message', type: 'string', size: 1000, required: true },
          { key: 'scheduledFor', type: 'datetime', required: true },
          { key: 'sentAt', type: 'datetime', required: false },
          { key: 'isRead', type: 'boolean', required: true },
          { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high', 'urgent'], required: true }
        ],
        indexes: [
          { key: 'userId', type: IndexType.Key, attributes: ['userId'] },
          { key: 'isRead', type: IndexType.Key, attributes: ['isRead'] },
          { key: 'scheduledFor', type: IndexType.Key, attributes: ['scheduledFor'] }
        ]
      }
    };

    // Create all collections
    for (const [collectionId, config] of Object.entries(collections)) {
      await createCollection(collectionId, config);
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your environment variables with the database ID');
    console.log('2. Set up authentication with Google OAuth');
    console.log('3. Configure permissions for your collections');
    console.log('4. Start building your SvelteKit app!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup if this file is executed directly (ES module version)
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };