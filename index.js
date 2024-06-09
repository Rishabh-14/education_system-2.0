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

/*
import express from "express";
import cors from "cors";
import setupStableDiffusionRoute from "./image/stableDiffusionRoute.js";
import setupLlavaRoute from "./image/llavaRoute.js";
import setupSdxlLightningRoute from "./image/sdxlLightningRoute.js";
import gptRouter from "./text/gptRoute.js";  // Make sure this is correctly imported
import setupAudioRoute from "./audio/audioRoute.js";
import generateAudioStory from "./text/stream.js"; // Import the generateStory module

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
generateAudioStory(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
*/
/* Working
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import setupStableDiffusionRoute from "./image/stableDiffusionRoute.js";
import setupLlavaRoute from "./image/llavaRoute.js";
import setupSdxlLightningRoute from "./image/sdxlLightningRoute.js";
import gptRouter from "./text/gptRoute.js";
import setupAudioRoute from "./audio/audioRoute.js";
import generateAudioStory from "./text/stream.js"; // Ensure this is imported correctly
import setupLearningPlanRoute from "./learning/learningPlanRoute.js";
import setupAssessmentRoute from "./learning/assessmentRoute.js";

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Setup routes
setupStableDiffusionRoute(app);
setupLlavaRoute(app);
setupSdxlLightningRoute(app);
app.use(gptRouter); // Use the router middleware correctly
setupAudioRoute(app);
generateAudioStory(app); // Ensure the function is called with app
setupLearningPlanRoute(app);
setupAssessmentRoute(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
*/
/*
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupStableDiffusionRoute from "./image/stableDiffusionRoute.js";
import setupLlavaRoute from "./image/llavaRoute.js";
import setupSdxlLightningRoute from "./image/sdxlLightningRoute.js";
import gptRouter from "./text/gptRoute.js";
import setupAudioRoute from "./audio/openaiAudioServer.js";
import generateAudioStory from "./text/stream.js";
import setupLearningPlanRoute from "./learning/learningPlanRoute.js";
import setupAssessmentRoute from "./learning/assessmentRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

app.get("/config", (req, res) => {
  res.json({
    apiUrl:
      process.env.NODE_ENV === "production"
        ? process.env.RAILWAY_URL
        : process.env.LOCAL_URL,
  });
});
// Setup routes
setupStableDiffusionRoute(app);
setupLlavaRoute(app);
setupSdxlLightningRoute(app);
app.use(gptRouter);
setupAudioRoute(app);
generateAudioStory(app);
setupLearningPlanRoute(app);
setupAssessmentRoute(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
*/
/*
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupStableDiffusionRoute from "./image/stableDiffusionRoute.js";
import setupLlavaRoute from "./image/llavaRoute.js";
import setupSdxlLightningRoute from "./image/sdxlLightningRoute.js";
import gptRouter from "./text/gptRoute.js";
import setupAudioRoute from "./audio/openaiAudioServer.js";
import generateAudioStory from "./text/stream.js";
import setupLearningPlanRoute from "./learning/learningPlanRoute.js";
import setupAssessmentRoute from "./learning/assessmentRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(express.json()); // Middleware to parse JSON bodies
app.options("*", cors()); // Handle preflight requests

app.get("/config", (req, res) => {
  res.json({
    apiUrl:
      process.env.NODE_ENV === "production"
        ? process.env.RAILWAY_URL
        : process.env.LOCAL_URL,
  });
});

// Setup routes
setupStableDiffusionRoute(app);
setupLlavaRoute(app);
setupSdxlLightningRoute(app);
app.use(gptRouter);
setupAudioRoute(app);
generateAudioStory(app);
setupLearningPlanRoute(app);
setupAssessmentRoute(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
*/

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupStableDiffusionRoute from "./image/stableDiffusionRoute.js";
import setupLlavaRoute from "./image/llavaRoute.js";
import setupSdxlLightningRoute from "./image/sdxlLightningRoute.js";
import gptRouter from "./text/gptRoute.js";
import setupAudioRoute from "./audio/openaiAudioServer.js";
import generateAudioStory from "./text/stream.js";
import setupLearningPlanRoute from "./learning/learningPlanRoute.js";
import setupAssessmentRoute from "./learning/assessmentRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration to allow requests from your GitHub Pages site
const corsOptions = {
  origin: "https://rishabh-14.github.io",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies

// Handle preflight requests
app.options("*", cors(corsOptions));

app.get("/config", (req, res) => {
  res.json({
    apiUrl:
      process.env.NODE_ENV === "production"
        ? process.env.RAILWAY_URL
        : process.env.LOCAL_URL,
  });
});

// Setup routes
setupStableDiffusionRoute(app);
setupLlavaRoute(app);
setupSdxlLightningRoute(app);
app.use(gptRouter);
setupAudioRoute(app);
generateAudioStory(app);
setupLearningPlanRoute(app);
setupAssessmentRoute(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
