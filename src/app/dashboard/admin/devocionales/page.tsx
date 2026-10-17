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

    await supabase.from('sermons').insert({
      ...data,
      type: 'devocional',
      is_published: true
    })
    
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administrar Devocionales</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Título del devocional" required />
            <Textarea name="content" placeholder="Contenido del devocional" />
            <Button type="submit" loading={loading}>Guardar Devocional</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
