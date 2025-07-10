"use client";

import { useState } from "react";
import AvatarUpload from "./AvatarUpload";
import CertificateUpload from "./CertificateUpload";

export default function ProfileForm({ existingData }: { existingData: any }) {
  const [tipo, setTipo] = useState(existingData?.tipo ?? "propietario");
  const [nombre, setNombre] = useState(existingData?.nombre ?? "");
  const [direccion, setDireccion] = useState(existingData?.direccion ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Perfil guardado:", { tipo, nombre, direccion });
    // Aquí puedes guardar en Supabase
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Perfil del usuario</h2>

      <label className="block">Tipo de usuario:</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border p-1">
        <option value="propietario">Propietario</option>
        <option value="locatario">Locatario</option>
      </select>

      <div>
        <label className="block">Nombre completo</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border px-2 py-1" />
      </div>

      <div>
        <label className="block">Dirección de notificación</label>
        <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full border px-2 py-1" />
      </div>

      <AvatarUpload />
      <CertificateUpload />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Guardar perfil
      </button>
    </form>
  );
}
