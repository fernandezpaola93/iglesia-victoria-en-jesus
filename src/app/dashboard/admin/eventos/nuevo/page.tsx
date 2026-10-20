'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Button } from '@/components/ui'
import { EventForm } from '@/components/events/EventForm'
import { EMPTY_EVENT_FORM, eventFormToRow, type EventFormState } from '@/lib/events'

export default function NewEventPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<EventFormState>(EMPTY_EVENT_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase.from('events').insert(eventFormToRow(formData))

      if (error) {
        if (error.code === '42501') {
          throw new Error('No tienes permisos para crear eventos (RLS). Ejecuta add-events-news-link.sql en el SQL Editor de Supabase.')
        }
        throw error
      }

      router.push('/dashboard/admin/eventos')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al crear el evento')
    } finally {
      setSaving(false)
    }
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
            <CardTitle className="text-primary-900">Crear Nuevo Evento</CardTitle>
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
                  {saving ? 'Guardando...' : 'Guardar Evento'}
                </Button>
                <Link href="/dashboard/admin/eventos">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
