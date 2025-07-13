import { supabase } from "./supabase";

export async function getAvatarUrl(userId: string): Promise<string | null> {
  const possibleExtensions = ["jpg", "jpeg", "png", "webp"];

  for (const ext of possibleExtensions) {
    const filePath = `${userId}/avatar.${ext}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(filePath, 60); // URL válida por 60 segundos

    if (data?.signedUrl) {
      return data.signedUrl;
    }
  }

  return null; // No se encontró ninguna
}
