"use client";

import { useEffect, useState } from "react";
import { getUserCertificates } from "../lib/getUserCertificates";

export default function CertificateList({ userId }: { userId: string }) {
  const [certs, setCerts] = useState<
    { name: string; url: string; error: any }[]
  >([]);

  useEffect(() => {
    async function loadCertificates() {
      const result = await getUserCertificates(userId);
      setCerts(result);
    }
    loadCertificates();
  }, [userId]);

  if (!certs.length) return <p>No hay certificados subidos aún.</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Tus certificados</h2>
      <ul className="list-disc list-inside text-sm text-blue-600">
        {certs.map((cert, i) => (
          <li key={i}>
            <a href={cert.url} target="_blank" rel="noopener noreferrer">
              {cert.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
