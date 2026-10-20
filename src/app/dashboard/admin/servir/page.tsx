'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, ChevronDown, ChevronUp, Edit, UserPlus, Mail, User, Phone, Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { formatShortDate } from '@/lib/utils'

const STATUS_OPTIONS = ['Todos', 'pendiente', 'contactado', 'asignado', 'activo', 'cerrado']
const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  contactado: 'Contactado',
  asignado: 'Asignado',
  activo: 'Activo',
  cerrado: 'Cerrado',
}
const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  contactado: 'bg-blue-100 text-blue-700 border-blue-200',
  asignado: 'bg-purple-100 text-purple-700 border-purple-200',
  activo: 'bg-green-100 text-green-700 border-green-200',
  cerrado: 'bg-gray-100 text-gray-700 border-gray-200',
}

interface ServeRequest {
  id: string
  name: string
  email: string
  phone: string | null
  areas: string[]
  experience: string | null
  availability: string | null
  status: string
  created_at: string
}

export default function ServirAdminPage() {
  const [serveRequests, setServeRequests] = useState<ServeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const pageSize = 20

  const supabase = createClient()

  useEffect(() => {
    fetchServeRequests()
  }, [search, statusFilter, page])

  const fetchServeRequests = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('serve_requests')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
      }

      if (statusFilter && statusFilter !== 'Todos') {
        query = query.eq('status', statusFilter)
      }

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      setServeRequests(data || [])
      setTotalCount(count || 0)
    } catch (error: any) {
      console.error(error)
      alert('Error al cargar solicitudes de servicio: ' + (error.message || 'Desconocido'))
    } finally {
      setLoading(false)
    }
  }

  const updateServeRequest = async (id: string, newStatus: string) => {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      const { error } = await supabase
        .from('serve_requests')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        throw error
      }

      await fetchServeRequests()
    } catch (error: any) {
      alert(error.message || 'Error al actualizar estado')
    } finally {
      setSaving(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-6">Solicitudes de Servicio</h1>
          <div className="grid gap-4">
            {[1,2,3,4,5,6].map(i => (
              <Card key={i}>
                <CardBody className="p-6">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-64 bg-gray-200 rounded" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const areaLabels: Record<string, string> = {
    worship: 'Alabanza y Adoración',
    teaching: 'Enseñanza / Escuela Dominical',
    children: 'Ministerio de Niños',
    youth: 'Juventud',
    usher: 'Ujieres / Bienvenida',
    tech: 'Equipo Técnico (Audio/Video/Streaming)',
    prayer: 'Oración / Intercesión',
    evangelism: 'Evangelismo / Alcance',
    hospitality: 'Hospitalidad / Café',
    decor: 'Decoración / Ambiente',
    admin: 'Administración / Oficina',
    maintenance: 'Mantenimiento / Limpieza',
    other: 'Otro',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Solicitudes de Servicio</h1>
            <p className="text-primary-600 mt-1">Personas que quieren servir en la iglesia</p>
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-2">
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="w-48"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'Todos' ? 'Todos los estados' : STATUS_LABELS[s]}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-primary-600 text-sm">
            {totalCount} solicitud{totalCount !== 1 ? 'es' : ''} encontrada{totalCount !== 1 ? 's' : ''}
          </p>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm divide-y divide-primary-200">
                <thead className="bg-primary-50 text-primary-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Persona</th>
                    <th className="px-4 py-3 text-left font-medium">Contacto</th>
                    <th className="px-4 py-3 text-left font-medium">Áreas de interés</th>
                    <th className="px-4 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3 text-left font-medium">Fecha</th>
                    <th className="px-4 py-3 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {serveRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-primary-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" aria-hidden="true" />
                        <p>No se encontraron solicitudes de servicio</p>
                      </td>
                    </tr>
                  ) : (
                    serveRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-primary-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-xs flex-shrink-0">
                              {req.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-primary-900 truncate">{req.name}</p>
                              <p className="text-xs text-primary-500 truncate block max-w-[200px]">{req.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-primary-400" aria-hidden="true" />
                              <span className="text-primary-600 truncate block max-w-[200px]">{req.phone || 'Sin teléfono'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-primary-400" aria-hidden="true" />
                              <a href={`mailto:${req.email}`} className="text-accent-600 hover:underline truncate block max-w-[200px]">{req.email}</a>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {req.areas.map((area) => (
                              <span key={area} className="px-2 py-0.5 rounded bg-primary-100 text-primary-700 text-xs">
                                {areaLabels[area] || area}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={req.status === 'pendiente' ? 'warning' : 'default'}
                            className={STATUS_COLORS[req.status] || 'bg-gray-100 text-gray-700'}
                          >
                            {STATUS_LABELS[req.status] || req.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-primary-500 text-xs whitespace-nowrap">{formatShortDate(req.created_at)}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Select
                            value={req.status}
                            onChange={(e) => updateServeRequest(req.id, e.target.value)}
                            className="w-32 text-xs bg-transparent border-transparent focus:ring-0"
                          >
                            {STATUS_OPTIONS.filter(s => s !== 'Todos').map((s) => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </Select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex -space-x-px">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
            <p className="text-primary-500 text-sm">
              Página {page} de {totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
