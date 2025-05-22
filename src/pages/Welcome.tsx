
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useApp } from "@/contexts/AppContext";

const Welcome: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      setIsSubmitting(true);
      
      // Create a user with a random ID and the provided nickname
      setUser({
        id: `user-${Date.now()}`,
        nickname: nickname.trim(),
      });
      
      // Navigate to the chat page
      setTimeout(() => {
        navigate("/chat");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <Logo size="medium" />
        <ThemeSwitcher />
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent/10">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome to VibeChat</CardTitle>
              <CardDescription className="text-center">
                Connect with strangers through video chat
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="nickname" className="text-sm font-medium">
                    Choose a nickname
                  </label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    required
                    maxLength={20}
                    autoFocus
                    className="w-full"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!nickname.trim() || isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Start Chatting"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <p className="text-xs text-center text-muted-foreground px-4">
                By continuing, you agree to our Terms of Service and acknowledge that other users will be able to see you.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-3 px-6">
        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} VibeChat. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Welcome;
