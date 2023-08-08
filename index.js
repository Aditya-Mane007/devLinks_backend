import express from "express"
import colors from "colors"
import dotenv from "dotenv"
dotenv.config()
import userRoutes from "./routes/userRoutes.js"
import { connectDB } from "./config/dbConnect.js"
import errorHandler from "./middlewares/errorMiddleware.js"
import cors from "cors"
import bodyParser from "body-parser"
import { v2 as cloudinary } from 'cloudinary'

connectDB()

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json({ limit: "30mb",extended: true }))
app.use(express.urlencoded({ limit: "30mb",extended: true }))
// app.use(bodyParser.json({ limit: "30mb",extended: true }))
// app.use(bodyParser.urlencoded({ limit: '30mb',extended: true }))
app.use(cors())


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use("/api/users",userRoutes)



app.use(errorHandler)

app.listen(PORT,() => {
  console.log(`Server is running on port ${PORT}`.cyan.underline)
})