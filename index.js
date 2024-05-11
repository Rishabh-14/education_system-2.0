import express from "express";
import cors from "cors";
import setupStableDiffusionRoute from "./image/stableDiffusionRoute.js";
import setupLlavaRoute from "./image/llavaRoute.js";
import setupSdxlLightningRoute from "./image/sdxlLightningRoute.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

// Setup routes
setupStableDiffusionRoute(app);
setupLlavaRoute(app);
setupSdxlLightningRoute(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
