"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a ArrienData</h1>
      <p className="mb-6">
        La plataforma donde los propietarios pueden consultar el historial de sus locatarios y tomar decisiones informadas antes de arrendar.
      </p>

      <div className="space-x-4">
        <Link href="/ingresar">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Ingresar
          </button>
        </Link>
        <Link href="/registrarse">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Registrarse
          </button>
        </Link>
      </div>
    </div>
  );
}
