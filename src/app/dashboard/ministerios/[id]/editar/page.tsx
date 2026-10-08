'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Target, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'

const CATEGORY_OPTIONS = ['Alabanza', 'Enseñanza', 'Servicio', 'Evangelismo', 'Cuidado', 'Administración', 'Otro']
const DAY_OPTIONS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function EditarMinisterioPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ministry, setMinistry] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    leader_id: '',
    meeting_day: '',
    meeting_time: '',
    meeting_location: '',
    is_active: true,
    requires_background_check: false,
  })

  useEffect(() => {
    fetchMinistry()
  }, [params.id])

  const fetchMinistry = async () => {
    try {
      const { data, error } = await supabase
        .from('ministries')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setMinistry(data)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        category: data.category || '',
        leader_id: data.leader_id || '',
        meeting_day: data.meeting_day || '',
        meeting_time: data.meeting_time || '',
        meeting_location: data.meeting_location || '',
        is_active: data.is_active ?? true,
        requires_background_check: data.requires_background_check ?? false,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      const payload = {
        ...formData,
        leader_id: formData.leader_id || null,
      }

      const { error } = await supabase
        .from('ministries')
        .update(payload)
        .eq('id', params.id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => router.push(`/dashboard/ministerios/${params.id}`), 1500)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar ministerio')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <Loader2 className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-3" />
          <p className="text-primary-500">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error && !ministry) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-primary-900 mb-2">No encontrado</h2>
          <p className="text-primary-600 mb-6">{error}</p>
          <Link href="/dashboard/ministerios">
            <Button variant="primary">Volver</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/dashboard/ministerios/${params.id}`}>
            <Button variant="ghost" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-900">Editar Ministerio</h1>
            <p className="text-primary-600 mt-1">Actualiza la información del ministerio</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Ministerio actualizado correctamente. Redirigiendo...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-primary-900 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Datos del Ministerio
            </CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre *</label>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría *</label>
                  <Select id="category" name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Seleccionar</option>
                    {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </Select>
                </div>
                <div>
                  <label htmlFor="leader_id" className="block text-sm font-medium text-gray-700">Líder</label>
                  <Select id="leader_id" name="leader_id" value={formData.leader_id} onChange={handleChange}>
                    <option value="">Sin líder asignado</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="meeting_day" className="block text-sm font-medium text-gray-700">Día de reunión</label>
                  <Select id="meeting_day" name="meeting_day" value={formData.meeting_day} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {DAY_OPTIONS.map(day => <option key={day} value={day}>{day}</option>)}
                  </Select>
                </div>
                <div>
                  <label htmlFor="meeting_time" className="block text-sm font-medium text-gray-700">Hora</label>
                  <Input type="time" id="meeting_time" name="meeting_time" value={formData.meeting_time} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="meeting_location" className="block text-sm font-medium text-gray-700">Lugar</label>
                  <Input id="meeting_location" name="meeting_location" value={formData.meeting_location} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Ministerio activo</label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="requires_background_check"
                    name="requires_background_check"
                    checked={formData.requires_background_check}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="requires_background_check" className="text-sm font-medium text-gray-700">Requiere verificación de antecedentes</label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Link href={`/dashboard/ministerios/${params.id}`}>
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={saving} className="gap-2">
                  <Target className="h-4 w-4" />
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}