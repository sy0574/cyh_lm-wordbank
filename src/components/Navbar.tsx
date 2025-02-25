
import { Link } from "react-router-dom";
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
          <div className="ml-auto">
            <UserNav />
          </div>
        )}
      </div>
    </nav>
  );
}
