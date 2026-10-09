'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Button, Input, Textarea, Select, Checkbox } from '@/components/ui'
import { NewsCategory } from '@/lib/types'

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

export default function NewNewsPage() {
  const router = useRouter()
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({ ...prev, title: value, slug: generateSlug(value) }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuario no autenticado')

      const { error } = await supabase.from('news').insert({
        ...formData,
        author_id: user.id,
        published_at: formData.is_published ? new Date().toISOString() : null,
      })

      if (error) throw error

      router.push('/dashboard/admin/noticias')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al crear la noticia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/admin/noticias" className="inline-flex items-center text-primary-600 hover:text-primary-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver a Noticias
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary-900">Crear Nueva Noticia</CardTitle>
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
                <p className="mt-1 text-xs text-primary-500">Se genera automáticamente del título. Usa solo letras, números y guiones.</p>
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
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Noticia'}
                </Button>
                <Link href="/dashboard/admin/noticias">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}