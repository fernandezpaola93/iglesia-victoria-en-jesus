'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardBody } from '@/components/ui/Card'
import { Calendar } from 'lucide-react'
import { formatShortDate } from '@/lib/utils'
import Link from 'next/link'

interface Estudio {
  id: string
  title: string
  slug: string
  sermon_date: string
  speaker: string
  description: string | null
}

export default function EstudiosBiblicosPage() {
  const [estudios, setEstudios] = useState<Estudio[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchEstudios() {
      const { data, error } = await supabase
        .from('sermons')
        .select('id, title, slug, sermon_date, speaker, description')
        .eq('is_published', true)
        .eq('type', 'estudio')
        .order('sermon_date', { ascending: false })

      if (!error) {
        setEstudios(data || [])
      }
      setLoading(false)
    }
    fetchEstudios()
  }, [supabase])

  if (loading) return <div className="container-custom py-16 text-center">Cargando estudios...</div>

  return (
    <div className="container-custom py-16">
      <h1 className="font-display text-4xl font-bold text-primary-900 mb-8">Estudios Bíblicos</h1>
      
      {estudios.length === 0 ? (
        <p>No hay estudios publicados actualmente.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {estudios.map((item) => (
            <Card key={item.id}>
              <CardBody className="p-6">
                <h2 className="font-semibold text-xl text-primary-900 mb-2">{item.title}</h2>
                <p className="text-sm text-primary-600 mb-2">Maestro: {item.speaker}</p>
                <div className="flex items-center gap-2 text-xs text-primary-500 mb-4">
                  <Calendar className="h-3 w-3" />
                  {formatShortDate(item.sermon_date)}
                </div>
                <p className="text-primary-700 mb-4 line-clamp-3">{item.description}</p>
                <Link href={`/estudios-biblicos/${item.slug}`}>
                  <button className="text-accent-600 font-medium text-sm hover:underline">
                    Ver estudio
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
