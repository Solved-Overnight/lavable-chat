
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

// Decorative shape component
const DecorativeShape = ({ className, type = "circle", animationClass = "" }) => (
  <div className={`shape ${className} shape-${type} ${animationClass} bg-primary/20`}></div>
);

// Gradient blob component
const GradientBlob = ({ className }) => (
  <div className={`gradient-blob ${className}`}></div>
);

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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative elements */}
      <DecorativeShape 
        className="shape-1 hidden md:block" 
        type="circle" 
        animationClass="animate-float"
      />
      <DecorativeShape 
        className="shape-2 hidden md:block" 
        type="square" 
        animationClass="animate-spin-slow"
      />
      <DecorativeShape 
        className="shape-3 hidden md:block" 
        type="triangle" 
        animationClass="animate-pulse-subtle"
      />
      
      {/* Gradient blobs */}
      <GradientBlob className="w-64 h-64 top-0 right-0 hidden md:block" />
      <GradientBlob className="w-80 h-80 bottom-0 left-0 hidden md:block" />
      
      {/* Header */}
      <header className="border-b py-3 px-6 flex justify-between items-center bg-background/80 backdrop-blur-sm z-10">
        <Logo size="medium" animated={true} />
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 transition-all duration-300 hover:shadow-md">
            <UserCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{user.nickname}</span>
          </div>
          <ThemeSwitcher />
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container py-6 max-w-5xl relative z-10 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-10rem)]">
          {/* Video area */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 grid grid-rows-2 gap-4">
              <VideoFrame 
                user={user} 
                isLocal={true} 
                isActive={!partner || isSearching}
                className="w-full h-full transition-all duration-500 hover:shadow-lg"
              />
              
              <VideoFrame 
                user={partner} 
                isActive={!!partner && !isSearching}
                className="w-full h-full transition-all duration-500 hover:shadow-lg"
              />
            </div>
            
            <div className="mt-4 flex justify-center gap-2">
              {!isSearching && !partner ? (
                <Button 
                  onClick={startSearching}
                  size="lg"
                  className="px-6 relative overflow-hidden group"
                >
                  <span className="relative z-10">Find a Chat Partner</span>
                  <span className="absolute inset-0 bg-primary/20 group-hover:animate-ripple"></span>
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
                    className="px-6 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Send Chat Request</span>
                    <span className="absolute inset-0 bg-primary/20 group-hover:animate-ripple"></span>
                  </Button>
                  
                  <Button 
                    onClick={startSearching}
                    variant="outline"
                    size="lg"
                    className="transition-all hover:border-primary"
                  >
                    Find New Partner
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Chat area */}
          <Card className="h-full transition-all duration-300 hover:shadow-md">
            <ChatBox />
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-3 px-6 text-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm z-10">
        &copy; {new Date().getFullYear()} VibeChat. All rights reserved.
      </footer>
    </div>
  );
};

export default ChatRoom;
