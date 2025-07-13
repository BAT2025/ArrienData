"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function ProfileForm({ existingData }: { existingData: any }) {
  const { user } = useUser();
  const [form, setForm] = useState({
    nombre: existingData?.nombre || "",
    documento: existingData?.documento || "",
    direccion: existingData?.direccion || "",
    telefono: existingData?.telefono || "",
    rol: existingData?.rol || "propietario",
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMensaje("");

    const { error } = await supabase.from("profiles").upsert({
      user_id: user?.id,
      ...form,
    });

    if (error) {
      console.error("Error al guardar:", error);
      setMensaje("❌ Hubo un error al guardar.");
    } else {
      setMensaje("✅ Perfil guardado exitosamente.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Mi perfil</h2>

      <Input
        label="Nombre completo"
        name="nombre"
        placeholder="Ej: Juan Pérez"
        value={form.nombre}
        onChange={handleChange}
      />

      <Input
        label="Documento"
        name="documento"
        placeholder="Ej: 123456789"
        value={form.documento}
        onChange={handleChange}
      />

      <Input
        label="Dirección"
        name="direccion"
        placeholder="Ej: Calle 123 #45-67"
        value={form.direccion}
        onChange={handleChange}
      />

      <Input
        label="Teléfono"
        name="telefono"
        placeholder="Ej: 3001234567"
        value={form.telefono}
        onChange={handleChange}
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Rol
        </label>
        <select
          name="rol"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.rol}
          onChange={handleChange}
        >
          <option value="propietario">Propietario / Arrendador</option>
          <option value="locatario">Locatario / Arrendatario</option>
        </select>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        variant="primary"
        className="w-full"
      >
        {loading ? "Guardando..." : "Guardar perfil"}
      </Button>

      {mensaje && (
        <p
          className={`text-sm text-center ${
            mensaje.includes("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}
