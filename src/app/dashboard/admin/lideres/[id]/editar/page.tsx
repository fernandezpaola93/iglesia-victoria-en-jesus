'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Button, Input, Select, Checkbox, Badge } from '@/components/ui'
import { AvatarUpload } from '@/components/ui/AvatarUpload'
import { LeadershipRole } from '@/lib/types'

interface FormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  leadership_role: LeadershipRole | ''
  leadership_order: string
  is_active_leader: boolean
  profile_photo_url: string
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

export default function EditLeaderPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    leadership_role: '',
    leadership_order: '1',
    is_active_leader: true,
    profile_photo_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchLeader()
  }, [id])

  const fetchLeader = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          leadership_role: data.leadership_role || '',
          leadership_order: data.leadership_order?.toString() || '1',
          is_active_leader: data.is_active_leader || false,
          profile_photo_url: data.profile_photo_url || '',
        })
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el líder')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handlePhotoUpload = (url: string) => {
    setFormData(prev => ({ ...prev, profile_photo_url: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('members')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          leadership_role: formData.leadership_role,
          leadership_order: parseInt(formData.leadership_order) || 1,
          is_active_leader: formData.is_active_leader,
          profile_photo_url: formData.profile_photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      router.push('/dashboard/admin/lideres')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el líder')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveLeader = async () => {
    if (!confirm('¿Estás seguro de que quieres remover este líder? (El miembro seguirá existiendo)')) return
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
      router.push('/dashboard/admin/lideres')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al remover el líder')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <Card>
            <CardBody className="p-6">
              <div className="h-6 w-1/4 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                {[1,2,3,4,5,6].map(i => (
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
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-primary-900">Editar Líder</CardTitle>
            <Badge variant={formData.is_active_leader ? 'success' : 'default'} value={formData.is_active_leader ? 'active' : 'inactive'}>
              {formData.is_active_leader ? 'Activo' : 'Inactivo'}
            </Badge>
          </CardHeader>
          <CardBody>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <AvatarUpload
                  currentUrl={formData.profile_photo_url}
                  onUploadComplete={handlePhotoUpload}
                  userId={id}
                />
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-primary-900">
                    {formData.first_name} {formData.last_name}
                  </h3>
                  <p className="text-primary-500">{formData.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-primary-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Nombre"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-primary-700 mb-1">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Apellido"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="correo@ejemplo.com"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-primary-700 mb-1">
                    Teléfono
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+54 9 11 1234-5678"
                    className="w-full"
                  />
                </div>
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
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Link href="/dashboard/admin/lideres">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
                <Button type="button" variant="danger" onClick={handleRemoveLeader} className="ml-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Líder
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}