// lib/withAuth.tsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function withAuth<P>(
  WrappedComponent: React.ComponentType<P>,
  options?: { allowedRoles?: string[] }
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
      const checkAuth = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/ingresar");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("rol") // Asegúrate de que tu campo se llama 'rol'
          .eq("user_id", session.user.id)
          .single();

        if (error || !profile) {
          console.error("Error fetching profile", error);
          router.push("/ingresar");
          return;
        }

        if (!profile.rol) {
          router.push("/definir-rol");
          return;
        }

        setUserRole(profile.rol);

        // Validar si el rol es permitido
        if (
          options?.allowedRoles &&
          !options.allowedRoles.includes(profile.rol)
        ) {
          router.push("/dashboard"); // o página de acceso denegado
          return;
        }

        setLoading(false);
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <p className="text-center p-4">Verificando acceso...</p>;
    }

    return <WrappedComponent {...props} />;
  };
}
