'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardBody, Button, Input, Textarea } from '@/components/ui'

interface Belief {
  id: string
  title: string
  description: string
}

export default function AdminCreenciasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [beliefs, setBeliefs] = useState<Belief[]>([])
  const [beliefsLoading, setBeliefsLoading] = useState(true)
  const [beliefsError, setBeliefsError] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const loadBeliefs = async () => {
      const { data, error } = await supabase
        .from('beliefs')
        .select('id, title, description')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) {
        setBeliefsError('No se pudieron cargar las creencias publicadas. Revisa que la tabla esté configurada en Supabase.')
      } else {
        setBeliefs(data || [])
      }
      setBeliefsLoading(false)
    }

    void loadBeliefs()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    try {
      const { data: createdBelief, error } = await supabase
        .from('beliefs')
        .insert({
          title: String(formData.get('title') || '').trim(),
          description: String(formData.get('description') || '').trim(),
        })
        .select('id, title, description')
        .single()

      if (error) {
        if (error.code === '42P01' || error.code === 'PGRST205') {
          throw new Error('La tabla de creencias aún no está configurada. Ejecuta create-beliefs-table.sql en el SQL Editor de Supabase.')
        }
        if (error.code === '42501') {
          throw new Error('Supabase rechazó el guardado por permisos. Ejecuta create-beliefs-table.sql y confirma que tu usuario tenga el rol de administrador.')
        }
        throw new Error(error.message)
      }

      form.reset()
      setBeliefs((currentBeliefs) => [...currentBeliefs, createdBelief])
      setSuccessMessage('La creencia se guardó correctamente y ya aparecerá en la página pública.')
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo guardar la creencia. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administrar Creencias</h1>
      <Card>
        <CardBody>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-primary-900">Creencias publicadas</h2>
              <p className="text-sm text-primary-600">Estas creencias aparecen en la página pública.</p>
            </div>
            <Link href="/creencias" target="_blank" rel="noopener noreferrer">
              <Button type="button" variant="outline">Ver página pública</Button>
            </Link>
          </div>

          {beliefsLoading ? (
            <p className="mb-6 text-sm text-primary-500">Cargando creencias...</p>
          ) : beliefsError ? (
            <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800" role="status">
              {beliefsError}
            </p>
          ) : beliefs.length === 0 ? (
            <p className="mb-6 text-sm text-primary-500">Todavía no hay creencias guardadas.</p>
          ) : (
            <ul className="mb-6 divide-y divide-gray-200 rounded-lg border border-gray-200">
              {beliefs.map((belief) => (
                <li key={belief.id} className="p-4">
                  <h3 className="font-medium text-primary-900">{belief.title}</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-primary-600">{belief.description}</p>
                </li>
              ))}
            </ul>
          )}

          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700" role="status">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Título de la creencia" required />
            <Textarea name="description" placeholder="Descripción" required />
            <Button type="submit" loading={loading}>Guardar Creencia</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
