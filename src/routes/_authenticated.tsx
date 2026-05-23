import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: Layout,
});

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-4 text-xs text-muted-foreground sm:px-6">
        <div className="flex items-center justify-between">
          <span>Brynier · Built for makers</span>
          <Link to="/templates" className="hover:text-foreground">Browse templates →</Link>
        </div>
      </footer>
    </div>
  );
}
