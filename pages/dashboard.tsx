"use client";

import { useUser } from "../lib/auth";
import CertificateList from "../components/CertificateList";
import AvatarPreview from "../components/AvatarPreview";

export default function Dashboard() {
  const { user } = useUser();

  if (!user) return <p className="p-4">Cargando usuario...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <AvatarPreview userId={user.id} />
      <CertificateList userId={user.id} />
    </div>
  );
}


