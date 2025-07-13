'use client'

import { useState, useEffect } from 'react'
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

  // 🔐 Redirigir si ya está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session

      if (session?.user) {
        // Consulta el perfil
        const { data: perfil, error } = await supabase
          .from('profiles')
          .select('rol')
          .eq('user_id', session.user.id)
          .single()

        if (perfil?.rol) {
          router.replace('/perfil') // Si ya tiene rol
        } else {
          router.replace('/definir-rol') // Si aún no ha definido el rol
        }
      }
    }

    checkSession()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
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

    // Verificar si ya existe un perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (!profile && !profileError) {
      // Crear perfil básico si no existe
      await supabase.from('profiles').insert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || '',
        rol: null,
      })
    }

    // Mostrar toast y redirigir
    setShowToast(true)
    setTimeout(() => {
      router.push('/perfil') // o /definir-rol según prefieras
    }, 2000)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      setError('Error al iniciar sesión con Google.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Correo electrónico"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
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
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">ó</div>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Redirigiendo...' : 'Ingresar con Google'}
      </button>

      <p className="mt-4 text-sm text-center">
        ¿Aún no tienes cuenta?{' '}
        <a href="/registrarse" className="text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>

      {showToast && (
        <Toast message="✅ Sesión iniciada correctamente. Redirigiendo..." />
      )}
    </div>
  )
}
