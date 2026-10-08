'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, Users, MapPin, Mail, Phone, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Household } from '@/lib/types'
import { formatShortDate } from '@/lib/utils'

export default function HogaresPage() {
  const [households, setHouseholds] = useState<Household[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 20

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  useEffect(() => {
    fetchHouseholds()
  }, [search, page])

  const fetchHouseholds = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('households')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (search) {
        query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
      }

      const { data, error, count } = await query

      if (error) throw error
      setHouseholds(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching households:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Hogares / Familias</h1>
          <p className="text-primary-600 mt-1">Gestiona los hogares y familias de la congregación</p>
        </div>
        <Link href="/dashboard/hogares/nuevo">
          <Button variant="primary" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Hogar
          </Button>
        </Link>
      </div>

      <Card>
        <CardBody className="p-4 sm:p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" />
            <Input
              type="search"
              placeholder="Buscar por nombre, dirección, ciudad, email, teléfono..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-10"
              aria-label="Buscar hogares"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600 mx-auto mb-3" />
              <p className="text-primary-500">Cargando hogares...</p>
            </div>
          ) : households.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="font-display text-lg font-medium text-primary-900 mb-2">No se encontraron hogares</h3>
              <p className="text-primary-500 mb-6">Intenta ajustar tu búsqueda o registra el primer hogar</p>
              <Link href="/dashboard/hogares/nuevo">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar primer hogar
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-50 border-b border-primary-100 text-xs font-semibold text-primary-500 uppercase tracking-wider">
                      <th className="px-6 py-4 text-left">Hogar</th>
                      <th className="px-6 py-4 text-left">Dirección</th>
                      <th className="px-6 py-4 text-left">Contacto</th>
                      <th className="px-6 py-4 text-left">Estado</th>
                      <th className="px-6 py-4 text-left">Registrado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-100">
                    {households.map((household) => (
                      <tr key={household.id} className="hover:bg-primary-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-primary-900">{household.name}</p>
                        </td>
                        <td className="px-6 py-4 text-primary-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate max-w-xs">
                              {household.address || 'Sin dirección'}
                              {household.city && `, ${household.city}`}
                              {household.state && `, ${household.state}`}
                              {household.zip_code && ` ${household.zip_code}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-primary-600">
                          <div className="space-y-1">
                            {household.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{household.email}</span>
                              </div>
                            )}
                            {household.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{household.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="status" value={household.is_active ? 'Activo' : 'Inactivo'}>
                            {household.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-primary-500">
                          {formatShortDate(household.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/dashboard/hogares/${household.id}/editar`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Editar">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (confirm('¿Eliminar este hogar?')) {
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
                    Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, totalCount)} de {totalCount} hogares
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