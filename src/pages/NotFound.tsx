
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6">
        <Logo size="medium" />
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, the page you were looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
