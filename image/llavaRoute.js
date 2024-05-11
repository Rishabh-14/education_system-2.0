import { llava } from "./llava.js";

const setupLlavaRoute = (app) => {
  app.post("/llava", async (req, res) => {
    try {
      const output = await llava();
      res.json({ url: output }); // Adjust according to the actual output format
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });
};

export default setupLlavaRoute;
