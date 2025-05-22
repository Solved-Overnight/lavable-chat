
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { User } from "@/contexts/AppContext";
import { Camera, CameraOff, UserCircle } from "lucide-react";

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
  const [hasVideo, setHasVideo] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(isLocal); // Local video is muted by default
  
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
      // For demo purposes, we're not actually showing partner video
      // In a real app, this would connect to the partner's WebRTC stream
      setHasVideo(false);
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
  
  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden bg-secondary/50 transition-all",
        isActive ? "border-2 border-primary" : "border border-border",
        className
      )}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30">
          <UserCircle className="w-16 h-16 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isLocal ? "Camera not available" : "Waiting for video..."}
          </p>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium px-2">
            {user?.nickname || "Anonymous"} {isLocal ? "(You)" : ""}
          </span>
          
          {showControls && (
            <div className="flex space-x-1">
              <button
                onClick={toggleMute}
                className="p-1 rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                {hasVideo ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoFrame;
