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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)

  useEffect(() => {
    const verificarPerfil = async () => {
      if (!user) return

      if (!user.email_confirmed_at) {
        setError('⚠️ Debes confirmar tu correo electrónico antes de continuar.')
        setLoading(false)
        return
      }

      const { data: perfil, error: perfilError } = await supabase
        .from('profiles')
        .select('rol')
        .eq('user_id', user.id)
        .single()

      if (perfilError) {
        setError('❌ No se pudo obtener tu perfil.')
        setLoading(false)
        return
      }

      if (perfil?.rol) {
        router.replace('/perfil')
      } else {
        setLoading(false)
      }
    }

    verificarPerfil()
  }, [user])

  const handleRolSeleccionado = async (rol: 'arrendador' | 'locatario') => {
    if (!user || submitting) return

    setSubmitting(true)
    setError('')
    setToast(null)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ rol })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error al actualizar rol:', updateError.message)
      setToast({ message: '❌ No se pudo guardar el rol. Intenta nuevamente.', type: 'error' })
      setSubmitting(false)
      return
    }

    setToast({ message: '✅ Rol guardado. Redirigiendo...', type: 'success' })

    setTimeout(() => {
      router.push('/perfil')
    }, 1500)
  }

  if (!user || loading) {
    return <p className="p-6 text-center">⏳ Cargando...</p>
  }

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">¿Cuál es tu rol en ArrienData?</h1>
      <p className="mb-6 text-gray-600">Selecciona una opción para personalizar tu experiencia.</p>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        <button
          onClick={() => handleRolSeleccionado('arrendador')}
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={submitting}
        >
          Soy propietario (arrendador)
        </button>
        <button
          onClick={() => handleRolSeleccionado('locatario')}
          className={`w-full bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={submitting}
        >
          Soy quien desea arrendar (locatario)
        </button>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </div>
  )
}
