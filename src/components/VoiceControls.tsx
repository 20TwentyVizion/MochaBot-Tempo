import React, { useState } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface VoiceControlsProps {
  onMicToggle?: (isActive: boolean) => void;
  isListening?: boolean;
}

const VoiceControls = ({
  onMicToggle = () => {},
  isListening = false,
}: VoiceControlsProps) => {
  const [isMicActive, setIsMicActive] = useState(isListening);

  const handleMicToggle = () => {
    const newState = !isMicActive;
    setIsMicActive(newState);
    onMicToggle(newState);
  };

  return (
    <div className="flex items-center justify-center p-4 bg-background rounded-lg shadow-lg w-full max-w-md mx-auto">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isMicActive ? "destructive" : "default"}
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center relative"
                onClick={handleMicToggle}
              >
                {isMicActive ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
                {isMicActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3">
                    <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMicActive ? "Stop listening" : "Start listening"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isMicActive && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-8 bg-primary rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "0.75s",
                  }}
                ></div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Listening...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceControls;
