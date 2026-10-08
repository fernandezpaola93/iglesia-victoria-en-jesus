'use client'

import { useEffect, useState } from 'react'
import { Search, Plus, Filter, ChevronDown, ChevronUp, Download, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { Member } from '@/lib/types'
import { formatShortDate, getInitials, cn } from '@/lib/utils'
import Link from 'next/link'

const STATUS_OPTIONS = ['Todos', 'Visitante', 'Miembro', 'Miembro activo', 'Miembro inactivo', 'Trasladado', 'Fallecido']
const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Más recientes' },
  { value: 'name_asc', label: 'Nombre (A-Z)' },
  { value: 'name_desc', label: 'Nombre (Z-A)' },
  { value: 'last_name_asc', label: 'Apellido (A-Z)' },
]

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('created_at_desc')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 20

  const supabase = createClient()

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter && statusFilter !== 'Todos') params.set('status', statusFilter)
      
      const response = await fetch(`/api/members/export?${params.toString()}`)
      if (!response.ok) throw new Error('Error al exportar')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `miembros_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      alert(err.message || 'Error al exportar')
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [search, statusFilter, sortBy, page])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('members')
        .select('*, households(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
      }

      if (statusFilter !== 'Todos') {
        query = query.eq('membership_status', statusFilter)
      }

      // Apply sorting
      switch (sortBy) {
        case 'name_asc':
          query = query.order('first_name', { ascending: true })
          break
        case 'name_desc':
          query = query.order('first_name', { ascending: false })
          break
        case 'last_name_asc':
          query = query.order('last_name', { ascending: true })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await query

      if (error) throw error
      setMembers(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Miembros</h1>
          <p className="text-primary-600 mt-1">Gestiona la base de datos de feligreses</p>
        </div>
        <Link href="/dashboard/miembros/nuevo">
          <Button variant="primary">
            <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
            Nuevo Miembro
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardBody className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Buscar por nombre, email, teléfono..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10"
                aria-label="Buscar miembros"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="w-full sm:w-48 pr-8"
                aria-label="Filtrar por estado"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400 pointer-events-none" aria-hidden="true" />
            </div>

            {/* Sort */}
            <div className="relative">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48 pr-8"
                aria-label="Ordenar por"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400 pointer-events-none" aria-hidden="true" />
            </div>

            {/* Export */}
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              {exporting ? 'Exportando...' : 'Exportar'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Members Table */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600 mx-auto mb-3" aria-label="Cargando..." />
              <p className="text-primary-500">Cargando miembros...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-400" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-medium text-primary-900 mb-2">No se encontraron miembros</h3>
              <p className="text-primary-500 mb-6">Intenta ajustar tus filtros o busca con otros términos</p>
              <Link href="/dashboard/miembros/nuevo">
                <Button variant="primary">
                  <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Registrar primer miembro
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-primary-50 border-b border-primary-100 text-xs font-semibold text-primary-500 uppercase tracking-wider">
                <div>Miembro</div>
                <div>Contacto</div>
                <div>Estado</div>
                <div>Familia</div>
                <div>Registrado</div>
                <div></div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-primary-100">
                {filteredMembers.map((member) => (
                  <Link
                    key={member.id}
                    href={`/dashboard/miembros/${member.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-primary-50 transition-colors group"
                  >
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
                      <Avatar
                        firstName={member.first_name}
                        lastName={member.last_name}
                        src={member.profile_photo_url}
                        size="md"
                      />
                      <div className="min-w-0 hidden sm:block">
                        <p className="font-medium text-primary-900 truncate">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-sm text-primary-500 truncate">
                          {member.preferred_name && `Conocido como: ${member.preferred_name}`}
                        </p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="hidden md:block md:w-48 text-sm text-primary-600">
                      <p className="truncate">{member.email || 'Sin email'}</p>
                      <p className="truncate">{member.phone || 'Sin teléfono'}</p>
                    </div>

                    {/* Status */}
                    <div className="hidden md:block md:w-32">
                      <Badge variant="status" value={member.membership_status}>
                        {member.membership_status}
                      </Badge>
                    </div>

                    {/* Household */}
                    <div className="hidden md:block md:w-32 text-sm text-primary-600 truncate">
                      {member.household?.name || 'Sin familia asignada'}
                    </div>

                    {/* Created */}
                    <div className="hidden md:block md:w-32 text-sm text-primary-500">
                      {formatShortDate(member.created_at)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Ver detalles">
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-primary-100">
            {filteredMembers.map((member) => (
              <Link
                key={member.id}
                href={`/dashboard/miembros/${member.id}`}
                className="p-4 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    firstName={member.first_name}
                    lastName={member.last_name}
                    src={member.profile_photo_url}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-primary-900 truncate">
                        {member.first_name} {member.last_name}
                      </p>
                      <Badge variant="status" value={member.membership_status}>
                        {member.membership_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-primary-500 truncate mt-1">{member.email || 'Sin email'}</p>
                    <p className="text-sm text-primary-500 truncate">{member.phone || 'Sin teléfono'}</p>
                    <p className="text-xs text-primary-400 mt-1">
                      {member.household?.name || 'Sin familia'} • {formatShortDate(member.created_at)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-primary-600">
            Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, totalCount)} de {totalCount} miembros
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
    </div>
  )
}