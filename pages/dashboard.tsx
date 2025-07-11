"use client";

import { useUser } from "../lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AvatarPreview from "../components/AvatarPreview";
import AvatarUpload from "../components/AvatarUpload";
import CertificateUpload from "../components/CertificateUpload";
import CertificateList from "../components/CertificateList";
import RatingForm from "../components/RatingForm";

export default function Dashboard() {
  const { user } = useUser();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchPerfil = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setPerfil(data);
      setLoading(false);
    };
    fetchPerfil();
  }, [user]);

  if (!user || loading) return <p className="p-4">Cargando panel...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Tu panel</h1>

      {/* Rol del usuario */}
      {perfil?.rol && (
        <div className="mb-4 text-gray-700 flex items-center justify-center gap-2">
          {perfil.rol === "arrendador" ? (
            <>
              <span className="text-blue-600">👤 Arrendador</span>
              <span className="text-sm text-gray-500">(Puedes calificar locatarios y subir certificados)</span>
            </>
          ) : (
            <>
              <span className="text-green-600">🏠 Locatario</span>
              <span className="text-sm text-gray-500">(Tu comportamiento será calificado por los arrendadores)</span>
            </>
          )}
        </div>
      )}

      {/* Avatar y subida */}
      <section className="mb-6">
        <AvatarPreview userId={user.id} />
        <AvatarUpload />
      </section>

      {/* Si es arrendador, muestra certificados y calificación */}
      {perfil?.rol === "arrendador" && (
        <>
          <section className="mb-6">
            <CertificateUpload />
            <CertificateList userId={user.id} />
          </section>

          <section className="mb-6">
            <RatingForm />
          </section>
        </>
      )}

      {/* Si es locatario, puede mostrar solo sus certificados si quieres */}
      {perfil?.rol === "locatario" && (
        <section className="mb-6">
          <CertificateList userId={user.id} />
        </section>
      )}
    </div>
  );
}
