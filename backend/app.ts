import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"

//congfiguration
dotenv.config();


const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes)

//server initailization
const port = 3001;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})