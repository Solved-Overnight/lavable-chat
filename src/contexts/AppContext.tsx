
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
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
  onlineUserCount: number;
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
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const { toast } = useToast();

  // Simulate fluctuating online user count
  useEffect(() => {
    // Initialize with a random number between 50-150
    setOnlineUserCount(Math.floor(Math.random() * 100) + 50);
    
    // Update every 30 seconds with small variations
    const interval = setInterval(() => {
      setOnlineUserCount(prev => {
        // Random fluctuation between -5 and +5 users
        const change = Math.floor(Math.random() * 11) - 5;
        return Math.max(20, prev + change); // Ensure at least 20 users online
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Real-time simulation - occasionally show a toast when new users join
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      // 15% chance of showing a toast about a new user
      if (Math.random() < 0.15) {
        const randomNames = ["Jamie", "Alex", "Riley", "Jordan", "Taylor", "Casey", "Avery", "Quinn"];
        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
        
        toast({
          title: "New user online",
          description: `${randomName} just joined VibeChat`,
          duration: 3000,
        });
        
        // Also increase the online count
        setOnlineUserCount(prev => prev + 1);
      }
    }, 45000); // Check every 45 seconds
    
    return () => clearInterval(interval);
  }, [user, toast]);
  
  // Simulate finding a real partner through online users
  const startSearching = () => {
    setIsSearching(true);
    setPartner(null);
    setChatMessages([]);
    
    toast({
      title: "Looking for video partners",
      description: "Searching through online users...",
    });
    
    // Simulate finding a partner after a random time between 2-7 seconds
    const searchTime = Math.floor(Math.random() * 5000) + 2000;
    
    setTimeout(() => {
      // Simulate potential connection issues (20% chance of failing)
      if (Math.random() < 0.2) {
        toast({
          title: "Connection failed",
          description: "The user disconnected. Trying again...",
          variant: "destructive",
        });
        
        // Try again after a short delay
        setTimeout(() => {
          findPartner();
        }, 1500);
      } else {
        findPartner();
      }
    }, searchTime);
  };
  
  const findPartner = () => {
    // Generate realistic names with some diversity
    const names = [
      "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", 
      "Sophia", "Lucas", "Isabella", "Mason", "Mia", "Logan",
      "Zoe", "Jackson", "Lily", "Aiden", "Madison", "Carter",
      "Jamal", "Sofia", "Miguel", "Aisha", "Wei", "Priya",
      "Mohammed", "Fatima", "José", "Maria", "Hiroshi", "Jin"
    ];
    
    // Mock partner data
    const mockPartner = {
      id: `user-${Math.floor(Math.random() * 10000)}`,
      nickname: names[Math.floor(Math.random() * names.length)]
    };
    
    setPartner(mockPartner);
    setIsSearching(false);
    
    toast({
      title: "Partner found!",
      description: `You are now connected with ${mockPartner.nickname}`,
    });
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
      title: "Starting video chat",
      description: "Establishing secure connection...",
    });
    
    // Mock auto-accept after a short delay
    setTimeout(() => {
      toast({
        title: "Video chat started",
        description: `You're now video chatting with ${partner?.nickname}.`,
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
    
    // Mock response from partner after 1-3 seconds with higher chance
    if (partner && Math.random() > 0.1) {
      const responseTime = Math.floor(Math.random() * 2000) + 1000;
      
      setTimeout(() => {
        // More contextual responses
        const responses = [
          "Hey, nice to meet you!",
          "How's your day going?",
          "Where are you from?",
          "That's interesting!",
          "Cool! I'm new to this platform.",
          "I like your style!",
          "What brings you here today?",
          "I'm just checking out random chats.",
          "Have you been using this app for long?",
          "Do you do this often?",
          "Haha, that's funny!",
          "Sorry, I was adjusting my camera. What did you say?",
          "The video connection is pretty good today!",
          "I'm from Chicago, you?",
          "I've been using VibeChat for about a week now.",
          "Have you met any interesting people here?"
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
    onlineUserCount,
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
