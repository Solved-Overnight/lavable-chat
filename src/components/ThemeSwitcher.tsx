
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
      className="rounded-full relative overflow-hidden transition-all duration-500 hover:bg-accent group"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
      <div className="relative transition-all duration-500 transform group-hover:rotate-45">
        {themeMode === "light" ? (
          <Moon className="h-5 w-5 animate-fade-in" />
        ) : (
          <Sun className="h-5 w-5 animate-fade-in" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
      <span className="absolute -bottom-10 left-0 right-0 text-xs text-center text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:-bottom-6 transition-all duration-300">
        {themeMode === "light" ? "Dark" : "Light"}
      </span>
    </Button>
  );
};

export default ThemeSwitcher;
