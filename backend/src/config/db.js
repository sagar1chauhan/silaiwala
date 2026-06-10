const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Global is used here to maintain a cached connection across hot reloads
// in serverless environments.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false, // Recommended for serverless so queries fail fast if offline
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host}`);
      
      // Handle connection events only once globally
      if (!global.mongooseEventsAttached) {
        mongooseInstance.connection.on("disconnected", () => {
          console.warn("⚠️  MongoDB disconnected.");
        });
        mongooseInstance.connection.on("reconnected", () => {
          console.log("🔁 MongoDB reconnected.");
        });
        mongooseInstance.connection.on("error", (err) => {
          console.error(`❌ MongoDB connection error: ${err.message}`);
        });
        global.mongooseEventsAttached = true;
      }
      
      return mongooseInstance;
    }).catch(error => {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      cached.promise = null; // Reset promise so next request can retry connection
      throw error; // Throw error instead of process.exit to avoid crashing the serverless runtime
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    throw e;
  }
};

module.exports = connectDB;
