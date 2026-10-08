'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Profile {
  full_name?: string
  role: string
  created_at: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('full_name, role, created_at')
      .eq('id', user.id)
      .single()

    setProfile(data)
    setLoading(false)
  }

  if (loading) return <div className="text-center py-12">Cargando...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Bienvenido, {profile?.full_name || 'Usuario'}
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">Tu perfil</h3>
          <p className="mt-2 text-gray-600">
            Rol: <span className="font-medium capitalize">{profile?.role}</span>
          </p>
          <p className="text-gray-600">
            Miembro desde: {profile?.created_at && new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">Acciones rápidas</h3>
          <p className="mt-2 text-gray-600">Gestiona tu cuenta y preferencias.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">Ayuda</h3>
          <p className="mt-2 text-gray-600">¿Necesitas ayuda? Contacta al administrador.</p>
        </div>
      </div>
    </div>
  )
}