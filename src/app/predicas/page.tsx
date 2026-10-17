'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Music, Volume2, Eye } from 'lucide-react'
import { formatShortDate } from '@/lib/utils'
import Link from 'next/link'

interface Sermon {
  id: string
  title: string
  slug: string
  speaker: string
  sermon_date: string
  thumbnail_url: string | null
  description: string | null
  duration_minutes: number | null
}

export default function PublicSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchPublicSermons() {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('is_published', true)
        .order('sermon_date', { ascending: false })

      if (!error) {
        setSermons(data || [])
      }
      setLoading(false)
    }
    fetchPublicSermons()
  }, [supabase])

  if (loading) return <div className="container-custom py-16 text-center">Cargando predicaciones...</div>

  return (
    <div className="container-custom py-16">
      <h1 className="font-display text-4xl font-bold text-primary-900 mb-8">Predicaciones</h1>
      
      {sermons.length === 0 ? (
        <p>No hay predicaciones disponibles actualmente.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <Card key={sermon.id} className="hover:shadow-lg transition-shadow">
              <CardBody className="p-4">
                {sermon.thumbnail_url && (
                  <img src={sermon.thumbnail_url} alt={sermon.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <h2 className="font-semibold text-lg text-primary-900 mb-2">{sermon.title}</h2>
                <p className="text-sm text-primary-600 mb-2">{sermon.speaker}</p>
                <div className="flex items-center gap-2 text-xs text-primary-500 mb-4">
                  <Calendar className="h-3 w-3" />
                  {formatShortDate(sermon.sermon_date)}
                </div>
                <Link href={`/predicaciones/${sermon.slug}`}>
                  <button className="text-accent-600 font-medium text-sm hover:underline">
                    Ver detalles
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
