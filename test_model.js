import { pipeline } from "@xenova/transformers";
import wavefile from "wavefile";
import fs from "fs";

// Create a text-to-speech pipeline
const synthesizer = await pipeline(
  "text-to-speech",
  "neonwatty/mms-tts-mlg-onnx",
  {
    quantized: false, // Remove this line to use the quantized version (default)
  }
);

// Generate speech
const output = await synthesizer("Salama");

const wav = new wavefile.WaveFile();
wav.fromScratch(1, output.sampling_rate, "32f", output.audio);
fs.writeFileSync("out.wav", wav.toBuffer());
