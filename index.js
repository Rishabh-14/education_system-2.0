/*
import express from "express";
import cors from "cors";
import setupStableDiffusionRoute from "./image/stableDiffusionRoute.js";
import setupLlavaRoute from "./image/llavaRoute.js";
import setupSdxlLightningRoute from "./image/sdxlLightningRoute.js";
import router from "./text/gptRoute.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes

// Setup routes
setupStableDiffusionRoute(app);
setupLlavaRoute(app);
setupSdxlLightningRoute(app);
router();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
*/

// File: index.js
import express from "express";
import cors from "cors";
import setupStableDiffusionRoute from "./image/stableDiffusionRoute.js";
import setupLlavaRoute from "./image/llavaRoute.js";
import setupSdxlLightningRoute from "./image/sdxlLightningRoute.js";
import gptRouter from "./text/gptRoute.js";  // Make sure this is correctly imported
import setupAudioRoute from "./audio/audioRoute.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Setup routes
setupStableDiffusionRoute(app);
setupLlavaRoute(app);
setupSdxlLightningRoute(app);
app.use(gptRouter);  // Use the router middleware correctly
setupAudioRoute(app)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
