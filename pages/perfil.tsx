'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/auth'
import { withAuth } from '@/lib/withAuth'
import Layout from '@/components/Layout'
import AvatarPreview from '@/components/AvatarPreview'
import Link from 'next/link'
import Toast from '@/components/ui/Toast'

type Perfil = {
  full_name: string
  rol: string
}

function PerfilPage() {
  const { user } = useUser()
  const router = useRouter()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const fetchPerfil = async () => {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, rol')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('❌ Error al obtener perfil:', error.message)
        setError('No se pudo cargar tu perfil.')
        setLoading(false)
        return
      }

      if (!data?.rol) {
        setShowToast(true)
        router.replace('/definir-rol')
        return
      }

      setPerfil(data)
      setLoading(false)
    }

    fetchPerfil()
  }, [user?.id])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/ingresar')
  }

  if (!user) return <p className="p-4">Debes iniciar sesión.</p>
  if (loading) return <p className="p-4">Cargando perfil...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>

  const nombre = perfil?.full_name?.trim()

  return (
    <Layout>
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Bienvenido{nombre ? `, ${nombre}` : ''}!
        </h1>

        <AvatarPreview userId={user.id} />

        <p className="mt-4 text-sm text-gray-500 capitalize">
          Rol: <span className="font-medium text-gray-700">{perfil?.rol}</span>
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition">
              Ir al panel
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Debes definir tu rol antes de continuar."
          type="warning"
        />
      )}
    </Layout>
  )
}

export default withAuth(PerfilPage)
