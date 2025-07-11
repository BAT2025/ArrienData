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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMensaje("");

    const { error } = await supabase
      .from("profiles")
      .upsert({
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
    <div className="space-y-4">
      <Input
        name="nombre"
        placeholder="Nombre completo"
        value={form.nombre}
        onChange={handleChange}
      />
      <Input
        name="documento"
        placeholder="Documento"
        value={form.documento}
        onChange={handleChange}
      />
      <Input
        name="direccion"
        placeholder="Dirección de notificación"
        value={form.direccion}
        onChange={handleChange}
      />
      <Input
        name="telefono"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
      />
      <select
        name="rol"
        className="w-full border rounded px-2 py-2"
        value={form.rol}
        onChange={handleChange}
      >
        <option value="propietario">Propietario / Arrendador</option>
        <option value="locatario">Locatario / Arrendatario</option>
      </select>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Guardando..." : "Guardar perfil"}
      </Button>

      {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
    </div>
  );
}
