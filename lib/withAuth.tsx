// lib/withAuth.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { ComponentType, FC } from "react";

type WithAuthOptions = {
  allowedRoles?: string[];
};

type WithAuthProps = Record<string, any>;

export function withAuth<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>,
  options?: WithAuthOptions
): FC<P> {
  const ComponentWithAuth: FC<P> = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            router.push("/ingresar");
            return;
          }

          const { data: profile, error } = await supabase
            .from("profiles")
            .select("rol")
            .eq("user_id", session.user.id)
            .single();

          if (error || !profile) {
            console.error("Error obteniendo el perfil del usuario:", error);
            router.push("/ingresar");
            return;
          }

          if (!profile.rol) {
            router.push("/definir-rol");
            return;
          }

          setUserRole(profile.rol);

          if (
            options?.allowedRoles &&
            !options.allowedRoles.includes(profile.rol)
          ) {
            router.push("/dashboard"); // Acceso denegado
            return;
          }

          setLoading(false);
        } catch (err) {
          console.error("Error en la verificación de autenticación:", err);
          router.push("/ingresar");
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <p className="text-center p-4">Verificando acceso...</p>;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
}
