"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function IngresarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setErrorMsg("⚠️ Tu correo aún no está confirmado.");
      } else {
        setErrorMsg("❌ Credenciales incorrectas.");
      }
      return;
    }

    router.push("/perfil");
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

      {/* ✅ Enlace al registro */}
      <p className="mt-4 text-sm text-center">
        ¿No tienes cuenta?{" "}
        <a href="/registrarse" className="text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}
