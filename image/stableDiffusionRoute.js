import { imageGeneration } from "./stable_diffusion.js";

const setupStableDiffusionRoute = (app) => {
  app.post("/stable-diffusion", async (req, res) => {
    try {
      const output = await imageGeneration();
      res.json({ url: output[0] }); // Assuming output is an array of URLs
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });
};

export default setupStableDiffusionRoute;
