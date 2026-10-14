'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Plus, Edit, Trash2, User, Users } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { formatShortDate } from '@/lib/utils'
import { Member, LeadershipRole } from '@/lib/types'

interface LeaderRow {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  profile_photo_url: string | null
  leadership_role: LeadershipRole | null
  leadership_order: number
  is_active_leader: boolean
  membership_status: string
  created_at: string
  updated_at: string
}

const ROLE_COLORS: Record<string, string> = {
  'Pastor Principal': 'bg-purple-100 text-purple-800',
  'Pastor Asociado': 'bg-purple-100 text-purple-800',
  'Pastor de Jóvenes': 'bg-blue-100 text-blue-800',
  'Pastor de Niños': 'bg-green-100 text-green-800',
  'Diácono': 'bg-orange-100 text-orange-800',
  'Diaconisa': 'bg-orange-100 text-orange-800',
  'Secretario': 'bg-gray-100 text-gray-800',
  'Secretaria': 'bg-gray-100 text-gray-800',
  'Tesorero': 'bg-yellow-100 text-yellow-800',
  'Tesorera': 'bg-yellow-100 text-yellow-800',
  'Presbítero': 'bg-indigo-100 text-indigo-800',
  'Anciano': 'bg-indigo-100 text-indigo-800',
  'Otro': 'bg-slate-100 text-slate-800',
}

export default function AdminLeadersPage() {
  const [leaders, setLeaders] = useState<LeaderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchLeaders()
  }, [])

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .not('leadership_role', 'is', null)
        .order('leadership_order', { ascending: true })

      if (error) throw error
      setLeaders(data || [])
    } catch (error) {
      console.error('Error fetching leaders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres remover este líder?')) return
    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('members')
        .update({ 
          leadership_role: null, 
          leadership_order: 0, 
          is_active_leader: false 
        })
        .eq('id', id)
      if (error) throw error
      setLeaders(leaders.filter(l => l.id !== id))
    } catch (error) {
      console.error('Error removing leader:', error)
      alert('Error al remover el líder')
    } finally {
      setDeletingId(null)
    }
  }

  const getRoleColor = (role: string | null) => {
    if (!role) return 'bg-gray-100 text-gray-800'
    return ROLE_COLORS[role] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => (
              <Card key={i}>
                <CardBody className="p-6">
                  <div className="h-6 w-1/4 bg-gray-200 rounded" />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Liderazgo de la Iglesia</h1>
            <p className="text-primary-600 mt-1">Gestionar pastores, diáconos y líderes</p>
          </div>
          <Link href="/dashboard/admin/lideres/nuevo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Líder
            </Button>
          </Link>
        </div>

        {leaders.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-primary-300 mb-4" />
              <h3 className="text-lg font-medium text-primary-900 mb-2">No hay líderes registrados</h3>
              <p className="text-primary-500 mb-6">Comienza agregando el liderazgo de la iglesia</p>
              <Link href="/dashboard/admin/lideres/nuevo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Líder
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Líder</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Contacto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Orden</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-primary-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaders.map((leader) => (
                      <tr key={leader.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <Avatar 
                              src={leader.profile_photo_url} 
                              alt={`${leader.first_name} ${leader.last_name}`}
                              size="md"
                            />
                            <div>
                              <div className="text-sm font-medium text-primary-900">
                                {leader.first_name} {leader.last_name}
                              </div>
                              <div className="text-sm text-primary-500">
                                {leader.membership_status}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {leader.leadership_role && (
                            <Badge variant="default" value={leader.leadership_role.toLowerCase()} className={getRoleColor(leader.leadership_role)}>
                              {leader.leadership_role}
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">
                          {leader.email && (
                            <div className="flex items-center gap-1">
                              <span className="truncate max-w-xs">{leader.email}</span>
                            </div>
                          )}
                          {leader.phone && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="truncate max-w-xs">{leader.phone}</span>
                            </div>
                          )}
                          {!leader.email && !leader.phone && <span>—</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={leader.is_active_leader ? 'success' : 'default'} value={leader.is_active_leader ? 'active' : 'inactive'}>
                            {leader.is_active_leader ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">
                          {leader.leadership_order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/admin/lideres/${leader.id}/editar`}
                              className="text-primary-600 hover:text-primary-900 p-1.5 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(leader.id)}
                              disabled={deletingId === leader.id}
                              className="text-red-600 hover:text-red-900 p-1.5 rounded transition-colors"
                              title="Remover como líder"
                            >
                              {deletingId === leader.id ? (
                                <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}