
import React from "react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-4xl",
  };
  
  return (
    <div className={`font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-gradient">Vibe</span>
      <span>Chat</span>
    </div>
  );
};

export default Logo;
