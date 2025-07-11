import { supabase } from "./supabase";

export async function getUserCertificates(userId: string) {
  const { data, error } = await supabase.storage
    .from("certificados")
    .list(userId, { limit: 10, sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    console.error("Error listando certificados:", error);
    return [];
  }

  const signedUrls = await Promise.all(
    data.map(async (file) => {
      const { data: signed, error } = await supabase.storage
        .from("certificados")
        .createSignedUrl(`${userId}/${file.name}`, 60 * 60);

      return {
        name: file.name,
        url: signed?.signedUrl || "#",
        error,
      };
    })
  );

  return signedUrls;
}
