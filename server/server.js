import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import pool from './db.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.ORIGIN_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.get("/users", (req, res) => {
    try{
      
    }
    catch(err){
      console.error(err);
      res.status(500).json({err: "Server error"});
    }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});