
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import VideoFrame from "@/components/VideoFrame";
import ChatBox from "@/components/ChatBox";
import { useApp } from "@/contexts/AppContext";
import { UserCircle, Video, MessageSquare, X } from "lucide-react";

// Decorative shape component
const DecorativeShape = ({ className, type = "circle", animationClass = "" }) => (
  <div className={`shape ${className} shape-${type} ${animationClass} bg-primary/20`}></div>
);

// Gradient blob component
const GradientBlob = ({ className }) => (
  <div className={`gradient-blob ${className}`}></div>
);

// Online user indicator component
const OnlineIndicator = ({ count }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full backdrop-blur-sm">
    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
    <span className="text-xs font-medium">{count} online</span>
  </div>
);

const ChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    partner, 
    isSearching, 
    startSearching, 
    stopSearching, 
    sendChatRequest,
    onlineUserCount 
  } = useApp();
  
  const [showChat, setShowChat] = useState(false);
  const [fullscreenVideo, setFullscreenVideo] = useState(false);
  
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
        
        <div className="flex items-center gap-3">
          <OnlineIndicator count={onlineUserCount} />
          
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 transition-all duration-300 hover:shadow-md">
            <UserCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{user.nickname}</span>
          </div>
          
          <ThemeSwitcher />
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container py-6 max-w-5xl relative z-10 animate-fade-in">
        <div className={`grid ${fullscreenVideo || !showChat ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3 gap-4'} h-[calc(100vh-10rem)]`}>
          {/* Video area */}
          <div className={`${fullscreenVideo || !showChat ? 'col-span-full' : 'lg:col-span-2'} flex flex-col relative`}>
            <div className="absolute top-2 right-2 z-20 flex gap-2">
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={() => setFullscreenVideo(!fullscreenVideo)}
                className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90"
              >
                <Video className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={() => setShowChat(!showChat)}
                className={`rounded-full ${showChat ? 'bg-primary text-primary-foreground' : 'bg-background/70'} backdrop-blur-sm`}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>

            <div className={`flex-1 grid ${partner && !isSearching ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
              <VideoFrame 
                user={user} 
                isLocal={true} 
                isActive={!partner || isSearching}
                className={`w-full h-full transition-all duration-500 hover:shadow-lg ${partner && !isSearching ? 'md:order-2' : ''}`}
              />
              
              {(partner || isSearching) && (
                <VideoFrame 
                  user={partner} 
                  isActive={!!partner && !isSearching}
                  className="w-full h-full transition-all duration-500 hover:shadow-lg"
                />
              )}
            </div>
            
            <div className="mt-4 flex justify-center gap-2">
              {!isSearching && !partner ? (
                <Button 
                  onClick={startSearching}
                  size="lg"
                  className="px-6 relative overflow-hidden group animate-pulse-subtle"
                >
                  <span className="relative z-10">Find a Random Partner</span>
                  <span className="absolute inset-0 bg-primary/20 group-hover:animate-ripple"></span>
                </Button>
              ) : isSearching ? (
                <Button 
                  onClick={stopSearching}
                  variant="outline"
                  size="lg"
                  className="px-6 animate-pulse"
                >
                  <span className="animate-pulse mr-2">●</span>
                  Searching for someone interesting...
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={sendChatRequest}
                    size="lg"
                    className="px-6 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Start Video Chat</span>
                    <span className="absolute inset-0 bg-primary/20 group-hover:animate-ripple"></span>
                  </Button>
                  
                  <Button 
                    onClick={startSearching}
                    variant="outline"
                    size="lg"
                    className="transition-all hover:border-primary"
                  >
                    Find Someone New
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Chat area */}
          {showChat && !fullscreenVideo && (
            <Card className="h-full transition-all duration-300 hover:shadow-md relative">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChat(false)}
                  className="h-6 w-6 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ChatBox />
            </Card>
          )}
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
