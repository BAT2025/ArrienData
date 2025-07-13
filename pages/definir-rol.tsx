"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";
import Toast from "../components/ui/Toast";

export default function DefinirRolPage() {
  const { user } = useUser();
  const router = useRouter();

  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        setError("No se pudo obtener tu perfil.");
        setLoading(false);
        return;
      }

      if (data.rol) {
        router.push("/perfil"); // Ya tiene rol
      } else {
        setPerfil(data);
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [user]);

  const handleRolSeleccionado = async (rol: "arrendador" | "locatario") => {
    setLoading(true);
    setError("");
    const { error } = await supabase
      .from("profiles")
      .update({ rol })
      .eq("user_id", user.id);

    if (error) {
      setError("Error al asignar el rol.");
      setLoading(false);
    } else {
      setSuccessMessage("✅ Rol asignado correctamente. Redirigiendo...");
      setTimeout(() => {
        router.push("/perfil");
      }, 2000);
    }
  };

  if (!user || loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">¿Qué rol deseas asumir?</h1>
      <p className="text-gray-600 mb-6">
        Esto nos permitirá ofrecerte las funciones adecuadas.
      </p>

      <div className="space-y-4">
        <button
          onClick={() => handleRolSeleccionado("arrendador")}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Soy propietario (arrendador)
        </button>
        <button
          onClick={() => handleRolSeleccionado("locatario")}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Soy quien desea arrendar (locatario)
        </button>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {successMessage && <Toast message={successMessage} />}
    </div>
  );
}
