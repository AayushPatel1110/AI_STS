import mongoose from "mongoose";
import dns from 'dns';

// Use Google DNS to resolve MongoDB Atlas SRV records
// This can help with connection issues on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Give more time for connection
            socketTimeoutMS: 45000,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
       
    }
};
