"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import Toast from "../components/ui/Toast";
import Spinner from "../components/ui/Spinner"; // Opcional

export default function Registrarse() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoadingEmail(true);

    if (!fullName.trim()) {
      setError("Por favor ingresa tu nombre completo.");
      setIsLoadingEmail(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoadingEmail(false);
      return;
    }

    // Crear perfil en la tabla profiles
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: userId,
        full_name: fullName,
        email,
      });

      if (profileError) {
        setError("Ocurrió un error al crear tu perfil.");
        setIsLoadingEmail(false);
        return;
      }
    }

    setShowToast(true);

    setTimeout(() => {
      router.push("/ingresar");
    }, 2500);
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setError("Error al iniciar sesión con Google.");
      setIsLoadingGoogle(false);
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
          disabled={isLoadingEmail}
        >
          {isLoadingEmail ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">ó</div>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
        disabled={isLoadingGoogle}
      >
        {isLoadingGoogle ? "Redirigiendo..." : "Registrarse con Google"}
      </button>

      <p className="mt-4 text-sm text-center">
        ¿Ya tienes cuenta?{" "}
        <Link href="/ingresar" className="text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>

      {showToast && (
        <Toast message="🎉 Registro exitoso. Revisa tu correo para confirmar tu cuenta." />
      )}
    </div>
  );
}
