'use client'

import { useUser } from '../lib/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Toast from '../components/ui/Toast'

export default function DefinirRolPage() {
  const { user, isLoading: userLoading } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user || userLoading) return

    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('rol')
        .eq('user_id', user.id)
        .single()

      if (error) {
        setError('❌ No se pudo obtener tu perfil.')
        setLoading(false)
        return
      }

      if (data?.rol) {
        router.replace('/perfil')
      } else {
        setLoading(false)
      }
    }

    fetchPerfil()
  }, [user, userLoading])

  const handleRolSeleccionado = async (rol: 'arrendador' | 'locatario') => {
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({ rol })
      .eq('user_id', user.id)

    if (error) {
      setError('❌ Error al guardar el rol.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/perfil'), 2000)
  }

  if (!user || userLoading || loading) {
    return <p className="p-6 text-center">⏳ Cargando...</p>
  }

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">¿Cuál es tu rol en ArrienData?</h1>
      <p className="mb-6 text-gray-600">Elige una opción para personalizar tu experiencia.</p>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        <button
          onClick={() => handleRolSeleccionado('arrendador')}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Soy propietario (arrendador)
        </button>
        <button
          onClick={() => handleRolSeleccionado('locatario')}
          className="w-full bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          Soy quien desea arrendar (locatario)
        </button>
      </div>

      {success && <Toast message="✅ Rol guardado. Redirigiendo..." />}
    </div>
  )
}
