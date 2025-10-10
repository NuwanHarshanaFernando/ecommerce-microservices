/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit from 'express-rate-limit';
import swaggerUi from "swagger-ui-express";
import axios from 'axios';
import cookieParser from "cookie-parser";
//import * as path from 'path';

const app = express();

//app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(cors({
  origin: ["http://localhost:3000"],
  allowedHeaders: ['Authorization', "Content-Type"],
  credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json({limit: "100mb"})); // json data limit
app.use(express.urlencoded({limit: "100mb", extended: true}));
app.use(cookieParser());
app.set("trust proxy", 1);

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes in mili seconds
  max: (req:any) => (req.user ? 1000 : 100), // req.user means logged user
  message: {error: "Too many requests, please try again later!"},
  standardHeaders: true,
  legacyHeaders: true, 
  keyGenerator: (req:any) => req.ip,// We're adding a rate-limit for a specific IP
});

app.use(limiter);

// app.get('/api', (req, res) => {
//   res.send({ message: 'Welcome to api-gateway!' });
// });

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

// Add services 
app.use("/", proxy("http://localhost:6001")) // auth-service


const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
