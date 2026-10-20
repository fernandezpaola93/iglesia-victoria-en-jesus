import type { SupabaseClient } from '@supabase/supabase-js'

type Client = SupabaseClient<any, 'public', any>

export const EVENT_TYPES = [
  'Culto',
  'Estudio bíblico',
  'Conferencia',
  'Retiro',
  'Evento social',
  'Capacitación',
  'Otro',
] as const

export type EventType = (typeof EVENT_TYPES)[number]

export const EVENT_TYPE_STYLES: Record<string, string> = {
  'Culto': 'bg-primary-100 text-primary-800',
  'Estudio bíblico': 'bg-blue-100 text-blue-800',
  'Conferencia': 'bg-purple-100 text-purple-800',
  'Retiro': 'bg-green-100 text-green-800',
  'Evento social': 'bg-pink-100 text-pink-800',
  'Capacitación': 'bg-orange-100 text-orange-800',
  'Otro': 'bg-gray-100 text-gray-800',
}

export interface NewsEventForm {
  is_event: boolean
  event_type: string
  start_datetime: string
  end_datetime: string
  location: string
  requires_registration: boolean
}

export const EMPTY_NEWS_EVENT_FORM: NewsEventForm = {
  is_event: false,
  event_type: 'Otro',
  start_datetime: '',
  end_datetime: '',
  location: '',
  requires_registration: false,
}

export const RECURRENCE_FREQUENCIES = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
] as const

export interface EventFormState {
  title: string
  description: string
  event_type: string
  start_datetime: string
  end_datetime: string
  location: string
  max_capacity: string
  requires_registration: boolean
  is_recurring: boolean
  recurrence_frequency: string
  is_active: boolean
  ministry_id: string
}

export const EMPTY_EVENT_FORM: EventFormState = {
  title: '',
  description: '',
  event_type: 'Culto',
  start_datetime: '',
  end_datetime: '',
  location: '',
  max_capacity: '',
  requires_registration: false,
  is_recurring: false,
  recurrence_frequency: 'weekly',
  is_active: true,
  ministry_id: '',
}

/** Convierte el formulario en la fila de la tabla events. */
export function eventFormToRow(form: EventFormState) {
  return {
    title: form.title,
    description: form.description || null,
    event_type: form.event_type,
    start_datetime: form.start_datetime ? new Date(form.start_datetime).toISOString() : null,
    end_datetime: form.end_datetime ? new Date(form.end_datetime).toISOString() : null,
    location: form.location || null,
    max_capacity: form.max_capacity ? parseInt(form.max_capacity, 10) : null,
    requires_registration: form.requires_registration,
    is_recurring: form.is_recurring,
    recurrence_pattern: form.is_recurring ? { frequency: form.recurrence_frequency } : null,
    is_active: form.is_active,
    ministry_id: form.ministry_id || null,
  }
}

/** Convierte una fila de events en el estado del formulario. */
export function eventRowToForm(row: {
  title: string
  description: string | null
  event_type: string
  start_datetime: string
  end_datetime: string | null
  location: string | null
  max_capacity: number | null
  requires_registration: boolean
  is_recurring: boolean
  recurrence_pattern: Record<string, unknown> | null
  is_active: boolean
  ministry_id: string | null
}): EventFormState {
  const frequency = row.recurrence_pattern?.frequency

  return {
    title: row.title,
    description: row.description || '',
    event_type: row.event_type,
    start_datetime: toLocalDateTimeInput(row.start_datetime),
    end_datetime: toLocalDateTimeInput(row.end_datetime),
    location: row.location || '',
    max_capacity: row.max_capacity ? String(row.max_capacity) : '',
    requires_registration: row.requires_registration,
    is_recurring: row.is_recurring,
    recurrence_frequency: typeof frequency === 'string' ? frequency : 'weekly',
    is_active: row.is_active,
    ministry_id: row.ministry_id || '',
  }
}

/** Convierte un ISO a formato para <input type="datetime-local"> en hora local. */
export function toLocalDateTimeInput(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function buildEventRow(
  news: { title: string; excerpt: string | null; content: string; is_published?: boolean },
  form: NewsEventForm
) {
  return {
    title: news.title,
    description:
      (news.excerpt || stripHtml(news.content || '').slice(0, 280)) || null,
    event_type: form.event_type,
    start_datetime: form.start_datetime
      ? new Date(form.start_datetime).toISOString()
      : null,
    end_datetime: form.end_datetime ? new Date(form.end_datetime).toISOString() : null,
    location: form.location || null,
    requires_registration: form.requires_registration,
    is_recurring: false,
    // El evento solo es visible si la noticia esta publicada
    is_active: news.is_published !== false,
  }
}

/**
 * Crea, actualiza o elimina el evento asociado a una noticia.
 * Si el formulario tiene "Es un evento" desactivado, el evento se elimina.
 */
export async function syncEventForNews(
  supabase: Client,
  newsId: string,
  news: { title: string; excerpt: string | null; content: string; is_published?: boolean },
  form: NewsEventForm
): Promise<string | null> {
  if (!form.is_event) {
    const { error } = await supabase.from('events').delete().eq('news_id', newsId)
    if (error && !isMissingColumn(error)) throw error
    return null
  }

  const row = buildEventRow(news, form)

  const { data: existing, error: selectError } = await supabase
    .from('events')
    .select('id')
    .eq('news_id', newsId)
    .maybeSingle()

  if (selectError && isMissingColumn(selectError)) {
    throw new Error(
      'Falta la columna events.news_id. Ejecuta add-events-news-link.sql en el SQL Editor de Supabase.'
    )
  }

  if (existing?.id) {
    const { error } = await supabase.from('events').update(row).eq('id', existing.id)
    if (error) throw error
    return existing.id
  }

  const { data, error } = await supabase
    .from('events')
    .insert({ ...row, news_id: newsId })
    .select('id')
    .single()

  if (error) {
    if (isMissingColumn(error)) {
      throw new Error(
        'Falta la columna events.news_id. Ejecuta add-events-news-link.sql en el SQL Editor de Supabase.'
      )
    }
    throw error
  }

  return data?.id ?? null
}

function isMissingColumn(error: { code?: string; message?: string }): boolean {
  const message = error.message || ''
  return (
    error.code === '42703' ||
    error.code === 'PGRST204' ||
    error.code === 'PGRST100' ||
    /news_id|column .* does not exist|Could not find/i.test(message)
  )
}
