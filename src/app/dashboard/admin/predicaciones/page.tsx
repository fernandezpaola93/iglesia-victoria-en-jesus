'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Volume2, Calendar, Music } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatShortDate } from '@/lib/utils'
import { Sermon } from '@/lib/types'

interface SermonAuthor {
  first_name: string
  last_name: string
}

interface SermonRow {
  id: string
  title: string
  slug: string
  speaker: string
  series: string | null
  scripture_reference: string | null
  description: string | null
  content: string | null
  audio_url: string | null
  video_url: string | null
  thumbnail_url: string | null
  duration_minutes: number | null
  sermon_date: string
  is_published: boolean
  is_featured: boolean
  tags: string[]
  author_id: string | null
  created_at: string
  updated_at: string
  author?: SermonAuthor | null
}

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<SermonRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchSermons()
  }, [])

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select(`
          *,
          author:members!author_id (first_name, last_name)
        `)
        .order('sermon_date', { ascending: false })

      if (error) throw error
      setSermons(data || [])
    } catch (error) {
      console.error('Error fetching sermons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta predicación?')) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from('sermons').delete().eq('id', id)
      if (error) throw error
      setSermons(sermons.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting sermon:', error)
      alert('Error al eliminar la predicación')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '—'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => (
              <Card key={i}>
                <CardBody className="p-6">
                  <div className="h-6 w-1/4 bg-gray-200 rounded" />
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Predicaciones</h1>
            <p className="text-primary-600 mt-1">Gestionar predicaciones y sermones</p>
          </div>
          <Link href="/dashboard/admin/predicaciones/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Predicación
            </Button>
          </Link>
        </div>

        {sermons.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <Volume2 className="h-12 w-12 mx-auto text-primary-300 mb-4" />
              <h3 className="text-lg font-medium text-primary-900 mb-2">No hay predicaciones</h3>
              <p className="text-primary-500 mb-6">Comienza subiendo tu primera predicación</p>
              <Link href="/dashboard/admin/predicaciones/nueva">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Predicación
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Título</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Predicador</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Serie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Duración</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-primary-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sermons.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-primary-900 truncate max-w-xs">{item.title}</div>
                          {item.scripture_reference && (
                            <div className="text-sm text-primary-500 truncate max-w-xs mt-1">{item.scripture_reference}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">{item.speaker}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">{item.series || '—'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatShortDate(item.sermon_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">
                          <div className="flex items-center gap-1">
                            <Music className="h-3.5 w-3.5" />
                            {formatDuration(item.duration_minutes)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={item.is_published ? 'success' : 'default'} value={item.is_published ? 'published' : 'draft'}>
                            {item.is_published ? 'Publicada' : 'Borrador'}
                          </Badge>
                          {item.is_featured && (
                            <Badge variant="warning" value="featured" className="ml-1">
                              Destacada
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/admin/predicaciones/${item.id}/editar`}
                              className="text-primary-600 hover:text-primary-900 p-1.5 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/predicaciones/${item.slug}`}
                              target="_blank"
                              className="text-green-600 hover:text-green-900 p-1.5 rounded transition-colors"
                              title="Ver en sitio"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            {(item.audio_url || item.video_url) && (
                              <Link
                                href={item.audio_url || item.video_url || '#'}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-900 p-1.5 rounded transition-colors"
                                title={item.audio_url ? 'Escuchar audio' : 'Ver video'}
                              >
                                {item.audio_url ? <Volume2 className="h-4 w-4" /> : <Music className="h-4 w-4" />}
                              </Link>
                            )}
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                              className="text-red-600 hover:text-red-900 p-1.5 rounded transition-colors"
                              title="Eliminar"
                            >
                              {deletingId === item.id ? (
                                <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}