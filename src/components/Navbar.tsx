
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { UserNav } from "./UserNav";

export function Navbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link
          to="/"
          className="mr-6 flex items-center space-x-2"
        >
          <span className="font-bold">WordBattle</span>
        </Link>
        
        {isAuthenticated && (
          <div className="flex flex-1">
            <Link
              to="/dashboard"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </div>
        )}

        {isAuthenticated && (
          <div className="ml-auto">
            <UserNav />
          </div>
        )}
      </div>
    </nav>
  );
}

