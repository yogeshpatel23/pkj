import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!process.env.MONGODBNAME) {
  throw new Error(
    "Please define the MONGODBNAME environment variable inside .env.local"
  );
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODBNAME = process.env.MONGODBNAME;

const globalWithMongoose = global as typeof globalThis & {
  mongoose: {
    conn: null | mongoose.Connection;
    promise: null | Promise<mongoose.Connection>;
  };
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (globalWithMongoose.mongoose.conn) {
    return globalWithMongoose.mongoose.conn;
  }

  if (!globalWithMongoose.mongoose.promise) {
    const opts = {
      dbName: MONGODBNAME,
      bufferCommands: false,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    };

    globalWithMongoose.mongoose.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose.connection;
      });
  }
  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  return globalWithMongoose.mongoose.conn;
}

export default dbConnect;
