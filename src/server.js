import express from "express";
import viewEngine from "./config/viewEngine";
import routeWed from "./route/web";
import api from "./route/aip";
import bodyParser from "body-parser";
import connectDB from "./config/connectDB";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000; // using environment variable for port number or defaulting to 3000 if not provided

// cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// config body-Parser
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// config view engine
viewEngine(app);

// routes wed
app.use("/", routeWed);

// routes api

app.use("/", api);

// connect database
connectDB();

app.listen(port, () => {
  console.log(`Backend Node.js running on the port ${port}`);
});
