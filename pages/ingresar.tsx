"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Toast from "../components/ui/Toast"; // 👈 Importa el toast

export default function IngresarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false); // 👈 Estado para mostrar toast
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setErrorMsg("⚠️ Tu correo aún no está confirmado. Revisa tu bandeja de entrada o spam.");
      } else {
        setErrorMsg("❌ Credenciales incorrectas. Intenta nuevamente.");
      }
      return;
    }

    setShowToast(true); // 👈 Mostrar toast
    setTimeout(() => {
      router.push("/perfil");
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ingresar</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Correo electrónico"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          required
          placeholder="Contraseña"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && (
          <p className="text-red-600 text-sm">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        ¿No tienes cuenta?{" "}
        <a href="/registrarse" className="text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>

      {showToast && <Toast message="¡Bienvenido de nuevo! 🎉" />} {/* 👈 Aquí se muestra */}
    </div>
  );
}
