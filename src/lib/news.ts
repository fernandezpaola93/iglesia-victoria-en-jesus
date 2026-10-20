import type { NewsCategory } from '@/lib/types'

export interface NewsAuthor {
  first_name: string
  last_name: string
}

/**
 * PostgREST devuelve el embed author como objeto, pero su tipo lo declara
 * como arreglo. Esta funcion acepta ambas formas y devuelve null si no hay
 * autor (o si el visitante anon no puede ver la ficha del miembro).
 */
export function normalizeNewsAuthor(value: unknown): NewsAuthor | null {
  if (!value) return null

  const author = (Array.isArray(value) ? value[0] : value) as Partial<NewsAuthor> | undefined
  if (!author) return null

  return {
    first_name: author.first_name ?? '',
    last_name: author.last_name ?? '',
  }
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  'General',
  'Eventos',
  'Anuncios',
  'Testimonios',
  'Oración',
  'Otro',
]

export const NEWS_CATEGORY_STYLES: Record<NewsCategory, string> = {
  General: 'bg-primary-100 text-primary-800',
  Eventos: 'bg-green-100 text-green-800',
  Anuncios: 'bg-orange-100 text-orange-800',
  Testimonios: 'bg-purple-100 text-purple-800',
  Oración: 'bg-pink-100 text-pink-800',
  Otro: 'bg-gray-100 text-gray-800',
}

/**
 * Limpia el HTML basico que escribe el administrador en el cuerpo de la
 * noticia. Quita scripts, iframes y manejadores on* para que el contenido
 * no pueda ejecutar codigo en el navegador del visitante.
 */
export function sanitizeNewsHtml(html: string): string {
  if (!html) return ''

  return html
    .replace(/<\s*(script|iframe|object|embed|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*\/?\s*(script|iframe|object|embed)\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1=$2#$2')
}
