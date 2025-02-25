
import { Link, useNavigate } from "react-router-dom";
import { UserNav } from "./UserNav";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

export function Navbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2"
        >
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            WordBattle
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
              >
                Log in
              </Button>
              <Button
                onClick={() => navigate("/auth?signup=true")}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign up
              </Button>
            </>
          ) : (
            <UserNav />
          )}
        </div>
      </div>
    </nav>
  );
}
