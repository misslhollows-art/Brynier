import { createServerFn } from "@tanstack/react-start";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const inputSchema = z.object({
  projectId: z.string().uuid(),
  question: z.string().min(1).max(4000),
});

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Load project context
    const [{ data: project }, { data: components }, { data: journal }, { data: history }, { data: codeFiles }] =
      await Promise.all([
        supabase.from("projects").select("*").eq("id", data.projectId).maybeSingle(),
        supabase.from("components").select("name,quantity,voltage,notes").eq("project_id", data.projectId),
        supabase.from("journal_entries").select("entry,created_at").eq("project_id", data.projectId).order("created_at", { ascending: false }).limit(10),
        supabase.from("ai_messages").select("role,content").eq("project_id", data.projectId).order("created_at", { ascending: true }).limit(20),
        supabase
          .from("project_files")
          .select("storage_path,file_name,size_bytes,mime_type")
          .eq("project_id", data.projectId)
          .eq("file_type", "code")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    if (!project) throw new Error("Project not found");

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-2.5-flash");

    // Best-effort: include small uploaded code/text files (snippets only).
    const codeSnippets: { name: string; snippet: string }[] = [];
    const maxSnippetChars = 2000;
    const maxDownloadBytes = 100 * 1024; // keep serverFn fast and predictable
    for (const f of codeFiles ?? []) {
      if (!f?.storage_path || !f.file_name) continue;
      if ((f.size_bytes ?? 0) > maxDownloadBytes) continue;
      try {
        const { data: blob, error } = await supabase.storage.from("project-media").download(f.storage_path);
        if (error || !blob) continue;
        const text = await (blob as any).text?.();
        if (typeof text !== "string" || text.trim().length === 0) continue;
        codeSnippets.push({
          name: f.file_name,
          snippet: text.length > maxSnippetChars ? text.slice(0, maxSnippetChars) + "\n...(truncated)" : text,
        });
      } catch {
        // Ignore file read errors; AI still works with the rest of the project context.
      }
    }

    const projectCtx = `
PROJECT: ${project.title}
STATUS: ${project.status} | DIFFICULTY: ${project.difficulty}
DESCRIPTION: ${project.description || "(none)"}
TAGS: ${(project.tags || []).join(", ") || "(none)"}

COMPONENTS:
${(components || []).map((c) => `- ${c.quantity}x ${c.name}${c.voltage ? ` (${c.voltage})` : ""}${c.notes ? ` - ${c.notes}` : ""}`).join("\n") || "(none)"}

WIRING NOTES:
${project.wiring_notes || "(none)"}

CODE/NOTES FILES (SNIPPETS):
${codeSnippets.length ? codeSnippets.map((s) => `- ${s.name}\n${s.snippet}`).join("\n\n") : "(none)"}

RECENT JOURNAL:
${(journal || []).map((j) => `- ${j.entry}`).join("\n") || "(none)"}
`.trim();

    const systemPrompt = `You are TinkerTrack's electronics co-pilot. You help DIY makers debug, choose components, calculate values (resistors, current, voltage dividers), and reason about circuits.

Be concise, practical, and safety-aware.

Rules:
- Ask 1-3 clarifying questions if key info is missing (board, power source, voltages, wiring, error messages).
- Prefer actionable steps and quick checks (what to measure with a multimeter, what to swap, what to isolate).
- If the topic involves mains/high voltage, warn clearly and avoid step-by-step instructions that could cause harm.
- If unsure, say what assumption you're making.

When relevant, give exact pin numbers, resistor values, and wiring suggestions. Use the project context below.

${projectCtx}`;

    const messages = [
      ...(history || []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: data.question },
    ];

    const { text } = await generateText({
      model,
      system: systemPrompt,
      messages,
    });

    // Persist both messages
    await supabase.from("ai_messages").insert([
      { project_id: data.projectId, user_id: userId, role: "user", content: data.question },
      { project_id: data.projectId, user_id: userId, role: "assistant", content: text },
    ]);

    return { answer: text };
  });
