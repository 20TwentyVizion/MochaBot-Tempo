import React, { useState, useCallback } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import VoiceControls from "./VoiceControls";
import ChatHistory from "./ChatHistory";
import { chatWithGemini } from "@/lib/gemini";
import { startSpeechRecognition, speak as webSpeak } from "@/lib/speech";
import { speakWithElevenLabs } from "@/lib/elevenlabs";

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void;
  onVoiceToggle?: (isActive: boolean) => void;
  isListening?: boolean;
  onBotSpeaking?: (speaking: boolean) => void;
}

const ChatInterface = ({
  onSendMessage = () => {},
  onVoiceToggle = () => {},
  isListening = false,
  onBotSpeaking = () => {},
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      sender: "user" | "bot";
      text: string;
      timestamp: string;
    }>
  >([
    {
      id: "1",
      sender: "bot",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const userMessage = message;
      setMessage("");

      // Add user message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text: userMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      try {
        // Get AI response
        const response = await chatWithGemini(userMessage);
        if (!response) {
          throw new Error("No response from Gemini");
        }

        // Add bot message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "bot",
            text: response,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        // Speak the response using selected TTS service
        onBotSpeaking(true);
        try {
          if (import.meta.env.VITE_ELEVENLABS_API_KEY) {
            await speakWithElevenLabs(response);
          } else {
            await webSpeak(response);
          }
        } catch (error) {
          console.error("TTS error:", error);
          // Fallback to web speech if ElevenLabs fails
          if (error.toString().includes("ElevenLabs")) {
            await webSpeak(response);
          }
        }
        onBotSpeaking(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleVoiceToggle = useCallback(
    async (isActive: boolean) => {
      onVoiceToggle(isActive);

      if (isActive) {
        try {
          const recognitionInstance = await startSpeechRecognition();
          setRecognition(recognitionInstance);

          recognitionInstance.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            setMessage(transcript);
            await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
          };

          recognitionInstance.start();
        } catch (error) {
          console.error("Speech recognition error:", error);
        }
      } else if (recognition) {
        recognition.stop();
        setRecognition(null);
      }
    },
    [onVoiceToggle, recognition],
  );

  return (
    <div className="fixed right-6 bottom-6 w-[400px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg shadow-lg">
      <div className="flex flex-col h-[600px] p-4 gap-4">
        <ChatHistory messages={messages} />

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <VoiceControls
            isListening={isListening}
            onMicToggle={onVoiceToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
