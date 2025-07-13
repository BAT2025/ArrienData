"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useUser } from "../lib/auth"
import { withAuth } from "@/lib/withAuth"
import Layout from "@/components/Layout"

function CalificarPage() {
  const { user } = useUser()
  const [documento, setDocumento] = useState("")
  const [estrellas, setEstrellas] = useState(5)
  const [comentario, setComentario] = useState("")
  const [mensaje, setMensaje] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { error } = await supabase.from("ratings").insert({
      propietario_id: user.id,
      locatario_documento: documento,
      estrellas,
      comentario,
    })

    if (error) {
      setMensaje("❌ Error guardando calificación")
    } else {
      setMensaje("✅ Calificación registrada correctamente")
      setDocumento("")
      setEstrellas(5)
      setComentario("")
    }
  }

  return (
    <Layout>
      <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">
          Calificar Locatario
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Número de documento del locatario
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Calificación (1 a 5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={estrellas}
              onChange={(e) => setEstrellas(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Observaciones
            </label>
            <textarea
              rows={4}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Guardar Calificación
          </button>

          {mensaje && (
            <p className="text-center text-sm mt-4 text-green-600">{mensaje}</p>
          )}
        </form>
      </div>
    </Layout>
  )
}

// Solo arrendadores pueden calificar locatarios
export default withAuth(CalificarPage, { allowedRoles: ["arrendador"] })
