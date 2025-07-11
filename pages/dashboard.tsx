"use client";

import { useUser } from "../lib/auth";
import AvatarPreview from "../components/AvatarPreview";
import AvatarUpload from "../components/AvatarUpload";
import CertificateUpload from "../components/CertificateUpload";
import CertificateList from "../components/CertificateList";
import RatingForm from "../components/RatingForm"; // 👈 Importa el formulario

export default function Dashboard() {
  const { user } = useUser();

  if (!user) return <p className="p-4">Cargando usuario...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tu panel</h1>

      {/* Foto actual y subida */}
      <section className="mb-6">
        <AvatarPreview userId={user.id} />
        <AvatarUpload />
      </section>

      {/* Certificados */}
      <section className="mb-6">
        <CertificateUpload />
        <CertificateList userId={user.id} />
      </section>

      {/* Calificación de locatarios */}
      <section className="mb-6">
        <RatingForm />
      </section>
    </div>
  );
}
