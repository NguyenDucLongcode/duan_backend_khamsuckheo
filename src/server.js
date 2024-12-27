import express from "express";
import viewEngine from "./config/viewEngine";
import routeWed from "./route/web";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000; // using environment variable for port number or defaulting to 3000 if not provided

// config body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config view engine
viewEngine(app);

// routes wed
app.use("/", routeWed);

app.listen(port, () => {
  console.log(`Backend Node.js running on the port ${port}`);
});
