const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Default Adam voice

export async function speakWithElevenLabs(text: string): Promise<void> {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      },
    );

    if (!response.ok) throw new Error("ElevenLabs API error");

    const audioBlob = await response.blob();
    const audio = new Audio(URL.createObjectURL(audioBlob));

    return new Promise((resolve, reject) => {
      audio.onended = resolve;
      audio.onerror = reject;
      audio.play();
    });
  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    throw error;
  }
}
