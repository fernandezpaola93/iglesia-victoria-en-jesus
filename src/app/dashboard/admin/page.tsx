'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

interface Profile {
  id: string
  email: string
  role: string
  created_at: string
  full_name?: string
}

export default function AdminMembersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string>('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    checkAuthAndFetch()
  }, [])

  async function checkAuthAndFetch() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('No autenticado')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      setError('No tienes permisos de administrador')
      setLoading(false)
      return
    }

    setCurrentUserRole(profile.role)
    fetchProfiles()
  }

  async function fetchProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at, full_name')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setProfiles(data || [])
    }
    setLoading(false)
  }

  async function updateRole(userId: string, newRole: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      fetchProfiles()
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm('¿Eliminar usuario? Esta acción no se puede deshacer.')) return

    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      fetchProfiles()
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administración de Miembros</h1>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
          Admin: {currentUserRole}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Registrado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{profile.full_name || '—'}</td>
                <td className="p-3">{profile.email}</td>
                <td className="p-3">
                  <select
                    value={profile.role}
                    onChange={(e) => updateRole(profile.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderador</option>
                  </select>
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteUser(profile.id)}
                    className="text-red-600 hover:underline text-sm"
                    disabled={profile.role === 'admin'}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay miembros registrados
        </div>
      )}
    </div>
  )
}