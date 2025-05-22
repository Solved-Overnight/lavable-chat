
import React from "react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = "medium", 
  className = "",
  animated = false 
}) => {
  const sizeClasses = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-4xl",
  };
  
  return (
    <div className={`font-bold ${sizeClasses[size]} ${className} ${animated ? 'hover:scale-110 transition-transform duration-300' : ''}`}>
      <div className="relative inline-block group">
        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Vibe
        </span>
        {animated && (
          <div className="absolute -right-1 -top-1 flex">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-primary absolute animate-pulse"></span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
      </div>
      <span className="text-foreground relative ml-0.5">
        Chat
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 group-hover:w-full transition-all duration-300"></span>
      </span>
    </div>
  );
};

export default Logo;
