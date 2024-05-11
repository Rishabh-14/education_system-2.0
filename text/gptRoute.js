// api-route.js
import express from "express";
import { gptOnce } from "./gpt.js";

const router = express.Router();

router.post("/gpt", async (req, res) => {
  try {
    const transcript = req.body.transcript;
    const response = await gptOnce(transcript);
    res.json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

export default router;
