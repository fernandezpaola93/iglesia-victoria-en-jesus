import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { NewsCategory } from '@/lib/types'
import { NEWS_CATEGORY_STYLES, normalizeNewsAuthor, sanitizeNewsHtml, type NewsAuthor } from '@/lib/news'

interface NewsDetail {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  category: NewsCategory
  published_at: string | null
  created_at: string
  author?: NewsAuthor | null
}

export const dynamic = 'force-dynamic'

async function getNews(slug: string): Promise<NewsDetail | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('news')
    .select(`
      id, title, slug, excerpt, content, featured_image_url, category, published_at, created_at,
      author:members!author_id (first_name, last_name)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error || !data) return null

  const row = data as unknown as Omit<NewsDetail, 'author'> & { author: unknown }
  return { ...row, author: normalizeNewsAuthor(row.author) }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const news = await getNews(params.slug)

  if (!news) {
    return { title: 'Noticia no encontrada' }
  }

  const description = news.excerpt || `Lee la noticia: ${news.title}`

  return {
    title: news.title,
    description,
    openGraph: {
      title: news.title,
      description,
      type: 'article',
      publishedTime: news.published_at || undefined,
      images: news.featured_image_url ? [{ url: news.featured_image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description,
      images: news.featured_image_url ? [news.featured_image_url] : undefined,
    },
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await getNews(params.slug)

  if (!news) notFound()

  const authorName = news.author
    ? `${news.author.first_name} ${news.author.last_name}`.trim()
    : null
  const date = news.published_at || news.created_at

  return (
    <article className="container-custom py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/noticias"
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Noticias
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              NEWS_CATEGORY_STYLES[news.category]
            }`}
          >
            {news.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-primary-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(date)}
          </span>
          {authorName && (
            <span className="flex items-center gap-1.5 text-xs text-primary-500">
              <User className="h-3.5 w-3.5" />
              {authorName}
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4">
          {news.title}
        </h1>

        {news.excerpt && (
          <p className="text-lg text-primary-600 mb-6">{news.excerpt}</p>
        )}

        {news.featured_image_url && (
          <img
            src={news.featured_image_url}
            alt={news.title}
            className="w-full rounded-xl object-cover mb-8"
            loading="lazy"
          />
        )}

        {news.content && (
          <div
            className="prose prose-sm max-w-none text-primary-700"
            dangerouslySetInnerHTML={{ __html: sanitizeNewsHtml(news.content) }}
          />
        )}

        <div className="mt-12 pt-6 border-t border-primary-100">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </article>
  )
}
