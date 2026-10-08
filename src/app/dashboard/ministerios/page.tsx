'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, Users, Calendar, Clock, MapPin, Edit, Trash2, ChevronLeft, ChevronRight, Target } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Ministry } from '@/lib/types'
import { formatShortDate } from '@/lib/utils'

const CATEGORY_OPTIONS = ['Alabanza', 'Enseñanza', 'Servicio', 'Evangelismo', 'Cuidado', 'Administración', 'Otro']
const STATUS_OPTIONS = ['Todos', 'Activo', 'Inactivo']

export default function MinisteriosPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 20

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  useEffect(() => {
    fetchMinistries()
  }, [search, categoryFilter, statusFilter, page])

  const fetchMinistries = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('ministries')
        .select('*, leader:members!leader_id(first_name, last_name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      if (categoryFilter !== 'Todos') {
        query = query.eq('category', categoryFilter)
      }

      if (statusFilter !== 'Todos') {
        query = query.eq('is_active', statusFilter === 'Activo')
      }

      const { data, error, count } = await query

      if (error) throw error
      setMinistries(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching ministries:', error)
    } finally {
      setLoading(false)
    }
  }

  const categoryColors: Record<string, string> = {
    'Alabanza': 'purple',
    'Enseñanza': 'blue',
    'Servicio': 'green',
    'Evangelismo': 'orange',
    'Cuidado': 'pink',
    'Administración': 'gray',
    'Otro': 'slate',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Ministerios</h1>
          <p className="text-primary-600 mt-1">Gestiona las áreas de servicio y ministerios de la iglesia</p>
        </div>
        <Link href="/dashboard/ministerios/nuevo">
          <Button variant="primary" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Ministerio
          </Button>
        </Link>
      </div>

      <Card>
        <CardBody className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" />
              <Input
                type="search"
                placeholder="Buscar por nombre, descripción..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10"
                aria-label="Buscar ministerios"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <Select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
                className="pr-8"
                aria-label="Filtrar por categoría"
              >
                <option value="Todos">Todas las categorías</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </div>

            <div className="relative w-full sm:w-40">
              <Select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="pr-8"
                aria-label="Filtrar por estado"
              >
                <option value="Todos">Todos</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600 mx-auto mb-3" />
              <p className="text-primary-500">Cargando ministerios...</p>
            </div>
          ) : ministries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="font-display text-lg font-medium text-primary-900 mb-2">No se encontraron ministerios</h3>
              <p className="text-primary-500 mb-6">Intenta ajustar tus filtros o registra el primer ministerio</p>
              <Link href="/dashboard/ministerios/nuevo">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar primer ministerio
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-50 border-b border-primary-100 text-xs font-semibold text-primary-500 uppercase tracking-wider">
                      <th className="px-6 py-4 text-left">Ministerio</th>
                      <th className="px-6 py-4 text-left">Categoría</th>
                      <th className="px-6 py-4 text-left">Líder</th>
                      <th className="px-6 py-4 text-left">Reunión</th>
                      <th className="px-6 py-4 text-left">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-100">
                    {ministries.map((ministry) => (
                      <tr key={ministry.id} className="hover:bg-primary-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-primary-900">{ministry.name}</p>
                          {ministry.description && (
                            <p className="text-sm text-primary-500 truncate max-w-xs">{ministry.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="category" value={ministry.category}>
                            {ministry.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-primary-600">
                          {ministry.leader ? (
                            <>
                              {ministry.leader.first_name} {ministry.leader.last_name}
                            </>
                          ) : (
                            <span className="text-primary-400 italic">Sin líder asignado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-primary-600">
                          <div className="space-y-1">
                            {ministry.meeting_day && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{ministry.meeting_day}</span>
                              </div>
                            )}
                            {ministry.meeting_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{ministry.meeting_time}</span>
                              </div>
                            )}
                            {ministry.meeting_location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate max-w-xs">{ministry.meeting_location}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="status" value={ministry.is_active ? 'Activo' : 'Inactivo'}>
                            {ministry.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/dashboard/ministerios/${ministry.id}/editar`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Editar">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (confirm('¿Eliminar este ministerio?')) {
                                  // TODO: implement delete
                                }
                              }}
                              aria-label="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalCount > pageSize && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-primary-100">
                  <p className="text-sm text-primary-600">
                    Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, totalCount)} de {totalCount} ministerios
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page * pageSize >= totalCount}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  )
}