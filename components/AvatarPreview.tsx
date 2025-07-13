"use client";

import { useEffect, useState } from "react";
import { getAvatarUrl } from "../lib/getAvatarUrl";
import { supabase } from "../lib/supabase";

export default function AvatarPreview({ userId }: { userId: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string>("Usuario");

  useEffect(() => {
    async function fetchAvatar() {
      // 🔐 Intenta obtener avatar firmado
      const url = await getAvatarUrl(userId);
      setAvatarUrl(url);

      // 👤 Obtiene nombre desde el perfil
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", userId)
        .single();

      if (data?.full_name) {
        setNombre(data.full_name);
      }
    }

    fetchAvatar();
  }, [userId]);

  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    nombre
  )}&background=random`;

  return (
    <img
      src={avatarUrl || fallbackUrl}
      alt="Avatar"
      className="w-24 h-24 rounded-full border shadow-md mb-4 object-cover"
    />
  );
}
