import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          {!loading && user ? (
            <>
              <Link to="/dashboard" className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground sm:inline-block" activeProps={{ className: "text-foreground" }}>
                Dashboard
              </Link>
              <Link to="/projects" className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground sm:inline-block" activeProps={{ className: "text-foreground" }}>
                Projects
              </Link>
              <Link to="/templates" className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground sm:inline-block" activeProps={{ className: "text-foreground" }}>
                Templates
              </Link>
              <Link to="/profile" className="ml-1 rounded-md p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground" aria-label="Profile">
                <User className="h-4 w-4" />
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : !loading ? (
            <>
              <Link to="/login" search={{ redirect: "/dashboard" }} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground">
                Sign in
              </Link>
              <Button asChild size="sm">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
