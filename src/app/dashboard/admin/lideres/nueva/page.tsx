'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, Save, Search, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Button, Input, Select, Checkbox, Avatar, Badge } from '@/components/ui'
import { AvatarUpload } from '@/components/ui/AvatarUpload'
import { Member, LeadershipRole } from '@/lib/types'

interface FormData {
  member_id: string
  leadership_role: LeadershipRole | ''
  leadership_order: string
  is_active_leader: boolean
}

interface MemberOption {
  id: string
  first_name: string
  last_name: string
  email: string | null
  profile_photo_url: string | null
  membership_status: string
  leadership_role: LeadershipRole | null
}

const LEADERSHIP_ROLES: { value: LeadershipRole; label: string }[] = [
  { value: 'Pastor Principal', label: 'Pastor Principal' },
  { value: 'Pastor Asociado', label: 'Pastor Asociado' },
  { value: 'Pastor de Jóvenes', label: 'Pastor de Jóvenes' },
  { value: 'Pastor de Niños', label: 'Pastor de Niños' },
  { value: 'Diácono', label: 'Diácono' },
  { value: 'Diaconisa', label: 'Diaconisa' },
  { value: 'Secretario', label: 'Secretario' },
  { value: 'Secretaria', label: 'Secretaria' },
  { value: 'Tesorero', label: 'Tesorero' },
  { value: 'Tesorera', label: 'Tesorera' },
  { value: 'Presbítero', label: 'Presbítero' },
  { value: 'Anciano', label: 'Anciano' },
  { value: 'Otro', label: 'Otro' },
]

export default function NewLeaderPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    member_id: '',
    leadership_role: '',
    leadership_order: '1',
    is_active_leader: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [members, setMembers] = useState<MemberOption[]>([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name, email, profile_photo_url, membership_status, leadership_role')
        .eq('is_active', true)
        .order('first_name', { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (err: any) {
      console.error('Error fetching members:', err)
    } finally {
      setLoadingMembers(false)
    }
  }

  const filteredMembers = members.filter(m => 
    !m.leadership_role &&
    `${m.first_name} ${m.last_name} ${m.email || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { error } = await supabase
        .from('members')
        .update({
          leadership_role: formData.leadership_role,
          leadership_order: parseInt(formData.leadership_order) || 1,
          is_active_leader: formData.is_active_leader,
          updated_at: new Date().toISOString(),
        })
        .eq('id', formData.member_id)

      if (error) throw error

      router.push('/dashboard/admin/lideres')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al crear el líder')
    } finally {
      setLoading(false)
    }
  }

  if (loadingMembers) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <Card>
            <CardBody className="p-6">
              <div className="h-6 w-1/4 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/admin/lideres" className="inline-flex items-center text-primary-600 hover:text-primary-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver a Liderazgo
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary-900">Agregar Nuevo Líder</CardTitle>
          </CardHeader>
          <CardBody>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Seleccionar Miembro <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                {filteredMembers.length === 0 && !loadingMembers && searchTerm && (
                  <p className="mt-2 text-sm text-primary-500">No se encontraron miembros disponibles</p>
                )}
                <div className="mt-2 max-h-60 overflow-y-auto border border-primary-200 rounded-lg">
                  {filteredMembers.map((member) => (
                    <label
                      key={member.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-primary-50 transition-colors ${formData.member_id === member.id ? 'bg-primary-50 border-l-4 border-primary-500' : ''}`}
                    >
                      <input
                        type="radio"
                        name="member_id"
                        value={member.id}
                        checked={formData.member_id === member.id}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <Avatar src={member.profile_photo_url} alt={`${member.first_name} ${member.last_name}`} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary-900 truncate">{member.first_name} {member.last_name}</p>
                        <p className="text-sm text-primary-500 truncate">{member.email || 'Sin email'}</p>
                      </div>
                      <Badge variant="status" value={member.membership_status} className="whitespace-nowrap">
                        {member.membership_status}
                      </Badge>
                    </label>
                  ))}
                </div>
                {!formData.member_id && (
                  <p className="mt-2 text-sm text-red-600">Debe seleccionar un miembro</p>
                )}
              </div>

              <div>
                <label htmlFor="leadership_role" className="block text-sm font-medium text-primary-700 mb-1">
                  Rol de Liderazgo <span className="text-red-500">*</span>
                </label>
                <Select
                  id="leadership_role"
                  name="leadership_role"
                  value={formData.leadership_role}
                  onChange={handleChange}
                  required
                  className="w-full"
                >
                  <option value="">Seleccionar rol</option>
                  {LEADERSHIP_ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="leadership_order" className="block text-sm font-medium text-primary-700 mb-1">
                    Orden de Visualización
                  </label>
                  <Input
                    id="leadership_order"
                    name="leadership_order"
                    type="number"
                    value={formData.leadership_order}
                    onChange={handleChange}
                    min="1"
                    placeholder="1"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      name="is_active_leader"
                      checked={formData.is_active_leader}
                      onChange={handleChange}
                    />
                    <span className="text-sm text-primary-700">Líder activo (visible en la web)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button type="submit" disabled={loading || !formData.member_id}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Líder'}
                </Button>
                <Link href="/dashboard/admin/lideres">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>

        <Link href="/dashboard/miembros/nuevo" className="mt-6 inline-flex items-center gap-2 text-primary-600 hover:text-primary-900">
          <UserPlus className="h-5 w-5" />
          ¿El miembro no existe? Crear nuevo miembro primero
        </Link>
      </div>
    </div>
  )
}