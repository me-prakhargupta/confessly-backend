import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";
import { DB_NAME } from "./env.js";

const connectDb = async() => {
    try {
        await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
        console.log("MongoDB connected!");
    } catch(error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
};

export default connectDb;