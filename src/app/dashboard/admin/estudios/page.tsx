'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardBody, Button, Input, Textarea } from '@/components/ui'

export default function AdminEstudiosPage() {
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
      description: data.description,
      speaker: data.speaker,
      sermon_date: data.sermon_date || new Date().toISOString().split('T')[0],
      slug: slug,
      type: 'estudio',
      is_published: true
    })

    if (error) {
      console.error("Error al guardar:", error);
      alert('Error al guardar: ' + error.message)
    } else {
      alert('Guardado correctamente')
      router.refresh()
      router.push('/dashboard/admin/predicaciones') // O la ruta que prefieras
    }
    
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administrar Estudios Bíblicos</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Título del estudio" required />
            <Input name="speaker" placeholder="Maestro" required />
            <Input name="sermon_date" type="date" required />
            <Textarea name="description" placeholder="Descripción" />
            <Button type="submit" loading={loading}>Guardar Estudio</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
