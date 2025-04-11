// import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
// const dbName = 'sports_scheduling';

// export const connectDB = async () => {
//     if (db) return db;
//     try {
//         const client = await MongoClient.connect(uri);
//         console.log('Connected to MongoDB');
//         db = client.db(dbName);
//         return db;
//     } catch (error) {
//         console.error('Failed to connect to MongoDB', error);
//         throw error;
//     }
// };

export const connectDB = async () => {
    // if (db) return db;
    try {
        await mongoose.connect(uri)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error;
    }
}