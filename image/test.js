import Replicate from "replicate";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

console.log(process.env.REPLICATE_API_TOKEN);
