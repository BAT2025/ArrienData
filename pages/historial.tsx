"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";
import { withAuth } from "@/lib/withAuth";

interface Calificacion {
  id: string;
  locatario_documento: string;
  estrellas: number;
  comentario: string;
  created_at: string;
}

function HistorialPage() {
  const { user } = useUser();
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCalificaciones = async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("propietario_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setCalificaciones(data);
      setLoading(false);
    };
    fetchCalificaciones();
  }, [user]);

  if (loading) return <p className="p-4">Cargando historial...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Calificaciones</h1>
      {calificaciones.length === 0 ? (
        <p>No has registrado calificaciones aún.</p>
      ) : (
        <ul className="space-y-4">
          {calificaciones.map((c) => (
            <li key={c.id} className="border p-4 rounded shadow">
              <p><strong>Documento:</strong> {c.locatario_documento}</p>
              <p><strong>Estrellas:</strong> {c.estrellas} ⭐</p>
              <p><strong>Observaciones:</strong> {c.comentario}</p>
              <p className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default withAuth(HistorialPage, { allowedRoles: ["arrendador"] });
