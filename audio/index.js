
import express from "express";
import path from "path";

import setupAudioRoute from "./audio/audioRoute.js"; // Import the refactored route


import cors from "cors";
const app = express();
const port = 3002;

app.use(cors());

// Setup the /audio route
setupAudioRoute(app);



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
