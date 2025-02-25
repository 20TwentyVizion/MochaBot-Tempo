export function startSpeechRecognition(): Promise<SpeechRecognition> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      reject(new Error("Speech recognition not supported"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    resolve(recognition);
  });
}

export function speak(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);
    window.speechSynthesis.speak(utterance);
  });
}
