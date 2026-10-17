'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardBody } from '@/components/ui/Card'
import { Calendar } from 'lucide-react'
import { formatShortDate } from '@/lib/utils'
import Link from 'next/link'

interface Devocional {
  id: string
  title: string
  slug: string
  sermon_date: string
  content: string | null
}

export default function DevocionalesPage() {
  const [devocionales, setDevocionales] = useState<Devocional[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchDevocionales() {
      const { data, error } = await supabase
        .from('sermons')
        .select('id, title, slug, sermon_date, content')
        .eq('is_published', true)
        .eq('type', 'devocional')
        .order('sermon_date', { ascending: false })

      if (!error) {
        setDevocionales(data || [])
      }
      setLoading(false)
    }
    fetchDevocionales()
  }, [supabase])

  if (loading) return <div className="container-custom py-16 text-center">Cargando devocionales...</div>

  return (
    <div className="container-custom py-16">
      <h1 className="font-display text-4xl font-bold text-primary-900 mb-8">Devocionales Diarios</h1>
      
      {devocionales.length === 0 ? (
        <p>No hay devocionales publicados actualmente.</p>
      ) : (
        <div className="grid gap-6">
          {devocionales.map((item) => (
            <Card key={item.id}>
              <CardBody className="p-6">
                <h2 className="font-semibold text-xl text-primary-900 mb-2">{item.title}</h2>
                <div className="flex items-center gap-2 text-xs text-primary-500 mb-4">
                  <Calendar className="h-3 w-3" />
                  {formatShortDate(item.sermon_date)}
                </div>
                <p className="text-primary-700 mb-4 line-clamp-3">{item.content}</p>
                <Link href={`/devocionales/${item.slug}`}>
                  <button className="text-accent-600 font-medium text-sm hover:underline">
                    Leer más
                  </button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
