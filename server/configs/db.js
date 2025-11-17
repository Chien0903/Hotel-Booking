import mongoose from "mongoose";

const connectDB = async () => {

    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        mongoose.connection.on('error', (err) => console.error("MongoDB connection error:", err.message));

        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined");
        }

        // Use dbName option instead of string concatenation to avoid malformed URIs
        await mongoose.connect(uri, { dbName: 'hotel-booking' });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
    }

};

export default connectDB;
// Note: Prefer avoiding the '@' symbol in your database user's password, or URL-encode it.