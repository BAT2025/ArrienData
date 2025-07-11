"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";
import Toast from "./ui/Toast"; // 👈 Asegúrate que la ruta esté bien

export default function CertificateUpload() {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false); // 👈 Estado para mostrar el toast

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    const timestamp = Date.now();
    const filePath = `${user.id}/${timestamp}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("certificados")
      .upload(filePath, file);

    if (uploadError) {
      setError("Error subiendo certificado");
    } else {
      setShowToast(true); // 👈 Muestra el toast de éxito
    }

    setUploading(false);
  };

  return (
    <div className="my-4">
      <label className="block mb-2 font-medium">Certificado del inmueble (PDF)</label>
      <input
        type="file"
        onChange={handleUpload}
        accept="application/pdf"
        className="block text-sm"
      />

      {uploading && <p className="text-blue-600 mt-2">Subiendo...</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {showToast && <Toast message="📄 Certificado subido con éxito." />}
    </div>
  );
}
