import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.routes"
import subjectRouter from "./routes/subject.routes"
import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
)

app.use(express.json())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/subjects", subjectRouter)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected")
  })
  .catch((err) => {
    console.error(`DB connection fail: ${err}`)
    process.exit(1)
  })

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on ${SERVER_PORT}`)
})