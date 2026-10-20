'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardBody } from '@/components/ui/Card'

interface Sermon {
  id: string
  title: string
  slug: string
  speaker: string
  sermon_date: string
  thumbnail_url: string | null
  video_url: string | null
  description: string | null
  duration_minutes: number | null
  content: string | null
}

function getYoutubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
  } catch {}
  return null
}

export default function PredicacionPage({ params }: { params: { slug: string } }) {
  const [sermon, setSermon] = useState<Sermon | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchPredicacion() {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setSermon(data)
      }
      setLoading(false)
    }
    fetchPredicacion()
  }, [supabase, params.slug])

  if (loading) return <div className="container-custom py-16 text-center">Cargando predicación...</div>
  if (notFound || !sermon) return <div className="container-custom py-16 text-center">Predicación no encontrada.</div>

  return (
    <div className="container-custom py-16">
      <Card>
        <CardBody className="p-8">
          {sermon.video_url && (
            <div className="aspect-video rounded-xl overflow-hidden bg-primary-100 mb-6">
              <VideoPlayer src={sermon.video_url} title={sermon.title} />
            </div>
          )}
          {sermon.thumbnail_url && !sermon.video_url && (
            <img src={sermon.thumbnail_url} alt={sermon.title} className="w-full h-48 object-cover rounded-lg mb-6" />
          )}
          <h1 className="font-display text-3xl font-bold text-primary-900 mb-2">{sermon.title}</h1>
          <p className="text-sm text-primary-600 mb-2">{sermon.speaker}</p>
          <div className="flex items-center gap-2 text-xs text-primary-500 mb-6">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(sermon.sermon_date).toLocaleDateString('es-ES')}
            </span>
            {sermon.duration_minutes && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {sermon.duration_minutes} min
              </span>
            )}
          </div>
          {sermon.description && (
            <div className="prose prose-sm text-primary-700 max-w-none mb-6">{sermon.description}</div>
          )}
          {sermon.content && (
            <div className="prose prose-sm text-primary-700 max-w-none">{sermon.content}</div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

function VideoPlayer({ src, title }: { src: string; title: string }) {
  const ytId = getYoutubeId(src)
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?rel=0`}
        title={title}
        className="w-full h-full"
        allowFullScreen
        loading="lazy"
      />
    )
  }
  return <video src={src} controls className="w-full h-full" preload="none" />
}
