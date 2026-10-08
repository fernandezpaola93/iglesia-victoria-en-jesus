'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, MapPin, Phone, Mail, Calendar, Heart, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatShortDate, getInitials, cn } from '@/lib/utils'

export default function MiembroDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchMember()
  }, [params.id])

  const fetchMember = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*, households(*)')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setMember(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este miembro? Esta acción no se puede deshacer.')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard/miembros')
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600 mx-auto mb-3" />
          <p className="text-primary-500">Cargando miembro...</p>
        </div>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-primary-900 mb-2">Miembro no encontrado</h2>
          <p className="text-primary-600 mb-6">{error || 'No existe un miembro con ese ID'}</p>
          <Link href="/dashboard/miembros">
            <Button variant="primary">Volver a Miembros</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    'Visitante': 'gray',
    'Miembro': 'blue',
    'Miembro activo': 'green',
    'Miembro inactivo': 'yellow',
    'Trasladado': 'orange',
    'Fallecido': 'red',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/miembros">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-900">
              {member.first_name} {member.last_name}
            </h1>
            <p className="text-primary-600">
              {member.preferred_name && `Conocido como: ${member.preferred_name}`}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardBody className="p-6 text-center">
                <Avatar
                  firstName={member.first_name}
                  lastName={member.last_name}
                  src={member.profile_photo_url}
                  size="xl"
                  className="mx-auto mb-4"
                />
                <h2 className="font-display text-xl font-bold text-primary-900">
                  {member.first_name} {member.last_name}
                </h2>
                {member.preferred_name && (
                  <p className="text-primary-500 mt-1">Conocido como: {member.preferred_name}</p>
                )}

                <Badge
                  variant="status"
                  value={member.membership_status}
                  className="mt-4 inline-flex"
                >
                  {member.membership_status}
                </Badge>

                <div className="mt-6 space-y-3 text-sm text-primary-600">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Registrado: {formatShortDate(member.created_at)}</span>
                  </div>
                  {member.membership_date && (
                    <div className="flex items-center justify-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>Miembro desde: {formatShortDate(member.membership_date)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <Link href={`/dashboard/miembros/${member.id}/editar`}>
                    <Button variant="outline" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleting ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-900">Información Personal</CardTitle>
              </CardHeader>
              <CardBody className="pt-0 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Nombre completo</label>
                  <p className="text-primary-900 font-medium">
                    {member.first_name} {member.middle_name ? member.middle_name + ' ' : ''}{member.last_name}
                  </p>
                </div>
                {member.preferred_name && (
                  <div>
                    <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Nombre preferido</label>
                    <p className="text-primary-900">{member.preferred_name}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Género</label>
                  <p className="text-primary-900">{member.gender || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Fecha de nacimiento</label>
                  <p className="text-primary-900">{member.date_of_birth ? formatShortDate(member.date_of_birth) : 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Estado civil</label>
                  <p className="text-primary-900">{member.marital_status || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Tipo de sangre</label>
                  <p className="text-primary-900">{member.blood_type || 'No especificado'}</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary-900">Contacto</CardTitle>
              </CardHeader>
              <CardBody className="pt-0 grid gap-4 md:grid-cols-2">
                {member.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary-400" />
                    <div>
                      <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Email</label>
                      <p className="text-primary-900">{member.email}</p>
                    </div>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary-400" />
                    <div>
                      <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Teléfono</label>
                      <p className="text-primary-900">{member.phone}</p>
                    </div>
                  </div>
                )}
                {member.phone_secondary && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary-400" />
                    <div>
                      <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Tel. secundario</label>
                      <p className="text-primary-900">{member.phone_secondary}</p>
                    </div>
                  </div>
                )}
                {member.whatsapp_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-400" />
                    <div>
                      <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">WhatsApp</label>
                      <p className="text-primary-900">{member.whatsapp_number}</p>
                    </div>
                  </div>
                )}
                {member.address && (
                  <div className="md:col-span-2 flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary-400 mt-0.5" />
                    <div>
                      <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Dirección</label>
                      <p className="text-primary-900">
                        {member.address}
                        {member.city && `, ${member.city}`}
                        {member.state && `, ${member.state}`}
                        {member.zip_code && ` ${member.zip_code}`}
                      </p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary-900">Información Espiritual</CardTitle>
              </CardHeader>
              <CardBody className="pt-0 grid gap-4 md:grid-cols-2">
                {member.salvation_date && (
                  <div>
                    <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Decisión de fe</label>
                    <p className="text-primary-900">{formatShortDate(member.salvation_date)}</p>
                  </div>
                )}
                {member.baptism_date && (
                  <div>
                    <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Bautismo</label>
                    <p className="text-primary-900">{formatShortDate(member.baptism_date)}</p>
                  </div>
                )}
                {member.baptism_location && (
                  <div>
                    <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Lugar de bautismo</label>
                    <p className="text-primary-900">{member.baptism_location}</p>
                  </div>
                )}
                {member.membership_date && (
                  <div>
                    <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Fecha de membresía</label>
                    <p className="text-primary-900">{formatShortDate(member.membership_date)}</p>
                  </div>
                )}
                {member.salvation_notes && (
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Notas espirituales</label>
                    <p className="text-primary-900 whitespace-pre-wrap">{member.salvation_notes}</p>
                  </div>
                )}
              </CardBody>
            </Card>

            {member.household && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary-900">Familia / Hogar</CardTitle>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary-400" />
                    <div>
                      <p className="font-medium text-primary-900">{member.household.name}</p>
                      {member.household.address && (
                        <p className="text-sm text-primary-600">
                          {member.household.address}
                          {member.household.city && `, ${member.household.city}`}
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {member.emergency_contact_name && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary-900">Contacto de Emergencia</CardTitle>
                </CardHeader>
                <CardBody className="pt-0 grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Nombre</label>
                    <p className="text-primary-900">{member.emergency_contact_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Teléfono</label>
                    <p className="text-primary-900">{member.emergency_contact_phone || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Relación</label>
                    <p className="text-primary-900">{member.emergency_contact_relationship || 'No especificada'}</p>
                  </div>
                </CardBody>
              </Card>
            )}

            {member.allergies_medical && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary-900">Información Médica</CardTitle>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-primary-900 whitespace-pre-wrap">{member.allergies_medical}</p>
                </CardBody>
              </Card>
            )}

            {member.notes && (
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-primary-900 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Notas Administrativas / Pastorales
                  </CardTitle>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-primary-900 whitespace-pre-wrap">{member.notes}</p>
                </CardBody>
              </Card>
            )}

            {(member.facebook_url || member.instagram_url) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary-900">Redes Sociales</CardTitle>
                </CardHeader>
                <CardBody className="pt-0 flex flex-wrap gap-4">
                  {member.facebook_url && (
                    <a href={member.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <span className="text-lg">📘</span> Facebook
                    </a>
                  )}
                  {member.instagram_url && (
                    <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-600 hover:underline">
                      <span className="text-lg">📷</span> Instagram
                    </a>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  )
}