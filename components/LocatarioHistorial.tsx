"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";

export default function LocatarioHistorial() {
  const [locatarios, setLocatarios] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [historial, setHistorial] = useState<any[]>([]);
  const [promedio, setPromedio] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uniqueOwners, setUniqueOwners] = useState<number>(0);

  useEffect(() => {
    const fetchLocatarios = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name");

      if (!error && data) setLocatarios(data);
    };
    fetchLocatarios();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setHistorial([]);
      setPromedio(null);
      setUniqueOwners(0);
      return;
    }

    const fetchHistorial = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("ratings")
        .select("score, comentario, proceso_judicial, fecha, arrendador_id")
        .eq("arrendatario_id", selectedId)
        .order("fecha", { ascending: false });

      if (!error && data) {
        setHistorial(data);

        const suma = data.reduce((acc, r) => acc + r.score, 0);
        setPromedio(data.length ? suma / data.length : null);

        const arrendadoresUnicos = new Set(data.map(r => r.arrendador_id));
        setUniqueOwners(arrendadoresUnicos.size);
      }

      setLoading(false);
    };

    fetchHistorial();
  }, [selectedId]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Historial de calificaciones del locatario", 20, 20);

    doc.setFontSize(11);
    doc.text(`ID del locatario: ${selectedId}`, 20, 30);
    doc.text(`Total calificaciones: ${historial.length}`, 20, 38);
    doc.text(`Promedio: ${promedio?.toFixed(2) || "N/A"}`, 20, 46);
    doc.text(`Arrendadores únicos: ${uniqueOwners}`, 20, 54);

    let y = 65;

    historial.forEach((item, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(`${i + 1}. ${item.fecha?.split("T")[0]} - ⭐ ${item.score}`, 20, y);
      y += 6;

      doc.text(`Comentario: ${item.comentario || "Sin comentarios"}`, 22, y);
      y += 6;

      if (item.proceso_judicial) {
        doc.text(`⚖️ Proceso: ${item.proceso_judicial}`, 22, y);
        y += 6;
      }

      y += 4;
    });

    doc.save("historial_locatario.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Historial del locatario</h2>

      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      >
        <option value="">-- Selecciona un locatario --</option>
        {locatarios.map((loc) => (
          <option key={loc.user_id} value={loc.user_id}>
            {loc.full_name || loc.user_id}
          </option>
        ))}
      </select>

      {loading && <p>Cargando historial...</p>}

      {selectedId && !loading && (
        <>
          <p className="text-sm text-gray-600">
            Calificaciones: <strong>{historial.length}</strong> — Promedio:{" "}
            <strong>{promedio?.toFixed(2) || "N/A"}</strong> — Arrendadores únicos:{" "}
            <strong>{uniqueOwners}</strong>
          </p>

          <button
            onClick={handleExportPDF}
            className="mt-3 mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📄 Descargar historial PDF
          </button>

          {historial.length === 0 ? (
            <p className="text-gray-500">No hay calificaciones aún.</p>
          ) : (
            <ul className="space-y-4">
              {historial.map((item, i) => (
                <li key={i} className="border p-3 rounded bg-gray-50">
                  <p className="text-sm">
                    ⭐ <strong>{item.score}</strong> —{" "}
                    <span className="text-gray-600">{item.fecha?.split("T")[0]}</span>
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    {item.comentario}
                  </p>
                  {item.proceso_judicial && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚖️ Proceso judicial: {item.proceso_judicial}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
