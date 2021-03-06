import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
    await mongoose.connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin&retryWrites=true`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((con) => {
        console.log("MongoDB Connected");
    }
    ).catch(err => console.log(err));  
} 

export default connect;
