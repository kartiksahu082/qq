import mongoose from "mongoose";
import { DB } from "../contants.js";  // Assuming DB is the database name.


const connectDb = async () => {
  try {
    // Construct the full MongoDB URI using the environment variable for Mongo_uri and DB
    const uri = `${process.env.Mongo_uri}/${DB}`;
    
    // Connect to MongoDB
    const instance = await mongoose.connect(uri);
    
    // Log the host of the MongoDB connection
    console.log('Connected to MongoDB:', instance.connection.host);
  } catch (error) {
    // Log any connection errors
    console.log('MongoDB connection error:', error);
  }
}

export default connectDb;
