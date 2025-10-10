/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from "cors";
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import swaggerUi from "swagger-ui-express";
import swaggerDocument = require("./swagger-output.json");
//import * as path from 'path';

const app = express();

//app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(cors({
  origin: ["http://localhost:3000"],
  allowedHeaders: ['Authorization', "Content-Type"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to auth-service!' });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});

// Routes
app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  //console.log(`Listening at http://localhost:${port}/api`);
  console.log(`Auth service is running at http://localhost:${port}/api`);
  console.log(`Swagger Docs Available at http://localhost:${port}/docs`)
});

//server.on('error', console.error);
server.on("error", (err) => {
  console.log("Server Error: ", err);
});
