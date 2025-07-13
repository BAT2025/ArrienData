"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Toast from "../components/ui/Toast";

export default function Ingresar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
    } else {
      setShowToast(true);
      setTimeout(() => {
        router.push("/perfil");
      }, 2000);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setError("Error al iniciar sesión con Google.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>

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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">ó</div>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Redirigiendo..." : "Ingresar con Google"}
      </button>

      <p className="mt-4 text-sm text-center">
        ¿Aún no tienes cuenta?{" "}
        <a href="/registrarse" className="text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>

      {showToast && (
        <Toast message="✅ Sesión iniciada correctamente. Redirigiendo..." />
      )}
    </div>
  );
}
