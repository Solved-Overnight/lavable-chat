
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
    setIsMuted(!isMuted);
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTracks = (videoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted; // Toggle the current state
      });
    }
  };
  
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
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
        "relative rounded-xl overflow-hidden transition-all duration-300",
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/30">
          {isConnecting ? (
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/40"></div>
              </div>
              <p className="text-sm text-muted-foreground">Connecting...</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <UserCircle className="w-16 h-16 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                {user?.nickname || "Anonymous"} {isLocal ? "(You)" : ""}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isLocal ? "Camera off" : "Video unavailable"}
              </p>
            </>
          )}
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium px-2 text-white">
            {user?.nickname || "Anonymous"} {isLocal ? "(You)" : ""}
          </span>
          
          {showControls && hasVideo && (
            <div className="flex space-x-2">
              <Button
                onClick={toggleMute}
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-black/50 hover:bg-primary hover:text-primary-foreground"
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={toggleVideo}
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-black/50 hover:bg-primary hover:text-primary-foreground"
              >
                {isVideoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isActive && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full animate-pulse">
          {isLocal ? "Broadcasting" : "Connected"}
        </div>
      )}
    </div>
  );
};

export default VideoFrame;
