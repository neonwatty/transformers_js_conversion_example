/////////////////////////////////////////////////////////////////
// Worker.js file for doing all transformer-based computations //
// Needed to ensure the UI thread is not blocked when running  //
/////////////////////////////////////////////////////////////////

import { pipeline, env } from "@xenova/transformers";
env.allowLocalModels = false;

// Listen for messages from UI
self.addEventListener("message", async (event) => {
  const data = event.data;

  let result = await tts(data);
  self.postMessage({
    task: data.task,
    type: "result",
    data: result,
  });
});

// Define model factories
// Ensures only one model is created of each type
class PipelineFactory {
  static task = null;
  static model = null;
  static quantized = null;

  // NOTE: instance stores a promise that resolves to the pipeline
  static instance = null;

  constructor(tokenizer, model) {
    this.tokenizer = tokenizer;
    this.model = model;
  }

  /**
   * Get pipeline instance
   * @param {*} progressCallback
   * @returns {Promise}
   */
  static getInstance(progressCallback = null) {
    if (this.task === null || this.model === null) {
      throw Error("Must set task and model");
    }
    if (this.instance === null) {
      this.instance = pipeline(
        this.task,
        this.model,
        { quantized: this.quantized },
        {
          progress_callback: progressCallback,
        }
      );
    }

    return this.instance;
  }
}

class TTSPipelineFactory extends PipelineFactory {
  static task = "text-to-speech";
  static model = "neonwatty/mms-tts-mlg-onnx";
  static quantized = false;
}

async function tts(data) {
  let pipeline = await TTSPipelineFactory.getInstance((data) => {
    self.postMessage({
      type: "download",
      task: "text-to-speech",
      data: data,
    });
  });

  const output = await pipeline(data.text);

  // Convert Float32Array to WAV format
  const wav = new WaveFile();
  wav.fromScratch(1, output.sampling_rate, "32f", output.audio);
  return new Blob([wav.toBuffer()], { type: "audio/wav" });
}
