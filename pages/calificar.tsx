// pages/calificar.tsx
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";

export default function Calificar() {
  const { user } = useUser();
  const [documento, setDocumento] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("ratings").insert({
      propietario_id: user.id,
      locatario_documento: documento,
      estrellas,
      comentario,
    });

    if (error) setMensaje("Error guardando calificación");
    else setMensaje("Calificación registrada correctamente");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calificar locatario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Número de documento del locatario</label>
          <input type="text" className="w-full border px-2 py-1" value={documento} onChange={(e) => setDocumento(e.target.value)} />
        </div>

        <div>
          <label className="block">Calificación (1 a 5)</label>
          <input type="number" min={1} max={5} className="w-full border px-2 py-1" value={estrellas} onChange={(e) => setEstrellas(Number(e.target.value))} />
        </div>

        <div>
          <label className="block">Observaciones</label>
          <textarea className="w-full border px-2 py-1" value={comentario} onChange={(e) => setComentario(e.target.value)} />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar calificación
        </button>

        {mensaje && <p className="text-sm text-green-600 mt-2">{mensaje}</p>}
      </form>
    </div>
  );
}
