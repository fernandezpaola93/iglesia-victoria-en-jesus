'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Button } from '@/components/ui'
import { EventForm } from '@/components/events/EventForm'
import {
  EMPTY_EVENT_FORM,
  eventFormToRow,
  eventRowToForm,
  type EventFormState,
} from '@/lib/events'

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [formData, setFormData] = useState<EventFormState>(EMPTY_EVENT_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) setFormData(eventRowToForm(data))
    } catch (err: any) {
      setError(err.message || 'Error al cargar el evento')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('events')
        .update(eventFormToRow(formData))
        .eq('id', id)

      if (error) {
        if (error.code === '42501') {
          throw new Error('No tienes permisos para editar eventos (RLS). Ejecuta add-events-news-link.sql en el SQL Editor de Supabase.')
        }
        throw error
      }

      router.push('/dashboard/admin/eventos')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el evento')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return
    try {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
      router.push('/dashboard/admin/eventos')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el evento')
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
                {[1, 2, 3, 4].map((i) => (
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
        <Link
          href="/dashboard/admin/eventos"
          className="inline-flex items-center text-primary-600 hover:text-primary-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver a Eventos
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary-900">Editar Evento</CardTitle>
          </CardHeader>
          <CardBody>
            {error && (
              <div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <EventForm value={formData} onChange={setFormData} />

              <div className="flex gap-4 pt-4 border-t">
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Link href="/dashboard/admin/eventos">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="button" variant="outline" onClick={handleDelete} className="ml-auto text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
