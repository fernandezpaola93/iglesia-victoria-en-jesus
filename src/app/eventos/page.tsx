import { Calendar, MapPin, Clock, Tag, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDate, cn } from '@/lib/utils'

const upcomingEvents = [
  {
    id: 1,
    title: 'Culto de Celebración Dominical',
    type: 'Culto',
    date: '2024-12-08T09:00:00',
    endDate: '2024-12-08T10:30:00',
    location: 'Santuario Principal',
    description: 'Únete a nuestra celebración semanal con alabanza, oración y enseñanza bíblica.',
    ministry: 'Alabanza',
    recurring: true,
  },
  {
    id: 2,
    title: 'Escuela Dominical para Todas las Edades',
    type: 'Estudio bíblico',
    date: '2024-12-08T10:00:00',
    endDate: '2024-12-08T11:00:00',
    location: 'Edificio Educativo',
    description: 'Clases bíblicas para niños, jóvenes y adultos. Café y donas disponibles.',
    ministry: 'Enseñanza',
    recurring: true,
  },
  {
    id: 3,
    title: 'Conferencia Anual de Jóvenes "Fuego Nuevo"',
    type: 'Conferencia',
    date: '2024-12-20T19:00:00',
    endDate: '2024-12-22T14:00:00',
    location: 'Centro de Convenciones',
    description: 'Tres días de alabanza, enseñanza, talleres y convivencia para jóvenes 13-25 años.',
    ministry: 'Juventud',
    requiresRegistration: true,
  },
  {
    id: 4,
    title: 'Retiro de Hombres "Hombres de Valor"',
    type: 'Retiro',
    date: '2025-01-10T18:00:00',
    endDate: '2025-01-12T13:00:00',
    location: 'Campamento Monte Sión',
    description: 'Fin de semana de reflexión, hermandad y crecimiento espiritual para hombres.',
    ministry: 'Hombres',
    requiresRegistration: true,
  },
  {
    id: 5,
    title: 'Noche de Alabanza y Adoración',
    type: 'Evento social',
    date: '2024-12-13T19:00:00',
    endDate: '2024-12-13T21:00:00',
    location: 'Santuario Principal',
    description: 'Noche extendida de alabanza, oración y buscar la presencia de Dios.',
    ministry: 'Alabanza',
  },
  {
    id: 6,
    title: 'Jornada de Evangelismo Comunitario',
    type: 'Otro',
    date: '2024-12-14T09:00:00',
    endDate: '2024-12-14T13:00:00',
    location: 'Parque Central',
    description: 'Salida a compartir el Evangelio en parques y plazas de la ciudad.',
    ministry: 'Evangelismo',
  },
]

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

import { BookOpen, Heart, GraduationCap } from 'lucide-react'

export default function EventsPage() {
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => {
            const typeInfo = eventTypes.find(t => t.type === event.type) || eventTypes[eventTypes.length - 1]
            const TypeIcon = typeInfo.icon
            return (
              <Link key={event.id} href={`/eventos/${event.id}`} className="group">
                <Card className="h-full overflow-hidden transition-all hover:shadow-xl">
                  <div className="h-32 bg-primary-100 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <Badge variant="category" value={event.type} className={cn(typeInfo.color, 'text-xs')}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{formatDate(event.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <CardBody className="p-5">
                    <h3 className="font-display text-lg font-semibold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-primary-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-primary-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        <span>
                          {formatDate(event.date, { hour: '2-digit', minute: '2-digit' })}
                          {event.endDate && ` - ${formatDate(event.endDate, { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        <span>{event.location}</span>
                      </div>
                      {event.ministry && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                          <span>{event.ministry}</span>
                        </div>
                      )}
                    </div>
                    {event.requiresRegistration && (
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
      </section>

      {/* Regular Schedule */}
      <section className="section bg-primary-50 container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-4">
              Horario Regular Semanal
            </h2>
            <p className="text-primary-600">
              Estas son nuestras actividades recurrentes cada semana. ¡Te esperamos!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <type.icon className="h-3 w-3 mr-1" aria-hidden="true" />
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