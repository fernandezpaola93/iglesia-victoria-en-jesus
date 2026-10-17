'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardBody, Button, Input, Textarea } from '@/components/ui'

export default function AdminDevocionalesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())

    const title = data.title as string
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    const { error } = await supabase.from('sermons').insert({
      title: title,
      content: data.content,
      speaker: data.speaker || 'Anónimo', // Campo obligatorio
      sermon_date: data.sermon_date || new Date().toISOString().split('T')[0], // Campo obligatorio
      slug: slug,
      type: 'devocional',
      is_published: true
    })

    if (error) {
      console.error("Error al guardar:", error);
      alert('Error al guardar: ' + error.message)
    } else {
      alert('Guardado correctamente')
      router.refresh()
    }
    
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administrar Devocionales</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Título del devocional" required />
            <Input name="speaker" placeholder="Autor" required />
            <Input name="sermon_date" type="date" required />
            <Textarea name="content" placeholder="Contenido del devocional" />
            <Button type="submit" loading={loading}>Guardar Devocional</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
