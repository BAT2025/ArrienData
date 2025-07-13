"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";
import { Input } from "./ui/Input"; // ✅ corregido casing
import { Button } from "./ui/Button"; // ✅ corregido casing
import Toast from "./ui/Toast";

interface Locatario {
  user_id: string;
  full_name: string | null;
}

export default function RatingForm() {
  const { user } = useUser();
  const [locatarios, setLocatarios] = useState<Locatario[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [score, setScore] = useState(5);
  const [comentario, setComentario] = useState("");
  const [proceso, setProceso] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchLocatarios() {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .eq("rol", "locatario")
        .neq("user_id", user?.id);

      if (error) {
        console.error("Error cargando locatarios:", error);
      } else {
        setLocatarios(data as Locatario[]);
      }
    }

    if (user) fetchLocatarios();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    if (!user || !selectedId) {
      setStatus("error");
      setErrorMsg("Debe seleccionar un locatario.");
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
      setStatus("error");
      setErrorMsg("No se pudo guardar la calificación.");
    } else {
      setStatus("success");
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedId("");
    setScore(5);
    setComentario("");
    setProceso("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-xl shadow-md"
      noValidate
    >
      <h2 className="text-xl font-semibold text-gray-800">Registrar calificación</h2>

      {/* Locatario */}
      <div>
        <label htmlFor="locatario" className="block text-sm font-medium text-gray-700 mb-1">
          Selecciona locatario
        </label>
        <select
          id="locatario"
          required
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Selecciona un locatario --</option>
          {locatarios.map((loc) => (
            <option key={loc.user_id} value={loc.user_id}>
              {loc.full_name || loc.user_id}
            </option>
          ))}
        </select>
      </div>

      {/* Calificación */}
      <div>
        <label htmlFor="calificacion" className="block text-sm font-medium text-gray-700 mb-1">
          Calificación
        </label>
        <select
          id="calificacion"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={5}>⭐⭐⭐⭐⭐ (Excelente)</option>
          <option value={4}>⭐⭐⭐⭐ (Buena)</option>
          <option value={3}>⭐⭐⭐ (Aceptable)</option>
          <option value={2}>⭐⭐ (Regular)</option>
          <option value={1}>⭐ (Mala)</option>
        </select>
      </div>

      {/* Comentario */}
      <div>
        <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
          Comentario
        </label>
        <textarea
          id="comentario"
          className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Comentario sobre el comportamiento del locatario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
        />
      </div>

      {/* Proceso judicial */}
      <Input
        id="proceso"
        label="Número de proceso judicial (opcional)"
        placeholder="Ej. 25899-40-03-003-2023-00123-00"
        value={proceso}
        onChange={(e) => setProceso(e.target.value)}
        autoComplete="off"
      />

      {/* Error */}
      {status === "error" && <p className="text-red-500 text-sm">{errorMsg}</p>}

      {/* Botón */}
      <Button type="submit" className="w-full mt-2" variant="primary">
        Guardar calificación
      </Button>

      {/* Toast */}
      {status === "success" && <Toast message="✅ Calificación registrada con éxito." />}
    </form>
  );
}
