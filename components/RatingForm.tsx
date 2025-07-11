"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";
import Toast from "./ui/Toast";

export default function RatingForm() {
  const { user } = useUser();
  const [locatarios, setLocatarios] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [score, setScore] = useState(5);
  const [comentario, setComentario] = useState("");
  const [proceso, setProceso] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Consultar locatarios con rol específico
  useEffect(() => {
    async function fetchLocatarios() {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .eq("rol", "locatario") // ✅ Solo locatarios
        .neq("user_id", user?.id); // Excluir al arrendador mismo

      if (error) {
        console.error("Error cargando locatarios:", error);
      } else {
        setLocatarios(data);
      }
    }

    if (user) fetchLocatarios();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user || !selectedId) {
      setError("Debe seleccionar un locatario.");
      return;
    }

    const { error: insertError } = await supabase.from("ratings").insert([
      {
        arrendador_id: user.id,
        arrendatario_id: selectedId,
        score,
        comentario,
        proceso_judicial: proceso || null,
        fecha: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      setError("No se pudo guardar la calificación.");
    } else {
      setShowToast(true);
      setSelectedId("");
      setScore(5);
      setComentario("");
      setProceso("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold">Registrar calificación</h2>

      <label className="block text-sm font-medium">Selecciona locatario</label>
      <select
        required
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">-- Selecciona un locatario --</option>
        {locatarios.map((loc) => (
          <option key={loc.user_id} value={loc.user_id}>
            {loc.full_name || loc.user_id}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium">Calificación</label>
      <select
        value={score}
        onChange={(e) => setScore(Number(e.target.value))}
        className="w-full border px-3 py-2 rounded"
      >
        <option value={5}>⭐⭐⭐⭐⭐ (Excelente)</option>
        <option value={4}>⭐⭐⭐⭐ (Buena)</option>
        <option value={3}>⭐⭐⭐ (Aceptable)</option>
        <option value={2}>⭐⭐ (Regular)</option>
        <option value={1}>⭐ (Mala)</option>
      </select>

      <textarea
        className="w-full border px-3 py-2 rounded"
        placeholder="Comentario sobre el comportamiento del locatario"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={3}
      />

      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Número de proceso judicial (opcional)"
        value={proceso}
        onChange={(e) => setProceso(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Guardar calificación
      </button>

      {showToast && <Toast message="✅ Calificación registrada con éxito." />}
    </form>
  );
}
