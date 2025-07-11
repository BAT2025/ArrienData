"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Toast from "../components/ui/Toast"; // 👈 Importa el componente Toast

export default function Registrarse() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false); // 👈 Estado para mostrar el toast
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setShowToast(true); // 👈 Muestra el toast
      setTimeout(() => {
        router.push("/perfil");
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          className="w-full border px-2 py-1"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border px-2 py-1"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
      </form>

      {/* 👇 Renderiza el toast si está activo */}
      {showToast && (
        <Toast message="🎉 Registro exitoso. ¡Bienvenido a ArrienData!" />
      )}
    </div>
  );
}
