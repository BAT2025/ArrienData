"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Toast from "../components/ui/Toast";
import Spinner from "../components/ui/Spinner"; // si no lo tienes, puedes reemplazar con texto "Cargando..."

export default function Registrarse() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Crear perfil en tabla profiles
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: userId,
        full_name: fullName,
        email,
      });

      if (profileError) {
        setError("Ocurrió un error al crear tu perfil.");
        setLoading(false);
        return;
      }
    }

    setShowToast(true);

    setTimeout(() => {
      router.push("/ingresar"); // lo enviamos a iniciar sesión
    }, 2500);
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
      <h1 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          required
          placeholder="Nombre completo"
          className="w-full border px-3 py-2 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">ó</div>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Redirigiendo..." : "Registrarse con Google"}
      </button>

      <p className="mt-4 text-sm text-center">
        ¿Ya tienes cuenta?{" "}
        <a href="/ingresar" className="text-blue-600 hover:underline">
          Inicia sesión
        </a>
      </p>

      {showToast && (
        <Toast message="🎉 Registro exitoso. Revisa tu correo para confirmar tu cuenta." />
      )}
    </div>
  );
}
