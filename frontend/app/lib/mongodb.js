import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("⚠️ Please define the MONGODB_URI environment variable in .env.local");
}

let isConnected = false; // global cache

export default async function connectDB() {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(MONGODB_URI, {
            dbName: "user-db"
        });

        isConnected = db.connections[0].readyState === 1;
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
}
