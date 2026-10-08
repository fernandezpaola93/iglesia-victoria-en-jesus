'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Users, BookOpen, Shield, Calendar, ChevronLeft, ChevronRight, Music, Heart, Settings, User, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { Ministry, Member } from '@/lib/types'
import { formatShortDate, cn } from '@/lib/utils'
import Link from 'next/link'

const CATEGORY_OPTIONS = ['Todas', 'Alabanza', 'Enseñanza', 'Servicio', 'Evangelismo', 'Cuidado', 'Administración', 'Otro']

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')

  const supabase = createClient()

  useEffect(() => {
    fetchMinistries()
  }, [search, categoryFilter])

  const fetchMinistries = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('ministries')
        .select('*, leader:members!leader_id(*)')
        .order('name', { ascending: true })

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      if (categoryFilter !== 'Todas') {
        query = query.eq('category', categoryFilter)
      }

      const { data, error } = await query
      if (error) throw error
      setMinistries(data || [])
    } catch (error) {
      console.error('Error fetching ministries:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Ministerios</h1>
          <p className="text-primary-600 mt-1">Gestiona los ministerios y equipos de servicio</p>
        </div>
        <Link href="/dashboard/ministerios/nuevo">
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Nuevo Ministerio
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Buscar ministerio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                aria-label="Buscar ministerios"
              />
            </div>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-48 pr-8"
              aria-label="Filtrar por categoría"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Ministries Grid */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600 mx-auto mb-3" aria-label="Cargando..." />
              <p className="text-primary-500">Cargando ministerios...</p>
            </div>
          ) : ministries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-400" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-medium text-primary-900 mb-2">No hay ministerios</h3>
              <p className="text-primary-500 mb-6">Comienza creando el primer ministerio de tu iglesia</p>
              <Link href="/dashboard/ministerios/nuevo">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Crear ministerio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {ministries.map((ministry) => (
                <Link
                  key={ministry.id}
                  href={`/dashboard/ministerios/${ministry.id}`}
                  className="p-4 rounded-lg border border-primary-100 hover:border-accent-300 hover:bg-accent-50 transition-colors h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary-100 text-primary-700">
                      {ministry.category === 'Alabanza' && <Music className="h-6 w-6" />}
                      {ministry.category === 'Enseñanza' && <BookOpen className="h-6 w-6" />}
                      {ministry.category === 'Servicio' && <Users className="h-6 w-6" />}
                      {ministry.category === 'Evangelismo' && <Heart className="h-6 w-6" />}
                      {ministry.category === 'Cuidado' && <Shield className="h-6 w-6" />}
                      {ministry.category === 'Administración' && <Settings className="h-6 w-6" />}
                    </div>
                    <Badge variant="category" value={ministry.category}>
                      {ministry.category}
                    </Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">{ministry.name}</h3>
                  <p className="text-primary-600 text-sm mb-4 line-clamp-2">{ministry.description || 'Sin descripción'}</p>
                  <div className="space-y-2 text-sm text-primary-500">
                    {ministry.leader && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" aria-hidden="true" />
                        <span>Líder: {ministry.leader.first_name} {ministry.leader.last_name}</span>
                      </div>
                    )}
                    {ministry.meeting_day && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <span>{ministry.meeting_day} {ministry.meeting_time ? `• ${ministry.meeting_time}` : ''}</span>
                      </div>
                    )}
                    {ministry.meeting_location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        <span>{ministry.meeting_location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-primary-400">
                      <Users className="h-4 w-4" aria-hidden="true" />
                      <span>0 miembros</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}