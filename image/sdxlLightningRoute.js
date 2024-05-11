import { sdxlLightning } from "./sdxl_lightning.js";

const setupSdxlLightningRoute = (app) => {
  app.post("/sdxl-lightning", async (req, res) => {
    try {
      const output = await sdxlLightning();
      res.json({ url: output }); // Adjust according to the actual output format
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });
};

export default setupSdxlLightningRoute;
