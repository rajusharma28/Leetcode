import express from 'express';
import dotenv from 'dotenv';
import main from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from "./routes/userAuth.js";
import redisClient from './config/redis.js';
import problemRouter from "./routes/problemCreator.js";
import submitRouter from "./routes/submit.js";
import aiRouter from "./routes/aiChatting.js";
import videoRouter from "./routes/videoCreator.js";
import contestRouter from "./routes/contests.js";
import cors from 'cors';

dotenv.config();
const app = express();

// console.log("Hello")

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}))

app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);
app.use('/contests', contestRouter);


const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
        
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitalizeConnection();

