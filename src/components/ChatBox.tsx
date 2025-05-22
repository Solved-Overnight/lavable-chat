
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp, ChatMessage } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const ChatBox: React.FC = () => {
  const { user, partner, chatMessages, sendMessage } = useApp();
  const [messageInput, setMessageInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };
  
  const renderMessage = (message: ChatMessage) => {
    const isFromUser = message.senderId === user?.id;
    const senderName = isFromUser ? user?.nickname : partner?.nickname;
    
    return (
      <div
        key={message.id}
        className={cn(
          "flex flex-col mb-3",
          isFromUser ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-end gap-2">
          <div
            className={cn(
              "max-w-[80%] px-3 py-2 rounded-lg",
              isFromUser
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-secondary text-secondary-foreground rounded-bl-none"
            )}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        </div>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <span className="mr-1">{senderName}</span>
          <span>{format(message.timestamp, "HH:mm")}</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b">
        <h3 className="font-semibold">Chat</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-center">No messages yet</p>
            <p className="text-xs text-center mt-1">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          chatMessages.map(renderMessage)
        )}
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-2">
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          disabled={!partner}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!partner || !messageInput.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
