"use client";

import LocatarioHistorial from "../components/LocatarioHistorial";

export default function VerLocatarioPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Consultar historial de locatario</h1>
      <LocatarioHistorial />
    </div>
  );
}
