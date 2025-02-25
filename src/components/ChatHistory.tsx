import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface ChatHistoryProps {
  messages?: Message[];
}

const defaultMessages: Message[] = [
  {
    id: "1",
    sender: "bot",
    text: "Hello! How can I help you today?",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    sender: "user",
    text: "I have a question about the service.",
    timestamp: "10:01 AM",
  },
  {
    id: "3",
    sender: "bot",
    text: "Of course! I'd be happy to help. What would you like to know?",
    timestamp: "10:01 AM",
  },
];

const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages = defaultMessages,
}) => {
  return (
    <div className="w-full h-[520px] bg-background border rounded-lg p-4">
      <ScrollArea className="h-full w-full pr-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className="w-8 h-8">
                {message.sender === "bot" ? (
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=bot" />
                ) : (
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                )}
                <AvatarFallback>
                  {message.sender === "bot" ? "B" : "U"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col max-w-[80%] ${
                  message.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
