// config.js
const LOCAL_URL = process.env.LOCAL_URL || "http://localhost:3001";
const RAILWAY_URL =
  process.env.RAILWAY_URL || "https://your-railway-domain.railway.app";

const config = {
  apiUrl: process.env.NODE_ENV === "production" ? RAILWAY_URL : LOCAL_URL,
};

export { config };
