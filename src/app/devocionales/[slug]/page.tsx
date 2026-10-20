'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardBody } from '@/components/ui/Card'

interface Devocional {
  id: string
  title: string
  slug: string
  sermon_date: string
  content: string | null
}

export default function DevocionalPage({ params }: { params: { slug: string } }) {
  const [devocional, setDevocional] = useState<Devocional | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchDevocional() {
      const { data, error } = await supabase
        .from('sermons')
        .select('id, title, slug, sermon_date, content')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .eq('type', 'devocional')
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setDevocional(data)
      }
      setLoading(false)
    }
    fetchDevocional()
  }, [supabase, params.slug])

  if (loading) return <div className="container-custom py-16 text-center">Cargando devocional...</div>
  if (notFound || !devocional) return <div className="container-custom py-16 text-center">Devocional no encontrado.</div>

  return (
    <div className="container-custom py-16">
      <Card>
        <CardBody className="p-8">
          <h1 className="font-display text-3xl font-bold text-primary-900 mb-4">{devocional.title}</h1>
          <div className="text-xs text-primary-500 mb-6">{new Date(devocional.sermon_date).toLocaleDateString('es-ES')}</div>
          <div className="prose prose-sm text-primary-700 max-w-none">{devocional.content}</div>
        </CardBody>
      </Card>
    </div>
  )
}
