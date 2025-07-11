import { supabase } from "./supabase";

export async function getAvatarUrl(userId: string): Promise<string | null> {
  const { data } = await supabase.storage
    .from("avatars")
    .getPublicUrl(`${userId}/avatar.png`);

  return data?.publicUrl ?? null;
}
