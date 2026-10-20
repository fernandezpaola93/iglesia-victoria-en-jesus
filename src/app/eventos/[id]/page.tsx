import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowLeft, Ticket } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDate, cn } from '@/lib/utils'
import { createServerClient } from '@/lib/supabase/server'
import { EVENT_TYPE_STYLES } from '@/lib/events'

export const dynamic = 'force-dynamic'

interface EventRow {
  id: string
  title: string
  description: string | null
  event_type: string
  start_datetime: string
  end_datetime: string | null
  location: string | null
  requires_registration: boolean
  is_active: boolean
  news?: { slug: string; featured_image_url: string | null; excerpt: string | null } | null
}

async function getEvent(id: string): Promise<EventRow | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('events')
    .select(`
      id, title, description, event_type, start_datetime, end_datetime,
      location, requires_registration, is_active,
      news:news!news_id (slug, featured_image_url, excerpt)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null
  return data as unknown as EventRow
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const event = await getEvent(params.id)

  if (!event) return { title: 'Evento no encontrado' }

  return {
    title: event.title,
    description: event.description || `Evento: ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.description || undefined,
      type: 'article',
      images: event.news?.featured_image_url ? [event.news.featured_image_url] : undefined,
    },
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)

  if (!event) notFound()

  const isPast = new Date(event.start_datetime).getTime() < Date.now()

  return (
    <div className="container-custom py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/eventos"
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Eventos
        </Link>

        {event.news?.featured_image_url && (
          <img
            src={event.news.featured_image_url}
            alt={event.title}
            className="w-full rounded-xl object-cover mb-8"
          />
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              EVENT_TYPE_STYLES[event.event_type] || 'bg-gray-100 text-gray-800'
            )}
          >
            {event.event_type}
          </span>
          {isPast && (
            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs font-medium">
              Evento pasado
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-6">
          {event.title}
        </h1>

        <Card className="mb-8">
          <CardBody className="p-6 space-y-3 text-primary-700">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {formatDate(event.start_datetime, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {formatDate(event.start_datetime, { hour: '2-digit', minute: '2-digit' })}
                {event.end_datetime &&
                  ` - ${formatDate(event.end_datetime, { hour: '2-digit', minute: '2-digit' })}`}
              </span>
            </div>

            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{event.location}</span>
              </div>
            )}
          </CardBody>
        </Card>

        {event.description && (
          <p className="text-lg text-primary-700 mb-8">{event.description}</p>
        )}

        {event.requires_registration && (
          <div className="mb-8">
            <Link href="/contacto">
              <Button variant="accent" size="lg">
                <Ticket className="h-4 w-4 mr-2" aria-hidden="true" />
                Inscribirme
              </Button>
            </Link>
          </div>
        )}

        {event.news && (
          <div className="mt-10 pt-6 border-t border-primary-100">
            <Link
              href={`/noticias/${event.news.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:underline"
            >
              Leer la noticia completa
              <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
