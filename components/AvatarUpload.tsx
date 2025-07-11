"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";
import Toast from "./ui/Toast"; // 👈 Asegúrate que la ruta sea correcta

export default function AvatarUpload() {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false); // 👈 Estado para mostrar el toast

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const filePath = `${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setError("Error subiendo avatar");
    } else {
      setShowToast(true); // ✅ Muestra toast si fue exitoso
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
