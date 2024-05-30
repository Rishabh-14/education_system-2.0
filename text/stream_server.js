<<<<<<< Updated upstream
import express from "express";
import cors from "cors";
const app = express();
const port = 3002;

import generateStory from "./stream.js";

app.use(cors());

// Setup the /audio route
generateStory(app);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
=======
import express from "express";
import cors from "cors";
const app = express();
const port = 3001;

import generateStory from "./generateStory.js";

app.use(cors());

// Setup the /audio route
generateStory(app);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
>>>>>>> Stashed changes
