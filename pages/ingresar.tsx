'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Toast from '../components/ui/Toast'

export default function Ingresar() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const router = useRouter()

  // 🚀 Redirigir si ya está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session

      if (session?.user) {
        const { data: perfil, error } = await supabase
          .from('profiles')
          .select('rol')
          .eq('user_id', session.user.id)
          .single()

        if (perfil?.rol) {
          router.replace('/perfil')
        } else {
          router.replace('/definir-rol')
        }
      }
    }

    checkSession()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
      return
    }

    const user = authData?.user
    if (!user) {
      setError('No se pudo obtener el usuario.')
      setLoading(false)
      return
    }

    // Esperar a que la sesión esté lista
    await new Promise((r) => setTimeout(r, 1000))

    // Verificar si ya existe un perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      setError('Error al obtener perfil.')
      setLoading(false)
      return
    }

    if (!profile) {
      const insertResult = await supabase.from('profiles').insert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || '',
        rol: null,
      })

      if (insertResult.error) {
        setError('No se pudo crear el perfil.')
        setLoading(false)
        return
      }
    }

    // Mostrar toast y redirigir
    setShowToast(true)
    setTimeout(() => {
      router.push('/perfil')
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          required
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        ¿No tienes cuenta?{' '}
        <a href="/registrarse" className="text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>

      {showToast && (
        <Toast message="✅ Sesión iniciada. Redirigiendo..." />
      )}
    </div>
  )
}
