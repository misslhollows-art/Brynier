import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";

export type TemplateRow = Tables<"templates">;

export type TemplateLike = {
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  estimated_cost: number;
  components: { name: string; quantity: number; voltage?: string; notes?: string }[];
  wiring_notes: string;
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function asComponents(value: Json): TemplateLike["components"] {
  if (!Array.isArray(value)) return [];
  const out: TemplateLike["components"] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const obj = item as Record<string, unknown>;
    const name = typeof obj.name === "string" ? obj.name : "";
    const quantity = typeof obj.quantity === "number" ? obj.quantity : Number(obj.quantity);
    if (!name.trim()) continue;
    out.push({
      name: name.trim(),
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      voltage: typeof obj.voltage === "string" ? obj.voltage : undefined,
      notes: typeof obj.notes === "string" ? obj.notes : undefined,
    });
  }
  return out;
}

export function templateRowToTemplate(row: TemplateRow): TemplateLike {
  const difficulty = (row.difficulty ?? "beginner") as TemplateLike["difficulty"];
  const normalizedDifficulty = (difficulty === "beginner" || difficulty === "intermediate" || difficulty === "advanced")
    ? difficulty
    : "beginner";

  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    difficulty: normalizedDifficulty,
    tags: asStringArray(row.tags),
    estimated_cost: Number(row.estimated_cost ?? 0),
    components: asComponents(row.components),
    wiring_notes: row.wiring_notes ?? "",
  };
}

export async function listVisibleTemplates() {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as TemplateRow[];
}

export async function getTemplateBySlug(slug: string) {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as TemplateRow | null;
}

export async function createTemplate(args: Omit<TemplateRow, "id" | "created_at" | "updated_at" | "owner_user_id">) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("You must be signed in.");

  const { data, error } = await supabase
    .from("templates")
    .insert({ ...args, owner_user_id: u.user.id })
    .select("*")
    .single();

  if (error) throw error;
  return data as TemplateRow;
}

export async function updateTemplate(
  id: string,
  patch: Partial<Omit<TemplateRow, "id" | "created_at" | "owner_user_id">>,
) {
  const { data, error } = await supabase
    .from("templates")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data as TemplateRow;
}

export async function deleteTemplate(id: string) {
  const { error } = await supabase.from("templates").delete().eq("id", id);
  if (error) throw error;
}