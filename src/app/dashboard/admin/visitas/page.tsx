'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, ChevronDown, ChevronUp, Edit, Phone, Mail, Calendar, Users, AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { formatShortDate } from '@/lib/utils'

const STATUS_OPTIONS = ['Todos', 'pendiente', 'confirmado', 'completado', 'cancelado']
const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  completado: 'Completado',
  cancelado: 'Cancelado',
}
const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmado: 'bg-green-100 text-green-700 border-green-200',
  completado: 'bg-blue-100 text-blue-700 border-blue-200',
  cancelado: 'bg-red-100 text-red-700 border-red-200',
}

interface Visit {
  id: string
  name: string
  email: string
  phone: string
  preferred_date: string | null
  preferred_service: string | null
  guests: string | null
  kids_ages: string | null
  notes: string | null
  status: string
  created_at: string
}

export default function VisitasPage() {
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 20
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  const supabase = createClient()

  useEffect(() => {
    fetchVisits()
  }, [search, statusFilter, page])

  const fetchVisits = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter && statusFilter !== 'Todos') params.set('status', statusFilter)
      params.set('page', page.toString())
      params.set('pageSize', pageSize.toString())

      const response = await fetch(`/api/visitas?${params.toString()}`)
      if (!response.ok) throw new Error('Error al cargar visitas')

      const result = await response.json()
      setVisits(result.data || [])
      setTotalCount(result.count || 0)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      const response = await fetch(`/api/visitas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error('Error al actualizar')
      await fetchVisits()
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
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-6">Visitas Programadas</h1>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Visitas Programadas</h1>
            <p className="text-primary-600 mt-1">Personas que han planificado su visita</p>
          </div>
          <div className="flex items-center gap-2">
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
            >              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'Todos' ? 'Todos los estados' : STATUS_LABELS[s]}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-primary-600 text-sm">
            {totalCount} visita{totalCount !== 1 ? 's' : ''} encontrada{totalCount !== 1 ? 's' : ''}
          </p>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm divide-y divide-primary-200">
                <thead className="bg-primary-50 text-primary-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Visitante</th>
                    <th className="px-4 py-3 text-left font-medium">Contacto</th>
                    <th className="px-4 py-3 text-left font-medium">Fecha preferida</th>
                    <th className="px-4 py-3 text-left font-medium">Culto</th>
                    <th className="px-4 py-3 text-left font-medium">Personas</th>
                    <th className="px-4 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3 text-left font-medium">Solicitado</th>
                    <th className="px-4 py-3 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {visits.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-primary-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" aria-hidden="true" />
                        <p>No se encontraron visitas</p>
                      </td>
                    </tr>
                  ) : (
                    visits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-primary-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-xs">
                              {visit.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-primary-900">{visit.name}</p>
                              <p className="text-xs text-primary-500">{visit.kids_ages ? `Con niños: ${visit.kids_ages}` : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-primary-400" aria-hidden="true" />
                              <span className="text-primary-600 truncate block max-w-[200px]">{visit.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-primary-400" aria-hidden="true" />
                              <a href={`tel:${visit.phone}`} className="text-accent-600 hover:underline truncate block max-w-[200px]">{visit.phone}</a>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary-500" aria-hidden="true" />
                            <span className="text-primary-700">{visit.preferred_date ? formatShortDate(visit.preferred_date) : 'Sin fecha'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-primary-600 text-xs">{visit.preferred_service || 'Cualquiera'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-primary-700 font-medium">{visit.guests || '1'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={visit.status === 'pendiente' ? 'warning' : 'default'}
                            className={STATUS_COLORS[visit.status] || 'bg-gray-100 text-gray-700'}
                          >
                            {STATUS_LABELS[visit.status] || visit.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-primary-500 text-xs whitespace-nowrap">{formatShortDate(visit.created_at)}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Select
                            value={visit.status}
                            onChange={(e) => updateStatus(visit.id, e.target.value)}
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
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente <ChevronRight className="h-4 w-4" />
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
