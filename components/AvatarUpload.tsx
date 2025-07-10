"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";

export default function AvatarUpload() {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setError("Error subiendo avatar");
    }

    setUploading(false);
  };

  return (
    <div>
      <label className="block mb-2">Foto de perfil</label>
      <input type="file" onChange={handleUpload} accept="image/*" />
      {uploading && <p>Subiendo...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
// This component allows users to upload an avatar image to Supabase storage.