import express from "express";
import cors from "cors";
import setupStableDiffusionRoute from "./image/stableDiffusionRoute.js";

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

// Setup routes
setupStableDiffusionRoute(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
