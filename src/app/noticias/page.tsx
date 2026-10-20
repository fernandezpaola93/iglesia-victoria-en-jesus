'use client'

import { useEffect, useMemo, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Calendar, ArrowRight } from 'lucide-react'
import { formatShortDate } from '@/lib/utils'
import { NewsCategory } from '@/lib/types'
import { NEWS_CATEGORIES, NEWS_CATEGORY_STYLES, normalizeNewsAuthor, type NewsAuthor } from '@/lib/news'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  category: NewsCategory
  is_featured: boolean
  published_at: string | null
  author?: NewsAuthor | null
}

export default function PublicNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<NewsCategory | 'Todas'>('Todas')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase
        .from('news')
        .select(`
          id, title, slug, excerpt, featured_image_url, category, is_featured, published_at,
          author:members!author_id (first_name, last_name)
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false })

      if (!error) {
        const rows = (data || []) as unknown as (Omit<NewsItem, 'author'> & {
          author: unknown
        })[]
        setNews(rows.map((row) => ({ ...row, author: normalizeNewsAuthor(row.author) })))
      }
      setLoading(false)
    }
    fetchNews()
  }, [supabase])

  const availableCategories = useMemo(() => {
    const used = new Set(news.map((n) => n.category))
    return NEWS_CATEGORIES.filter((c) => used.has(c))
  }, [news])

  const filtered = useMemo(
    () => (category === 'Todas' ? news : news.filter((n) => n.category === category)),
    [news, category]
  )

  if (loading) return <div className="container-custom py-16 text-center">Cargando noticias...</div>

  return (
    <div className="container-custom py-16">
      <div className="max-w-3xl mb-8">
        <h1 className="font-display text-4xl font-bold text-primary-900 mb-3">Noticias</h1>
        <p className="text-primary-600">
          Anuncios, eventos y novedades de nuestra iglesia.
        </p>
      </div>

      {availableCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategory('Todas')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === 'Todas'
                ? 'bg-primary-900 text-white'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            Todas
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary-900 text-white'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-primary-600">No hay noticias disponibles actualmente.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow flex flex-col">
              {item.featured_image_url && (
                <img
                  src={item.featured_image_url}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              )}
              <CardBody className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      NEWS_CATEGORY_STYLES[item.category]
                    }`}
                  >
                    {item.category}
                  </span>
                  {item.is_featured && (
                    <span className="inline-flex items-center rounded-full bg-accent-100 text-accent-800 px-2.5 py-0.5 text-xs font-medium">
                      Destacada
                    </span>
                  )}
                </div>

                <h2 className="font-display text-lg font-semibold text-primary-900 mb-2">
                  {item.title}
                </h2>

                {item.excerpt && (
                  <p className="text-sm text-primary-600 mb-4 line-clamp-3">{item.excerpt}</p>
                )}

                <div className="mt-auto">
                  {item.published_at && (
                    <div className="flex items-center gap-1.5 text-xs text-primary-500 mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatShortDate(item.published_at)}
                    </div>
                  )}
                  <Link
                    href={`/noticias/${item.slug}`}
                    className="inline-flex items-center gap-1 text-accent-600 font-medium text-sm hover:underline"
                  >
                    Leer noticia
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
