'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserPlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'

const MARITAL_STATUS_OPTIONS = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión libre', 'Separado']
const GENDER_OPTIONS = ['M', 'F', 'Otro', 'Prefiero no decir']
const MEMBERSHIP_STATUS_OPTIONS = ['Visitante', 'Miembro', 'Miembro activo', 'Miembro inactivo', 'Trasladado', 'Fallecido']

export default function EditarMiembroPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [member, setMember] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    preferred_name: '',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    email: '',
    phone: '',
    phone_secondary: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    baptism_date: '',
    baptism_location: '',
    membership_date: '',
    membership_status: 'Visitante',
    salvation_date: '',
    salvation_notes: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    allergies_medical: '',
    blood_type: '',
    notes: '',
    facebook_url: '',
    instagram_url: '',
    whatsapp_number: '',
  })

  useEffect(() => {
    fetchMember()
  }, [params.id])

  const fetchMember = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setMember(data)
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        middle_name: data.middle_name || '',
        preferred_name: data.preferred_name || '',
        gender: data.gender || '',
        date_of_birth: data.date_of_birth || '',
        marital_status: data.marital_status || '',
        email: data.email || '',
        phone: data.phone || '',
        phone_secondary: data.phone_secondary || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip_code: data.zip_code || '',
        baptism_date: data.baptism_date || '',
        baptism_location: data.baptism_location || '',
        membership_date: data.membership_date || '',
        membership_status: data.membership_status || 'Visitante',
        salvation_date: data.salvation_date || '',
        salvation_notes: data.salvation_notes || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
        emergency_contact_relationship: data.emergency_contact_relationship || '',
        allergies_medical: data.allergies_medical || '',
        blood_type: data.blood_type || '',
        notes: data.notes || '',
        facebook_url: data.facebook_url || '',
        instagram_url: data.instagram_url || '',
        whatsapp_number: data.whatsapp_number || '',
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      const payload = {
        ...formData,
        date_of_birth: formData.date_of_birth || null,
        baptism_date: formData.baptism_date || null,
        membership_date: formData.membership_date || null,
        salvation_date: formData.salvation_date || null,
      }

      const { error } = await supabase
        .from('members')
        .update(payload)
        .eq('id', params.id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => router.push(`/dashboard/miembros/${params.id}`), 1500)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar miembro')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Loader2 className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-3" />
          <p className="text-primary-500">Cargando miembro...</p>
        </div>
      </div>
    )
  }

  if (error && !member) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-primary-900 mb-2">Miembro no encontrado</h2>
          <p className="text-primary-600 mb-6">{error}</p>
          <Link href="/dashboard/miembros">
            <Button variant="primary">Volver a Miembros</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/dashboard/miembros/${params.id}`}>
            <Button variant="ghost" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-900">Editar Miembro</h1>
            <p className="text-primary-600 mt-1">Actualiza la información del feligrés</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Miembro actualizado correctamente. Redirigiendo...</span>
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
            <CardTitle className="text-primary-900">Datos Personales</CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre(s) *</label>
                  <Input id="first_name" name="first_name" required value={formData.first_name} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido(s) *</label>
                  <Input id="last_name" name="last_name" required value={formData.last_name} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">Segundo nombre</label>
                  <Input id="middle_name" name="middle_name" value={formData.middle_name} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="preferred_name" className="block text-sm font-medium text-gray-700">Nombre preferido</label>
                  <Input id="preferred_name" name="preferred_name" value={formData.preferred_name} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género</label>
                  <Select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </Select>
                </div>
                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                  <Input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">Estado civil</label>
                  <Select id="marital_status" name="marital_status" value={formData.marital_status} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    {MARITAL_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-primary-900 mb-4">Información de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono principal</label>
                    <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="phone_secondary" className="block text-sm font-medium text-gray-700">Teléfono secundario</label>
                    <Input type="tel" id="phone_secondary" name="phone_secondary" value={formData.phone_secondary} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">WhatsApp</label>
                    <Input type="tel" id="whatsapp_number" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-primary-900 mb-4">Dirección</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Calle y número</label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                    <Input id="state" name="state" value={formData.state} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">C.P.</label>
                    <Input id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-primary-900 mb-4">Información Espiritual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="salvation_date" className="block text-sm font-medium text-gray-700">Fecha de decisión de fe</label>
                    <Input type="date" id="salvation_date" name="salvation_date" value={formData.salvation_date} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="baptism_date" className="block text-sm font-medium text-gray-700">Fecha de bautismo</label>
                    <Input type="date" id="baptism_date" name="baptism_date" value={formData.baptism_date} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="baptism_location" className="block text-sm font-medium text-gray-700">Lugar de bautismo</label>
                    <Input id="baptism_location" name="baptism_location" value={formData.baptism_location} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="membership_date" className="block text-sm font-medium text-gray-700">Fecha de membresía</label>
                    <Input type="date" id="membership_date" name="membership_date" value={formData.membership_date} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="membership_status" className="block text-sm font-medium text-gray-700">Estado de membresía *</label>
                    <Select id="membership_status" name="membership_status" value={formData.membership_status} onChange={handleChange} required>
                      {MEMBERSHIP_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="salvation_notes" className="block text-sm font-medium text-gray-700">Notas de salvación/bautismo</label>
                    <textarea id="salvation_notes" name="salvation_notes" value={formData.salvation_notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-primary-900 mb-4">Contacto de Emergencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <Input id="emergency_contact_name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <Input type="tel" id="emergency_contact_phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="emergency_contact_relationship" className="block text-sm font-medium text-gray-700">Relación</label>
                    <Input id="emergency_contact_relationship" name="emergency_contact_relationship" value={formData.emergency_contact_relationship} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-primary-900 mb-4">Información Médica (Opcional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="allergies_medical" className="block text-sm font-medium text-gray-700">Alergías / Condiciones médicas</label>
                    <textarea id="allergies_medical" name="allergies_medical" value={formData.allergies_medical} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700">Tipo de sangre</label>
                    <Input id="blood_type" name="blood_type" value={formData.blood_type} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-primary-900 mb-4">Redes Sociales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700">Facebook</label>
                    <Input type="url" id="facebook_url" name="facebook_url" value={formData.facebook_url} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700">Instagram</label>
                    <Input type="url" id="instagram_url" name="instagram_url" value={formData.instagram_url} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas adicionales</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Link href={`/dashboard/miembros/${params.id}`}>
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={saving} className="gap-2">
                  <UserPlus className="h-4 w-4" />
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