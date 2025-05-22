
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
    <div className={`font-bold ${sizeClasses[size]} ${className} ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}>
      <span className="text-gradient relative">
        Vibe
        {animated && (
          <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
        )}
      </span>
      <span>Chat</span>
    </div>
  );
};

export default Logo;
