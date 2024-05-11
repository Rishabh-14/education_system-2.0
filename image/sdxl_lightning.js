import Replicate from "replicate";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
export async function sdxlLightning() {
  const output = await replicate.run(
    "bytedance/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a",
    {
      input: {
        width: 1024,
        height: 1024,
        prompt: "self-portrait of a woman, lightning in the background",
        scheduler: "K_EULER",
        num_outputs: 1,
        guidance_scale: 0,
        negative_prompt: "worst quality, low quality",
        num_inference_steps: 4,
      },
    }
  );
  console.log(output);
  return output;
}
