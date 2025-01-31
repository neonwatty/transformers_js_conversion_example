// import { pipeline } from "@xenova/transformers";
import { pipeline } from "../node_modules/@xenova/transformers";
console.log(pipeline);

// import { WaveFile } from "wavefile";
import { WaveFile } from "../node_modules/wavefile";

// Load the text-to-speech pipeline once
const synthesizer = await pipeline(
  "text-to-speech",
  "neonwatty/mms-tts-mlg-onnx"
);

export function generateSpeech(text) {
  try {
    const output = synthesizer(text);

    // Convert Float32Array to WAV format
    const wav = new WaveFile();
    wav.fromScratch(1, output.sampling_rate, "32f", output.audio);
    return new Blob([wav.toBuffer()], { type: "audio/wav" });
  } catch (error) {
    console.error("Error generating speech:", error);
    alert("Failed to generate speech.");
    return null;
  }
}
