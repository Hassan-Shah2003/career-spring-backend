import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import jobRoutes from './routes/job.routes.js'
// import { Cross } from "lucide-react";
import cors from 'cors'
export const app = express();

app.get('/home',(req,res) => {
    return res.status(200).json({
        message: "i am coming from backend",
        sucess:true,
    })
})
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://career-spring.netlify.app",
        "https://career-spring-frontend.netlify.app"  // naya URL
    ],
    credentials: true
}));
app.use(cookieParser());
console.log(process.env.CLOUD_NAME,"...........CLOUD_NAME,");
console.log(process.env.API_KEY,"...........API_KEY,");
console.log(process.env.API_SECRET,"...........API_SECRET,");
// app.use(cors(corsOprion));
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/v1/jobs',jobRoutes)