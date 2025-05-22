
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

export type User = {
  id: string;
  nickname: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
};

export type ThemeMode = "light" | "dark";

interface AppContextType {
  user: User | null;
  partner: User | null;
  isSearching: boolean;
  chatMessages: ChatMessage[];
  themeMode: ThemeMode;
  setUser: (user: User | null) => void;
  setPartner: (partner: User | null) => void;
  setIsSearching: (isSearching: boolean) => void;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
  startSearching: () => void;
  stopSearching: () => void;
  sendChatRequest: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const { toast } = useToast();

  // Mock finding a partner - in a real app, this would be replaced with WebRTC connection
  const startSearching = () => {
    setIsSearching(true);
    setPartner(null);
    setChatMessages([]);
    
    // Simulate finding a partner after a random time between 2-5 seconds
    const searchTime = Math.floor(Math.random() * 3000) + 2000;
    
    setTimeout(() => {
      // Mock partner data
      const mockPartner = {
        id: `user-${Math.floor(Math.random() * 10000)}`,
        nickname: ["Alex", "Sam", "Jordan", "Casey", "Taylor", "Morgan"][Math.floor(Math.random() * 6)]
      };
      
      setPartner(mockPartner);
      setIsSearching(false);
      
      toast({
        title: "Partner found!",
        description: `You are now connected with ${mockPartner.nickname}`,
      });
    }, searchTime);
  };
  
  const stopSearching = () => {
    setIsSearching(false);
    toast({
      title: "Stopped searching",
      description: "You've stopped looking for a chat partner.",
    });
  };
  
  const sendChatRequest = () => {
    // In a real app, this would send a WebRTC connection request
    toast({
      title: "Chat request sent",
      description: "Waiting for partner to accept...",
    });
    
    // Mock auto-accept after 1 second
    setTimeout(() => {
      toast({
        title: "Chat request accepted",
        description: `${partner?.nickname} accepted your chat request.`,
      });
    }, 1000);
  };
  
  const sendMessage = (text: string) => {
    if (!user || text.trim() === "") return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text: text,
      timestamp: Date.now(),
    };
    
    setChatMessages((prev) => [...prev, newMessage]);
    
    // Mock response from partner after 1-3 seconds
    if (partner && Math.random() > 0.3) {
      const responseTime = Math.floor(Math.random() * 2000) + 1000;
      
      setTimeout(() => {
        const responses = [
          "Hey, nice to meet you!",
          "How's it going?",
          "Where are you from?",
          "That's interesting!",
          "Cool, tell me more!",
          "I like your style!",
          "What brings you here today?"
        ];
        
        const partnerMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: partner.id,
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: Date.now(),
        };
        
        setChatMessages((prev) => [...prev, partnerMessage]);
      }, responseTime);
    }
  };
  
  const clearMessages = () => {
    setChatMessages([]);
  };
  
  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      
      // Update the document element class for immediate theme switch
      if (newMode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      return newMode;
    });
  };
  
  // Set the initial theme class on the document element
  React.useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const value = {
    user,
    partner,
    isSearching,
    chatMessages,
    themeMode,
    setUser,
    setPartner,
    setIsSearching,
    sendMessage,
    clearMessages,
    startSearching,
    stopSearching,
    sendChatRequest,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
