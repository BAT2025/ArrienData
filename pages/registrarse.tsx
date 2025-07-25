'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Toast from '../components/ui/Toast'

export default function Registrarse() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [rol, setRol] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session

      if (session?.user) {
        const { data: perfil } = await supabase
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const user = authData?.user
    if (!user) {
      setError('No se pudo registrar el usuario.')
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: user.id,
      full_name: fullName,
      rol: rol || null,
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    setShowToast(true)

    setTimeout(() => {
      if (rol) {
        router.push('/perfil')
      } else {
        router.push('/definir-rol')
      }
    }, 2000)

    setLoading(false)
  }

  const handleGoogleRegister = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      setError('Error al registrar con Google.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          required
          className="w-full border px-3 py-2 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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

        <select
          className="w-full border px-3 py-2 rounded text-gray-600"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="">Selecciona tu rol (opcional)</option>
          <option value="arrendador">Arrendador</option>
          <option value="locatario">Locatario</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">ó</div>

      <button
        onClick={handleGoogleRegister}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Redirigiendo...' : 'Registrarse con Google'}
      </button>

      {showToast && <Toast message="Registro exitoso. Redirigiendo..." type="success" />}
    </div>
  )
}
