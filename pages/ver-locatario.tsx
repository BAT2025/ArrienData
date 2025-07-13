"use client";

import LocatarioHistorial from "@/components/LocatarioHistorial";
import { withAuth } from "@/lib/withAuth";
import Layout from "@/components/Layout";

function VerLocatarioPage() {
  return (
    <Layout>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Consultar historial de locatario
      </h1>
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <LocatarioHistorial />
      </div>
    </Layout>
  );
}

export default withAuth(VerLocatarioPage, { allowedRoles: ["arrendador"] });
