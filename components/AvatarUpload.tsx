"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";
import Toast from "./ui/Toast";

export default function AvatarUpload() {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`; // ✅ Cambiado aquí

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError.message); // 👈 Para consola
      setError("Error subiendo avatar");
    } else {
      setShowToast(true);
    }

    setUploading(false);
  };

  return (
    <div className="my-4">
      <label className="block mb-2 font-medium">Foto de perfil</label>
      <input
        type="file"
        onChange={handleUpload}
        accept="image/*"
        className="block text-sm"
      />

      {uploading && <p className="text-blue-600 mt-2">Subiendo...</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {showToast && <Toast message="🖼️ Avatar actualizado con éxito." />}
    </div>
  );
}
