
import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { User } from "@/contexts/AppContext";
import { Camera, CameraOff, Mic, MicOff, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoFrameProps {
  user: User | null;
  isLocal?: boolean;
  isActive?: boolean;
  showControls?: boolean;
  className?: string;
}

const VideoFrame: React.FC<VideoFrameProps> = ({
  user,
  isLocal = false,
  isActive = false,
  showControls = true,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(isLocal); // Local video is muted by default
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(!isLocal && !!user);
  
  // In a real app, this would be handling WebRTC connections
  useEffect(() => {
    if (isLocal && navigator.mediaDevices) {
      // For demo purposes, we'll just show the local camera if available
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasVideo(true);
          }
        })
        .catch((err) => {
          console.error("Error accessing media devices:", err);
          setHasVideo(false);
        });
        
      return () => {
        // Clean up the stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    } else if (!isLocal && user) {
      // Simulate remote connection
      setIsConnecting(true);
      
      // For demo purposes, we're simulating a connection delay
      const timer = setTimeout(() => {
        setIsConnecting(false);
        
        // 70% chance of having video for remote users
        if (Math.random() > 0.3) {
          setHasVideo(true);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLocal, user]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTracks = (videoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted; // Toggle the current state
      });
    }
  };
  
  const toggleVideo = () => {
    setIsVideoEnabled((prev) => !prev);
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTracks = (videoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled; // Toggle the current state
      });
    }
  };
  
  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300 bg-gradient-to-br from-secondary/30 to-accent/30",
        isActive ? "border-2 border-primary shadow-lg shadow-primary/20" : "border border-border",
        className
      )}
    >
      {hasVideo && isVideoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/30 backdrop-blur-sm">
          {isConnecting ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-primary/40 animate-pulse"></div>
              </div>
              <p className="text-sm text-muted-foreground">Connecting...</p>
            </div>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center animate-pulse-subtle">
                <UserCircle className="w-20 h-20 text-muted-foreground" />
              </div>
              <p className="mt-4 text-base font-medium text-foreground">
                {user?.nickname || "Anonymous"} {isLocal ? "(You)" : ""}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLocal ? "Camera off" : "Video unavailable"}
              </p>
            </>
          )}
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium px-2 text-white">
            {user?.nickname || "Anonymous"} {isLocal ? "(You)" : ""}
          </span>
          
          {showControls && (
            <div className="flex space-x-3">
              <Button
                onClick={toggleMute}
                size="icon"
                variant={isMuted ? "destructive" : "secondary"}
                className="h-8 w-8 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={toggleVideo}
                size="icon"
                variant={isVideoEnabled ? "secondary" : "destructive"}
                className="h-8 w-8 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                {isVideoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isActive && (
        <div className="absolute top-2 left-2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-lg animate-pulse-subtle">
          {isLocal ? "Broadcasting" : "Connected"}
        </div>
      )}
    </div>
  );
};

export default VideoFrame;
