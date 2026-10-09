'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Button, Input, Textarea, Select, Checkbox, Badge } from '@/components/ui'
import { News, NewsCategory } from '@/lib/types'

interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string
  category: NewsCategory
  is_published: boolean
  is_featured: boolean
}

const CATEGORIES: NewsCategory[] = ['General', 'Eventos', 'Anuncios', 'Testimonios', 'Oración', 'Otro']

export default function EditNewsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    category: 'General',
    is_published: false,
    is_featured: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchNews()
  }, [id])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          featured_image_url: data.featured_image_url || '',
          category: data.category,
          is_published: data.is_published,
          is_featured: data.is_featured,
        })
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar la noticia')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('news')
        .update({
          ...formData,
          published_at: formData.is_published ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      router.push('/dashboard/admin/noticias')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la noticia')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) return
    try {
      const { error } = await supabase.from('news').delete().eq('id', id)
      if (error) throw error
      router.push('/dashboard/admin/noticias')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la noticia')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <Card>
            <CardBody className="p-6">
              <div className="h-6 w-1/4 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/admin/noticias" className="inline-flex items-center text-primary-600 hover:text-primary-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver a Noticias
        </Link>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-primary-900">Editar Noticia</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={formData.is_published ? 'success' : 'default'} value={formData.is_published ? 'published' : 'draft'}>
                {formData.is_published ? 'Publicada' : 'Borrador'}
              </Badge>
              {formData.is_featured && (
                <Badge variant="warning" value="featured">Destacada</Badge>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-primary-700 mb-1">
                  Título *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Título de la noticia"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-primary-700 mb-1">
                  Slug (URL) *
                </label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="mi-nueva-noticia"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-primary-700 mb-1">
                  Categoría *
                </label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-primary-700 mb-1">
                  Extracto
                </label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Resumen breve que se muestra en listados..."
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-primary-700 mb-1">
                  Contenido *
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={10}
                  placeholder="Contenido completo de la noticia (soporta HTML básico)..."
                  className="w-full font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="featured_image_url" className="block text-sm font-medium text-primary-700 mb-1">
                  Imagen destacada (URL)
                </label>
                <Input
                  id="featured_image_url"
                  name="featured_image_url"
                  value={formData.featured_image_url}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-primary-700">Publicada</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-primary-700">Destacada en portada</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Link href="/dashboard/admin/noticias">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
                <Button type="button" variant="danger" onClick={handleDelete} className="ml-auto">
                  Eliminar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}