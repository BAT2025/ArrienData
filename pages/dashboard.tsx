'use client';

import { withAuth } from '@/lib/withAuth';
import { useUser } from '../lib/auth';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AvatarPreview from '../components/AvatarPreview';
import AvatarUpload from '../components/AvatarUpload';
import CertificateUpload from '../components/CertificateUpload';
import CertificateList from '../components/CertificateList';
import RatingForm from '../components/RatingForm';
import Layout from '@/components/Layout';

function DashboardPage() {
  const { user } = useUser();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchPerfil = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setPerfil(data);
      setLoading(false);
    };
    fetchPerfil();
  }, [user]);

  if (!user || loading) {
    return (
      <Layout>
        <p className="text-center text-gray-500 mt-10">Cargando panel...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-4 text-center">Tu panel</h1>

      {/* Rol del usuario */}
      {perfil?.rol && (
        <div className="mb-6 text-center text-gray-700">
          {perfil.rol === 'arrendador' ? (
            <>
              <p className="text-blue-600 font-medium">👤 Arrendador</p>
              <p className="text-sm text-gray-500">Puedes calificar locatarios y subir certificados</p>
            </>
          ) : (
            <>
              <p className="text-green-600 font-medium">🏠 Locatario</p>
              <p className="text-sm text-gray-500">Tu comportamiento será calificado por los arrendadores</p>
            </>
          )}
        </div>
      )}

      {/* Avatar */}
      <section className="mb-8 flex flex-col items-center">
        <AvatarPreview userId={user.id} />
        <div className="mt-4">
          <AvatarUpload />
        </div>
      </section>

      {/* Vista para Arrendador */}
      {perfil?.rol === 'arrendador' && (
        <>
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">📄 Certificados</h2>
            <CertificateUpload />
            <CertificateList userId={user.id} />
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">⭐ Calificar locatario</h2>
            <RatingForm />
          </section>
        </>
      )}

      {/* Vista para Locatario */}
      {perfil?.rol === 'locatario' && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">📄 Tus certificados</h2>
          <CertificateList userId={user.id} />
        </section>
      )}
    </Layout>
  );
}

export default withAuth(DashboardPage, {
  allowedRoles: ['arrendador', 'locatario'],
});
