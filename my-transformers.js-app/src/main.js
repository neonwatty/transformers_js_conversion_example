import { generateSpeech } from "./tts.js";

document.getElementById("generateBtn").addEventListener("click", async () => {
  const text = document.getElementById("textInput").value;
  if (!text) {
    alert("Please enter text.");
    return;
  }

  const audioBlob = await generateSpeech(text);

  if (audioBlob) {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = URL.createObjectURL(audioBlob);
    audioPlayer.style.display = "block";
    audioPlayer.play();

    document.getElementById("replayBtn").disabled = false;
  }
});

document.getElementById("replayBtn").addEventListener("click", () => {
  const audioPlayer = document.getElementById("audioPlayer");
  if (audioPlayer.src) {
    audioPlayer.play();
  }
});
