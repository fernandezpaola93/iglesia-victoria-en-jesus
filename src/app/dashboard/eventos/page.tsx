'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Calendar, Filter, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { Event } from '@/lib/types'
import { formatDate, cn } from '@/lib/utils'
import Link from 'next/link'

const TYPE_OPTIONS = ['Todos', 'Culto', 'Estudio bíblico', 'Conferencia', 'Retiro', 'Evento social', 'Capacitación', 'Otro']
const FILTER_OPTIONS = [
  { value: 'upcoming', label: 'Próximos' },
  { value: 'past', label: 'Pasados' },
  { value: 'all', label: 'Todos' },
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [timeFilter, setTimeFilter] = useState('upcoming')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
  }, [search, typeFilter, timeFilter, page])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const now = new Date().toISOString()
      
      let query = supabase
        .from('events')
        .select('*, ministry:ministries(*)', { count: 'exact' })
        .order('start_datetime', { ascending: timeFilter === 'past' ? false : true })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (search) {
        query = query.ilike('title', `%${search}%`)
      }

      if (typeFilter !== 'Todos') {
        query = query.eq('event_type', typeFilter)
      }

      if (timeFilter === 'upcoming') {
        query = query.gte('start_datetime', now)
      } else if (timeFilter === 'past') {
        query = query.lt('start_datetime', now)
      }

      const { data, error, count } = await query
      if (error) throw error
      setEvents(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Culto': 'bg-primary-100 text-primary-800',
      'Estudio bíblico': 'bg-blue-100 text-blue-800',
      'Conferencia': 'bg-purple-100 text-purple-800',
      'Retiro': 'bg-green-100 text-green-800',
      'Evento social': 'bg-pink-100 text-pink-800',
      'Capacitación': 'bg-orange-100 text-orange-800',
      'Otro': 'bg-gray-100 text-gray-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Eventos</h1>
          <p className="text-primary-600 mt-1">Gestiona cultos, conferencias y actividades</p>
        </div>
        <Link href="/dashboard/eventos/nuevo">
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Nuevo Evento
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Buscar evento..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10"
                aria-label="Buscar eventos"
              />
            </div>
            <Select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
              className="w-full sm:w-40 pr-8"
              aria-label="Filtrar por tipo"
            >
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
            <Select
              value={timeFilter}
              onChange={(e) => { setTimeFilter(e.target.value); setPage(1) }}
              className="w-full sm:w-36 pr-8"
              aria-label="Filtrar por tiempo"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Events List */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600 mx-auto mb-3" aria-label="Cargando..." />
              <p className="text-primary-500">Cargando eventos...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary-400" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-medium text-primary-900 mb-2">No hay eventos</h3>
              <p className="text-primary-500 mb-6">{timeFilter === 'upcoming' ? 'No hay eventos próximos programados' : 'No hay eventos pasados'}</p>
              <Link href="/dashboard/eventos/nuevo">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Crear primer evento
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-primary-100">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/eventos/${event.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6 hover:bg-primary-50 transition-colors"
                >
                  {/* Date Badge */}
                  <div className="flex flex-col items-center sm:w-20 sm:flex-shrink-0 bg-primary-50 rounded-xl p-3 sm:p-4 min-w-[80px]">
                    <span className="font-display text-2xl font-bold text-primary-900">
                      {new Date(event.start_datetime).getDate()}
                    </span>
                    <span className="text-xs font-medium text-primary-600 uppercase">
                      {new Date(event.start_datetime).toLocaleDateString('es-MX', { month: 'short' })}
                    </span>
                    <span className="text-xs text-primary-500">
                      {new Date(event.start_datetime).getFullYear()}
                    </span>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-primary-900">{event.title}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getEventTypeColor(event.event_type))}>
                            {event.event_type}
                          </span>
                          {event.ministry && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
                              {event.ministry.name}
                            </span>
                          )}
                          {event.requires_registration && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent-100 text-accent-800">
                              Inscripción requerida
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-primary-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        {formatDate(event.start_datetime, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                        {event.end_datetime && ` - ${new Date(event.end_datetime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Ver detalles">
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="px-6 py-4 border-t border-primary-100 flex items-center justify-between">
              <p className="text-sm text-primary-600">
                Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, totalCount)} de {totalCount} eventos
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * pageSize >= totalCount}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}