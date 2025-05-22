
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const ThemeSwitcher = () => {
  const { themeMode, toggleTheme } = useApp();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="rounded-full relative overflow-hidden transition-all duration-300 hover:bg-accent group"
    >
      <div className="relative transition-all duration-500 transform group-hover:rotate-12">
        {themeMode === "light" ? (
          <Moon className="h-5 w-5 animate-fade-in" />
        ) : (
          <Sun className="h-5 w-5 animate-fade-in" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeSwitcher;
