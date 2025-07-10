"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";

export default function CertificateUpload() {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    const filePath = `certificados/${user.id}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("certificados")
      .upload(filePath, file);

    if (uploadError) {
      setError("Error subiendo certificado");
    }

    setUploading(false);
  };

  return (
    <div>
      <label className="block mb-2">Certificado del inmueble (PDF)</label>
      <input type="file" onChange={handleUpload} accept="application/pdf" />
      {uploading && <p>Subiendo...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
