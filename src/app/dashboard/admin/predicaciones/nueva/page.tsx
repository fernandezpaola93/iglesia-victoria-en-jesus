'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Button, Input, Textarea, Checkbox } from '@/components/ui'

interface FormData {
  title: string
  slug: string
  speaker: string
  series: string
  scripture_reference: string
  description: string
  content: string
  audio_url: string
  video_url: string
  thumbnail_url: string
  duration_minutes: string
  sermon_date: string
  is_published: boolean
  is_featured: boolean
  tags: string
}

export default function NewSermonPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    speaker: '',
    series: '',
    scripture_reference: '',
    description: '',
    content: '',
    audio_url: '',
    video_url: '',
    thumbnail_url: '',
    duration_minutes: '',
    sermon_date: new Date().toISOString().split('T')[0],
    is_published: false,
    is_featured: false,
    tags: '',
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

      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const { error } = await supabase.from('sermons').insert({
        ...formData,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        tags: tagsArray,
        author_id: user.id,
      })

      if (error) throw error

      router.push('/dashboard/admin/predicaciones')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al crear la predicación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/admin/predicaciones" className="inline-flex items-center text-primary-600 hover:text-primary-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver a Predicaciones
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary-900">Nueva Predicación</CardTitle>
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
                  placeholder="Título de la predicación"
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
                  placeholder="mi-nueva-predicacion"
                  className="w-full"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="speaker" className="block text-sm font-medium text-primary-700 mb-1">
                    Predicador *
                  </label>
                  <Input
                    id="speaker"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleChange}
                    required
                    placeholder="Nombre del predicador"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="sermon_date" className="block text-sm font-medium text-primary-700 mb-1">
                    Fecha *
                  </label>
                  <Input
                    id="sermon_date"
                    name="sermon_date"
                    type="date"
                    value={formData.sermon_date}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="series" className="block text-sm font-medium text-primary-700 mb-1">
                    Serie
                  </label>
                  <Input
                    id="series"
                    name="series"
                    value={formData.series}
                    onChange={handleChange}
                    placeholder="Nombre de la serie (ej: Romanos)"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="scripture_reference" className="block text-sm font-medium text-primary-700 mb-1">
                    Referencia bíblica
                  </label>
                  <Input
                    id="scripture_reference"
                    name="scripture_reference"
                    value={formData.scripture_reference}
                    onChange={handleChange}
                    placeholder="Ej: Romanos 8:28-30"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-primary-700 mb-1">
                  Descripción corta
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descripción breve para listados..."
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-primary-700 mb-1">
                  Contenido / Notas
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Notas de la predicación, outline, etc. (soporta HTML básico)..."
                  className="w-full font-mono text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="audio_url" className="block text-sm font-medium text-primary-700 mb-1">
                    URL de Audio (MP3)
                  </label>
                  <Input
                    id="audio_url"
                    name="audio_url"
                    value={formData.audio_url}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/predicacion.mp3"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="video_url" className="block text-sm font-medium text-primary-700 mb-1">
                    URL de Video (YouTube, Vimeo, etc.)
                  </label>
                  <Input
                    id="video_url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="thumbnail_url" className="block text-sm font-medium text-primary-700 mb-1">
                    Imagen miniatura (URL)
                  </label>
                  <Input
                    id="thumbnail_url"
                    name="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/miniatura.jpg"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="duration_minutes" className="block text-sm font-medium text-primary-700 mb-1">
                    Duración (minutos)
                  </label>
                  <Input
                    id="duration_minutes"
                    name="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    placeholder="45"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-primary-700 mb-1">
                  Etiquetas (separadas por comas)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="fe, esperanza, roman, salvación"
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
                  {loading ? 'Guardando...' : 'Guardar Predicación'}
                </Button>
                <Link href="/dashboard/admin/predicaciones">
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