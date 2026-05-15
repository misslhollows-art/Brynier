import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const exportMyData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [
      { data: profile, error: profileErr },
      { data: projects, error: projectsErr },
      { data: components, error: componentsErr },
      { data: journal_entries, error: journalErr },
      { data: project_files, error: filesErr },
      { data: ai_messages, error: aiErr },
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("projects").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("components").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("journal_entries").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("project_files").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("ai_messages").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    ]);

    const firstError = profileErr || projectsErr || componentsErr || journalErr || filesErr || aiErr;
    if (firstError) throw firstError;

    return {
      exported_at: new Date().toISOString(),
      profile,
      projects: projects ?? [],
      components: components ?? [],
      journal_entries: journal_entries ?? [],
      project_files: project_files ?? [],
      ai_messages: ai_messages ?? [],
    };
  });

