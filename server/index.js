import express from "express"
import authRouter from "./src/routes/auth.route.js"
import messageRoutes from "./src/routes/message.route.js"
import dotenv from "dotenv"
import { connectDB } from "./src/lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express()
dotenv.config()
app.use(express.json())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser())
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

const port = process.env.PORT;

app.get("/" , (req , res) => {
    res.send("Working properly")
})

app.use("/api/auth" , authRouter)
app.use("/api/message" , messageRoutes)

app.listen(port , ()=> {
    console.log(`server running properly on port : ${port}`);
    connectDB()
})