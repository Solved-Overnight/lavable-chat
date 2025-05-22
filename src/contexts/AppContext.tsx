
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { auth, database } from "@/lib/firebase";
import { 
  ref, 
  set, 
  onValue, 
  push, 
  remove, 
  update, 
  serverTimestamp, 
  onDisconnect 
} from "firebase/database";
import { 
  createUserWithEmailAndPassword, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

export type User = {
  id: string;
  nickname: string;
  isOnline?: boolean;
  lastActive?: number;
  status?: "available" | "busy" | "away";
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
  const [user, setUserState] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const { toast } = useToast();

  // Set user and register in Firebase
  const setUser = async (userData: User | null) => {
    if (userData) {
      try {
        // Sign in anonymously to Firebase
        const userCredential = await signInAnonymously(auth);
        const firebaseUserId = userCredential.user.uid;
        
        // Update user data with Firebase ID
        const updatedUser = {
          ...userData,
          id: firebaseUserId,
          isOnline: true,
          lastActive: Date.now(),
          status: "available" as const
        };

        // Add user to online users list in Firebase
        await set(ref(database, `users/${firebaseUserId}`), updatedUser);

        // Set up disconnect handling to automatically set offline status
        const userStatusRef = ref(database, `users/${firebaseUserId}`);
        await onDisconnect(userStatusRef).update({
          isOnline: false,
          lastActive: serverTimestamp(),
          status: "away"
        });

        // Update local state
        setUserState(updatedUser);
        
        toast({
          title: "Welcome to VibeChat!",
          description: "You are now online and ready to chat.",
        });
      } catch (error) {
        console.error("Error setting up user:", error);
        toast({
          title: "Error signing in",
          description: "There was a problem connecting to the chat service.",
          variant: "destructive",
        });
        setUserState(userData); // Fall back to offline mode
      }
    } else {
      // User is logging out, remove from Firebase
      if (user?.id) {
        try {
          await remove(ref(database, `users/${user.id}`));
          await signOut(auth);
        } catch (error) {
          console.error("Error signing out:", error);
        }
      }
      setUserState(null);
    }
  };

  // Monitor online users count
  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const onlineUsers = Object.values(usersData).filter((user: any) => user.isOnline);
        setOnlineUserCount(onlineUsers.length);
        
        // If a new user joins while you're online, show a toast
        if (user && onlineUsers.length > onlineUserCount && onlineUserCount > 0) {
          const newUsers = onlineUsers.filter((onlineUser: any) => 
            !onlineUser.lastActive || 
            Date.now() - onlineUser.lastActive < 5000
          );
          
          if (newUsers.length > 0) {
            const randomNewUser = newUsers[Math.floor(Math.random() * newUsers.length)] as any;
            if (randomNewUser.id !== user.id) {
              toast({
                title: "New user online",
                description: `${randomNewUser.nickname} just joined VibeChat`,
                duration: 3000,
              });
            }
          }
        }
      } else {
        setOnlineUserCount(0);
      }
    });
    
    return () => unsubscribe();
  }, [user, toast, onlineUserCount]);

  // Find a random partner from online users
  const startSearching = async () => {
    if (!user) return;
    
    setIsSearching(true);
    setPartner(null);
    setChatMessages([]);
    
    // Update user status to searching
    try {
      await update(ref(database, `users/${user.id}`), {
        status: "searching",
      });
      
      toast({
        title: "Looking for video partners",
        description: "Searching through online users...",
      });
      
      // Look for available partners
      findPartner();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error searching",
        description: "There was a problem finding chat partners.",
        variant: "destructive",
      });
      setIsSearching(false);
    }
  };
  
  const findPartner = async () => {
    if (!user) return;
    
    try {
      const usersRef = ref(database, 'users');
      const unsubscribe = onValue(usersRef, (snapshot) => {
        unsubscribe(); // Only need one snapshot
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const availableUsers = Object.values(usersData)
            .filter((userData: any) => 
              userData.id !== user.id && 
              userData.isOnline && 
              (userData.status === "available" || userData.status === "searching")
            );
          
          if (availableUsers.length > 0) {
            // Pick a random available user
            const randomIndex = Math.floor(Math.random() * availableUsers.length);
            const matchedPartner = availableUsers[randomIndex] as User;
            
            // Establish connection between users
            establishConnection(matchedPartner);
          } else {
            // No available users, continue searching
            setTimeout(() => {
              if (isSearching) {
                findPartner();
              }
            }, 3000);
          }
        } else {
          // No users found, try again in a few seconds
          setTimeout(() => {
            if (isSearching) {
              findPartner();
            }
          }, 3000);
        }
      });
    } catch (error) {
      console.error("Error finding partner:", error);
      // Try again after delay
      setTimeout(() => {
        if (isSearching) {
          findPartner();
        }
      }, 3000);
    }
  };
  
  const establishConnection = async (matchedPartner: User) => {
    if (!user) return;
    
    try {
      // Update both user statuses to busy
      await update(ref(database, `users/${user.id}`), { status: "busy" });
      await update(ref(database, `users/${matchedPartner.id}`), { status: "busy" });
      
      // Create a chat connection ID
      const connectionId = `${user.id.slice(0, 8)}_${matchedPartner.id.slice(0, 8)}_${Date.now()}`;
      
      // Create connection object
      const connectionData = {
        id: connectionId,
        participants: {
          [user.id]: true,
          [matchedPartner.id]: true
        },
        startedAt: serverTimestamp(),
        active: true
      };
      
      // Add connection to database
      await set(ref(database, `connections/${connectionId}`), connectionData);
      
      // Update local state
      setPartner(matchedPartner);
      setIsSearching(false);
      
      toast({
        title: "Partner found!",
        description: `You are now connected with ${matchedPartner.nickname}`,
      });
      
      // Listen for chat messages in this connection
      listenForMessages(connectionId);
      
    } catch (error) {
      console.error("Error establishing connection:", error);
      toast({
        title: "Connection failed",
        description: "Failed to establish connection with partner.",
        variant: "destructive",
      });
      setIsSearching(false);
    }
  };
  
  const listenForMessages = (connectionId: string) => {
    const messagesRef = ref(database, `messages/${connectionId}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        
        // Convert messages object to array
        const messagesList = Object.entries(messagesData).map(([msgId, msgData]) => ({
          id: msgId,
          ...(msgData as Omit<ChatMessage, 'id'>)
        }));
        
        // Sort by timestamp
        messagesList.sort((a: any, b: any) => a.timestamp - b.timestamp);
        
        // Update local state
        setChatMessages(messagesList as ChatMessage[]);
      }
    });
    
    // Clean up listener when component unmounts
    return unsubscribe;
  };
  
  const stopSearching = async () => {
    if (!user) return;
    
    setIsSearching(false);
    
    try {
      await update(ref(database, `users/${user.id}`), {
        status: "available",
      });
      
      toast({
        title: "Stopped searching",
        description: "You've stopped looking for a chat partner.",
      });
    } catch (error) {
      console.error("Error stopping search:", error);
    }
  };
  
  const sendChatRequest = async () => {
    if (!user || !partner) return;
    
    toast({
      title: "Starting video chat",
      description: "Establishing secure connection...",
    });
    
    // In a real app, this would initiate WebRTC connection
    // For demo, we're just simulating acceptance
    setTimeout(() => {
      toast({
        title: "Video chat started",
        description: `You're now video chatting with ${partner.nickname}.`,
      });
    }, 1000);
  };
  
  const sendMessage = async (text: string) => {
    if (!user || !partner || text.trim() === "") return;
    
    try {
      // Generate connection ID the same way we did in establishConnection
      const connectionId = `${user.id.slice(0, 8)}_${partner.id.slice(0, 8)}_${Date.now()}`;
      
      // Create message data
      const messageData = {
        senderId: user.id,
        text: text.trim(),
        timestamp: Date.now(),
      };
      
      // Add message to database
      const messagesRef = ref(database, `messages/${connectionId}`);
      await push(messagesRef, messageData);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message not sent",
        description: "There was a problem sending your message.",
        variant: "destructive",
      });
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
