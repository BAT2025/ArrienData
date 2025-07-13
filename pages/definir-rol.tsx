'use client'

import { useUser } from '../lib/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Toast from '../components/ui/Toast'

export default function DefinirRolPage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [perfil, setPerfil] = useState<any>(null)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Obtener el perfil del usuario autenticado
  useEffect(() => {
    if (!user) return

    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('rol')
        .eq('user_id', user.id)
        .single()

      if (error) {
        setError('Error al obtener tu perfil.')
        console.error('Error al obtener perfil:', error.message)
        return
      }

      if (data?.rol) {
        router.replace('/perfil')
      } else {
        setPerfil(data)
        setLoading(false)
      }
    }

    fetchPerfil()
  }, [user])

  const handleRolSeleccionado = async (rol: 'arrendador' | 'locatario') => {
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('profiles')
      .update({ rol })
      .eq('user_id', user.id)

    if (error) {
      setError('Error al guardar el rol. Intenta nuevamente.')
      console.error('Error al guardar rol:', error.message)
      setLoading(false)
      return
    }

    setShowToast(true)

    setTimeout(() => {
      router.push('/perfil')
    }, 1500)
  }

  if (!user) {
    return <p className="p-6 text-center">🔒 Debes iniciar sesión para continuar.</p>
  }

  if (loading) {
    return <p className="p-6 text-center">⏳ Cargando...</p>
  }

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">¿Cuál es tu rol en ArrienData?</h1>
      <p className="mb-6 text-gray-600">
        Elige una opción para personalizar tu experiencia.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        <button
          onClick={() => handleRolSeleccionado('arrendador')}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          Soy propietario (arrendador)
        </button>
        <button
          onClick={() => handleRolSeleccionado('locatario')}
          className="w-full bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          disabled={loading}
        >
          Soy quien desea arrendar (locatario)
        </button>
      </div>

      {showToast && (
        <Toast message="✅ Rol guardado exitosamente. Redirigiendo..." />
      )}
    </div>
  )
}
