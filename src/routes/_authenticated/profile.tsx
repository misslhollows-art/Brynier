import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — TinkerTrack" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("beginner");
  const [platforms, setPlatforms] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPath, setAvatarPath] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setEmail(u.user.email ?? "");
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      if (data) {
        setName(data.name ?? "");
        setSkill(data.skill_level ?? "beginner");
        setPlatforms((data.favorite_platforms ?? []).join(", "));
        setAvatarPath(data.avatar_url ?? "");
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!avatarPath) { setAvatarUrl(""); return; }
    supabase.storage.from("avatars").createSignedUrl(avatarPath, 3600).then(({ data }) => {
      if (data?.signedUrl) setAvatarUrl(data.signedUrl);
    });
  }, [avatarPath]);

  const onAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("You must be signed in.");
      const safeName = file.name.replace(/[^\w.\- ()[\]]+/g, "_");
      const path = `${u.user.id}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      setAvatarPath(path);
      const { error: profErr } = await supabase.from("profiles").upsert({
        id: u.user.id,
        avatar_url: path,
        updated_at: new Date().toISOString(),
      });
      if (profErr) throw profErr;
      toast.success("Avatar updated");
    } catch (err: any) {
      toast.error(err?.message ?? "Avatar upload failed");
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: u.user.id,
      name,
      avatar_url: avatarPath || null,
      skill_level: skill,
      favorite_platforms: platforms.split(",").map((s) => s.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    });
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Profile</h1>
      <form onSubmit={onSave} className="mt-8 space-y-5 rounded-xl border border-border bg-gradient-card p-6">
        <div className="space-y-2">
          <Label>Avatar</Label>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border border-border bg-muted">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <Input type="file" accept="image/*" disabled={avatarUploading} onChange={onAvatarPick} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={email} disabled />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="skill">Skill level</Label>
          <select id="skill" value={skill} onChange={(e) => setSkill(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="plats">Favorite platforms</Label>
          <Input id="plats" value={platforms} onChange={(e) => setPlatforms(e.target.value)} placeholder="ESP32, Arduino, Raspberry Pi" />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save changes</Button>
        </div>
      </form>

      <div className="mt-6 rounded-xl border border-border bg-gradient-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">Backup</p>
            <p className="mt-1 text-sm text-muted-foreground">Export your data as JSON for safekeeping.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/backup">Download backup</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
