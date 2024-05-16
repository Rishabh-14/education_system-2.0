import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 3001;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/tts', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send('Text input is required');
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text
    });

    const speechBuffer = Buffer.from(await mp3.arrayBuffer());
    const speechFilePath = path.resolve('./speech.mp3');
    
    // Save the MP3 file temporarily
    await fs.promises.writeFile(speechFilePath, speechBuffer);

    // Stream the MP3 file to the client
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline',
    });

    const readStream = fs.createReadStream(speechFilePath);
    readStream.pipe(res);

    readStream.on('end', () => {
      // Delete the temporary file after streaming
      fs.unlink(speechFilePath, (err) => {
        if (err) {
          console.error('Failed to delete temporary file:', err);
        }
      });
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).send('Failed to generate speech');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
