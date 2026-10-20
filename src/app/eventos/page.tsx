import { Calendar, MapPin, Clock, Tag, Users, ArrowRight, BookOpen, Heart, GraduationCap } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
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
  news?: { slug: string; featured_image_url: string | null } | null
}

const regularSchedule = [
  { day: 'Domingos', events: ['10:00 AM - 12:00 PM - Culto Dominical'] },
  { day: 'Martes', events: ['6:00 PM - 7:00 PM - Oración'] },
  { day: 'Sábados', events: ['10:00 AM - 12:00 PM - Culto Juvenil'] },
]

const eventTypes = [
  { type: 'Culto', color: 'bg-primary-100 text-primary-800', icon: Calendar },
  { type: 'Estudio bíblico', color: 'bg-blue-100 text-blue-800', icon: BookOpen },
  { type: 'Conferencia', color: 'bg-purple-100 text-purple-800', icon: Users },
  { type: 'Retiro', color: 'bg-green-100 text-green-800', icon: MapPin },
  { type: 'Evento social', color: 'bg-pink-100 text-pink-800', icon: Heart },
  { type: 'Capacitación', color: 'bg-orange-100 text-orange-800', icon: GraduationCap },
  { type: 'Otro', color: 'bg-gray-100 text-gray-800', icon: Calendar },
]

const EVENT_COLUMNS = `
  id, title, description, event_type, start_datetime, end_datetime,
  location, requires_registration, is_active
`
const EVENT_COLUMNS_WITH_NEWS = `${EVENT_COLUMNS},
  news:news!news_id (slug, featured_image_url)
`

async function fetchEvents(columns: string, filter: 'upcoming' | 'past') {
  const supabase = createServerClient()
  const now = new Date().toISOString()

  const build = (cols: string) => {
    const base = supabase.from('events').select(cols).eq('is_active', true)
    return filter === 'upcoming'
      ? base.gte('start_datetime', now).order('start_datetime', { ascending: true }).limit(12)
      : base.lt('start_datetime', now).order('start_datetime', { ascending: false }).limit(3)
  }

  const res = await build(columns)
  if (!res.error) return res

  // Si la columna events.news_id todavia no existe, el embed falla.
  // Se reintenta sin el embed para no romper la pagina.
  const fallback = await build(EVENT_COLUMNS)
  return fallback.error ? res : fallback
}

async function getEvents(): Promise<{ upcoming: EventRow[]; past: EventRow[] }> {
  const [upcomingRes, pastRes] = await Promise.all([
    fetchEvents(EVENT_COLUMNS_WITH_NEWS, 'upcoming'),
    fetchEvents(EVENT_COLUMNS_WITH_NEWS, 'past'),
  ])

  return {
    upcoming: (upcomingRes.data || []) as unknown as EventRow[],
    past: (pastRes.data || []) as unknown as EventRow[],
  }
}

export default async function EventsPage() {
  const { upcoming, past } = await getEvents()

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="bg-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
        <div className="container-custom relative py-20 lg:py-28">
          <div className="max-w-3xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-800 text-accent-300 text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Próximos eventos</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Eventos y<br /><span className="text-accent-400">actividades</span>
            </h1>
            <p className="text-lg text-primary-200 mb-8 max-w-xl mx-auto">
              Siempre hay algo sucediendo. Encuentra tu lugar para conectar, crecer y servir.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/visita">
                <Button variant="accent" size="lg">
                  Planifica tu visita
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Más información
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-white container-custom">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Próximos Eventos</h2>
            <p className="text-primary-600">Eventos especiales y actividades programadas</p>
          </div>
          <Link href="/noticias" className="text-sm font-medium text-accent-600 hover:underline">
            Ver todas las noticias
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-12 bg-primary-50 rounded-xl">
            <Calendar className="h-12 w-12 mx-auto text-primary-300 mb-4" aria-hidden="true" />
            <p className="text-primary-600">
              No hay eventos programados por ahora. Vuelve pronto.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event) => {
              const typeInfo = eventTypes.find((t) => t.type === event.event_type) || eventTypes[eventTypes.length - 1]
              const TypeIcon = typeInfo.icon
              return (
                <Link key={event.id} href={`/eventos/${event.id}`} className="group">
                  <Card className="h-full overflow-hidden transition-all hover:shadow-xl">
                    {event.news?.featured_image_url ? (
                      <img
                        src={event.news.featured_image_url}
                        alt={event.title}
                        className="w-full h-32 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-32 bg-primary-100 relative overflow-hidden">
                        <div className="absolute top-3 right-3">
                          <Badge variant="category" value={event.event_type} className={cn(typeInfo.color, 'text-xs')}>
                            {event.event_type}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{formatDate(event.start_datetime, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                    )}
                    <CardBody className="p-5">
                      <h3 className="font-display text-lg font-semibold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-primary-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                      )}
                      <div className="space-y-2 text-sm text-primary-500">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                          <span>
                            {formatDate(event.start_datetime, { hour: '2-digit', minute: '2-digit' })}
                            {event.end_datetime && ` - ${formatDate(event.end_datetime, { hour: '2-digit', minute: '2-digit' })}`}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      {event.requires_registration && (
                        <div className="mt-4 pt-4 border-t border-primary-100">
                          <Button variant="primary" size="sm" className="w-full">
                            Inscribirse
                            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section className="section bg-primary-50 container-custom">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-8">Eventos recientes</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {past.map((event) => (
              <Link key={event.id} href={`/eventos/${event.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardBody className="p-5">
                    <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium mb-2', EVENT_TYPE_STYLES[event.event_type] || 'bg-gray-100 text-gray-800')}>
                      {event.event_type}
                    </span>
                    <h3 className="font-semibold text-primary-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-primary-500">
                      {formatDate(event.start_datetime, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Regular Schedule */}
      <section className="section bg-white container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-4">
              Horario Regular Semanal
            </h2>
            <p className="text-primary-600">
              Estas son nuestras actividades recurrentes cada semana. ¡Te esperamos!
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {regularSchedule.map((day, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                    <Calendar className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-primary-900">{day.day}</h3>
                </div>
                <ul className="space-y-2">
                  {day.events.map((event, i) => (
                    <li key={i} className="flex items-center gap-3 text-primary-600">
                      <span className="h-2 w-2 rounded-full bg-accent-500 flex-shrink-0" aria-hidden="true" />
                      <span>{event}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types Filter */}
      <section className="section bg-white container-custom">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-4">
            Tipos de Eventos
          </h2>
          <p className="text-primary-600">Filtrar por categoría de evento</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {eventTypes.map((type) => (
            <Badge key={type.type} variant="category" value={type.type} className={cn(type.color, 'cursor-pointer hover:opacity-80 transition-opacity')}>
              <type.icon className="w-3 h-3 mr-1" aria-hidden="true" />
              {type.type}
            </Badge>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary-900 container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            ¿Quieres servir en eventos?
          </h2>
          <p className="text-primary-300 mb-8">
            Necesitamos voluntarios para hospitalidad, técnica, montaje, registro y más.
          </p>
          <Link href="/contacto#servir">
            <Button variant="accent" size="lg">
              Quiero ser voluntario
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
