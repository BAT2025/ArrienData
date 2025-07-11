"use client";

import { useEffect, useState } from "react";
import { getAvatarUrl } from "../lib/getAvatarUrl";

export default function AvatarPreview({ userId }: { userId: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadAvatar() {
      const url = await getAvatarUrl(userId);
      setAvatarUrl(url);
    }
    loadAvatar();
  }, [userId]);

  if (!avatarUrl) return <p>Cargando imagen...</p>;

  return (
    <img
      src={avatarUrl}
      alt="Avatar"
      className="w-24 h-24 rounded-full border shadow-md mb-4"
    />
  );
}
