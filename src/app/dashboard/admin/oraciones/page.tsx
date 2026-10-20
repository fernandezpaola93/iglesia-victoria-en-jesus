'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, ChevronDown, ChevronUp, Edit, Church, Mail, User, Clock, AlertCircle, CheckCircle, Clock as ClockIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { formatShortDate } from '@/lib/utils'

const STATUS_OPTIONS = ['Todos', 'pendiente', 'orando', 'respondida', 'cerrada']
const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  orando: 'Orando',
  respondida: 'Respondida',
  cerrada: 'Cerrada',
}
const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  orando: 'bg-blue-100 text-blue-700 border-blue-200',
  respondida: 'bg-green-100 text-green-700 border-green-200',
  cerrada: 'bg-gray-100 text-gray-700 border-gray-200',
}

interface PrayerRequest {
  id: string
  name: string | null
  email: string | null
  request: string
  is_public: boolean
  status: string
  created_at: string
}

export default function OracionesAdminPage() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [publicFilter, setPublicFilter] = useState('Todos')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const pageSize = 20

  const supabase = createClient()

  useEffect(() => {
    fetchPrayers()
  }, [search, statusFilter, publicFilter, page])

  const fetchPrayers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter && statusFilter !== 'Todos') params.set('status', statusFilter)
      if (publicFilter && publicFilter !== 'Todos') params.set('is_public', publicFilter === 'Públicas' ? 'true' : 'false')
      params.set('page', page.toString())
      params.set('pageSize', pageSize.toString())

      const response = await fetch(`/api/oraciones?${params.toString()}`)
      if (!response.ok) throw new Error('Error al cargar peticiones')

      const result = await response.json()
      setPrayers(result.data || [])
      setTotalCount(result.count || 0)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updatePrayer = async (id: string, updates: { status?: string; is_public?: boolean }) => {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      const response = await fetch(`/api/oraciones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Error al actualizar')
      await fetchPrayers()
    } catch (error: any) {
      alert(error.message || 'Error al actualizar')
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
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-6">Peticiones de Oración</h1>
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
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Peticiones de Oración</h1>
            <p className="text-primary-600 mt-1">Gestionar peticiones de la congregación</p>
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-2">
            <Input
              placeholder="Buscar por nombre, email o petición..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="w-40"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'Todos' ? 'Todos los estados' : STATUS_LABELS[s]}</option>
              ))}
            </Select>
            <Select
              value={publicFilter}
              onChange={(e) => { setPublicFilter(e.target.value); setPage(1) }}
              className="w-40"
            >
              <option value="Todos">Todas</option>
              <option value="Públicas">Solo públicas</option>
              <option value="Privadas">Solo privadas (líderes)</option>
            </Select>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-primary-600 text-sm">
            {totalCount} petición{totalCount !== 1 ? 'es' : ''} encontrada{totalCount !== 1 ? 's' : ''}
          </p>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm divide-y divide-primary-200">
                <thead className="bg-primary-50 text-primary-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Persona</th>
                    <th className="px-4 py-3 text-left font-medium">Petición</th>
                    <th className="px-4 py-3 text-left font-medium">Visibilidad</th>
                    <th className="px-4 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3 text-left font-medium">Fecha</th>
                    <th className="px-4 py-3 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {prayers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-primary-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" aria-hidden="true" />
                        <p>No se encontraron peticiones</p>
                      </td>
                    </tr>
                  ) : (
                    prayers.map((prayer) => (
                      <tr key={prayer.id} className="hover:bg-primary-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-xs flex-shrink-0">
                              {prayer.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-primary-900 truncate">{prayer.name || 'Anónimo'}</p>
                              {prayer.email && (
                                <p className="text-xs text-primary-500 truncate block max-w-[200px]">{prayer.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-primary-700 leading-relaxed truncate block max-w-[400px]">{prayer.request}</p>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={prayer.is_public ? 'success' : 'default'}
                            className={prayer.is_public ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                          >
                            {prayer.is_public ? 'Pública' : 'Solo líderes'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={prayer.status === 'pendiente' ? 'warning' : 'default'}
                            className={STATUS_COLORS[prayer.status] || 'bg-gray-100 text-gray-700'}
                          >
                            {STATUS_LABELS[prayer.status] || prayer.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-primary-500 text-xs whitespace-nowrap">{formatShortDate(prayer.created_at)}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center gap-2">
                            <Select
                              value={prayer.status}
                              onChange={(e) => updatePrayer(prayer.id, { status: e.target.value })}
                              className="w-36 text-xs bg-transparent border-transparent focus:ring-0"
                            >
                              {STATUS_OPTIONS.filter(s => s !== 'Todos').map((s) => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                              ))}
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updatePrayer(prayer.id, { is_public: !prayer.is_public })}
                              disabled={saving[prayer.id]}
                              className="h-8 w-8 p-0"
                              aria-label={prayer.is_public ? 'Ocultar de público' : 'Mostrar en público'}
                            >
                            {prayer.is_public ? (
                              <Church className="h-4 w-4 text-primary-500" aria-hidden="true" />
                            ) : (
                              <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            )}
                            </Button>
                          </div>
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
