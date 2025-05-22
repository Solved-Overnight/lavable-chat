
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import VideoFrame from "@/components/VideoFrame";
import ChatBox from "@/components/ChatBox";
import { useApp } from "@/contexts/AppContext";
import { UserCircle } from "lucide-react";

const ChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    partner, 
    isSearching, 
    startSearching, 
    stopSearching, 
    sendChatRequest 
  } = useApp();
  
  // If no user is set, redirect to welcome page
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  if (!user) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-3 px-6 flex justify-between items-center">
        <Logo size="medium" />
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1">
            <UserCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{user.nickname}</span>
          </div>
          <ThemeSwitcher />
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-10rem)]">
          {/* Video area */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 grid grid-rows-2 gap-4">
              <VideoFrame 
                user={user} 
                isLocal={true} 
                isActive={!partner || isSearching}
                className="w-full h-full"
              />
              
              <VideoFrame 
                user={partner} 
                isActive={!!partner && !isSearching}
                className="w-full h-full"
              />
            </div>
            
            <div className="mt-4 flex justify-center gap-2">
              {!isSearching && !partner ? (
                <Button 
                  onClick={startSearching}
                  size="lg"
                  className="px-6"
                >
                  Find a Chat Partner
                </Button>
              ) : isSearching ? (
                <Button 
                  onClick={stopSearching}
                  variant="outline"
                  size="lg"
                  className="px-6 animate-pulse-subtle"
                >
                  Cancel Search
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={sendChatRequest}
                    size="lg"
                    className="px-6"
                  >
                    Send Chat Request
                  </Button>
                  
                  <Button 
                    onClick={startSearching}
                    variant="outline"
                    size="lg"
                  >
                    Find New Partner
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Chat area */}
          <Card className="h-full">
            <ChatBox />
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-3 px-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} VibeChat. All rights reserved.
      </footer>
    </div>
  );
};

export default ChatRoom;
