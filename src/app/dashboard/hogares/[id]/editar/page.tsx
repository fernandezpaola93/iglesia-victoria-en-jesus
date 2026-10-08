'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'

export default function EditarHogarPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [household, setHousehold] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'México',
    phone: '',
    email: '',
    notes: '',
    is_active: true,
  })

  useEffect(() => {
    fetchHousehold()
  }, [params.id])

  const fetchHousehold = async () => {
    try {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setHousehold(data)
      setFormData({
        name: data.name || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip_code: data.zip_code || '',
        country: data.country || 'México',
        phone: data.phone || '',
        email: data.email || '',
        notes: data.notes || '',
        is_active: data.is_active ?? true,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      const { error } = await supabase
        .from('households')
        .update(formData)
        .eq('id', params.id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => router.push(`/dashboard/hogares/${params.id}`), 1500)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar hogar')
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

  if (error && !household) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-primary-900 mb-2">No encontrado</h2>
          <p className="text-primary-600 mb-6">{error}</p>
          <Link href="/dashboard/hogares">
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
          <Link href="/dashboard/hogares">
            <Button variant="ghost" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-900">Editar Hogar</h1>
            <p className="text-primary-600 mt-1">Actualiza la información del hogar</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Hogar actualizado correctamente. Redirigiendo...</span>
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
              <Home className="h-5 w-5" />
              Datos del Hogar
            </CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del hogar *</label>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Calle y número</label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                  <Input id="state" name="state" value={formData.state} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">C.P.</label>
                  <Input id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">País</label>
                  <Input id="country" name="country" value={formData.country} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Hogar activo</label>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Link href="/dashboard/hogares">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={saving} className="gap-2">
                  <Home className="h-4 w-4" />
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