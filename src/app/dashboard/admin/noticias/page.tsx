'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, FileText, Calendar } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatShortDate } from '@/lib/utils'
import { News, NewsCategory } from '@/lib/types'

interface NewsAuthor {
  first_name: string
  last_name: string
}

interface NewsRow {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  category: NewsCategory
  is_published: boolean
  is_featured: boolean
  published_at: string | null
  author_id: string | null
  created_at: string
  updated_at: string
  author?: NewsAuthor | null
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          author:members!author_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from('news').delete().eq('id', id)
      if (error) throw error
      setNews(news.filter(n => n.id !== id))
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Error al eliminar la noticia')
    } finally {
      setDeletingId(null)
    }
  }

  const getCategoryBadge = (category: NewsCategory) => {
    const colors: Record<NewsCategory, string> = {
      General: 'blue',
      Eventos: 'green',
      Anuncios: 'orange',
      Testimonios: 'purple',
      Oración: 'pink',
      Otro: 'gray'
    }
    return <Badge variant="status" value={category} className="whitespace-nowrap">{category}</Badge>
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
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-900">Noticias</h1>
            <p className="text-primary-600 mt-1">Gestionar noticias y anuncios de la iglesia</p>
          </div>
          <Link href="/dashboard/admin/noticias/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Noticia
            </Button>
          </Link>
        </div>

        {news.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-primary-300 mb-4" />
              <h3 className="text-lg font-medium text-primary-900 mb-2">No hay noticias</h3>
              <p className="text-primary-500 mb-6">Comienza creando tu primera noticia</p>
              <Link href="/dashboard/admin/noticias/nueva">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Noticia
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Autor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-primary-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {news.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-primary-900 truncate max-w-xs">{item.title}</div>
                          {item.excerpt && (
                            <div className="text-sm text-primary-500 truncate max-w-xs mt-1">{item.excerpt}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getCategoryBadge(item.category)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                          {item.author ? `${item.author.first_name} ${item.author.last_name}` : '—'}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatShortDate(item.created_at)}
                          </div>
                          {item.published_at && (
                            <div className="text-xs text-primary-400">
                              Publicada: {formatShortDate(item.published_at)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/admin/noticias/${item.id}/editar`}
                              className="text-primary-600 hover:text-primary-900 p-1.5 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/noticias/${item.slug}`}
                              target="_blank"
                              className="text-green-600 hover:text-green-900 p-1.5 rounded transition-colors"
                              title="Ver en sitio"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
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