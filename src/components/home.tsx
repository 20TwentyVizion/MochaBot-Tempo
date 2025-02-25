import React, { useState } from "react";
import AvatarScene from "./AvatarScene";
import ChatInterface from "./ChatInterface";

interface HomeProps {
  modelUrl?: string;
  onSendMessage?: (message: string) => void;
  onVoiceToggle?: (isActive: boolean) => void;
}

const Home = ({
  modelUrl = "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
}: HomeProps) => {
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const handleModelLoad = () => {
    console.log("3D Model loaded successfully");
  };

  const handleModelError = (error: string) => {
    console.error("Error loading 3D model:", error);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-background via-background/90 to-background/80 overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center mb-8">
            3D Avatar Chatbot
          </h1>

          <div className="w-full max-w-[1000px] relative">
            <AvatarScene
              modelUrl={modelUrl}
              onLoad={handleModelLoad}
              onError={handleModelError}
              isSpeaking={isBotSpeaking}
            />
          </div>
        </div>
      </div>

      <ChatInterface onBotSpeaking={setIsBotSpeaking} />
    </div>
  );
};

export default Home;
