import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "../integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";

interface Profile {
  name: string;
  avatar: string | null;
}

export function UserNav() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('students')
            .select('name, avatar')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching profile:', error);
            toast({
              variant: "destructive",
              title: "Error fetching profile",
              description: error.message,
            });
            return;
          }

          if (data) {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error('Error in getProfile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: errorMessage,
        });
      }
    }

    getProfile();
  }, [toast]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: errorMessage,
      });
    }
  };

  if (!profile) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Username display */}
      <div className="hidden md:flex flex-col items-end">
        <span className="text-sm font-medium">{profile.name}</span>
        <span className="text-xs text-muted-foreground">Student</span>
      </div>
      
      {/* Avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/10 hover:bg-primary/5">
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${profile.name}`} alt={profile.name} />
              <AvatarFallback className="bg-primary/10 text-primary">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.name}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
