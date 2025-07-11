"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/auth";
import AvatarPreview from "../components/AvatarPreview";
import Link from "next/link";

export default function PerfilPage() {
  const { user } = useUser();
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error) setPerfil(data);
      setLoading(false);
    };

    fetchPerfil();
  }, [user]);

  if (!user) return <p className="p-4">Debes iniciar sesión.</p>;
  if (loading) return <p className="p-4">Cargando perfil...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">¡Bienvenido, {perfil?.full_name || user.email}!</h1>
      <AvatarPreview userId={user.id} />
      <p className="mt-4 text-gray-600 text-sm">Rol: {perfil?.rol || "no definido"}</p>

      <div className="mt-6 space-x-4">
        <Link href="/dashboard">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Ir al panel
          </button>
        </Link>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/ingresar");
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
