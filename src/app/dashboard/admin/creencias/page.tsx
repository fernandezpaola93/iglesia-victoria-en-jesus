'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Pencil, Trash2, X } from 'lucide-react'
import { Card, CardBody, Button, Input, Textarea } from '@/components/ui'

interface Belief {
  id: string
  title: string
  description: string
}

export default function AdminCreenciasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [beliefs, setBeliefs] = useState<Belief[]>([])
  const [beliefsLoading, setBeliefsLoading] = useState(true)
  const [beliefsError, setBeliefsError] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [editingBeliefId, setEditingBeliefId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
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
    const beliefData = { title: title.trim(), description: description.trim() }

    try {
      const result = editingBeliefId
        ? await supabase
            .from('beliefs')
            .update(beliefData)
            .eq('id', editingBeliefId)
            .select('id, title, description')
            .single()
        : await supabase
            .from('beliefs')
            .insert(beliefData)
            .select('id, title, description')
            .single()

      const { data: savedBelief, error } = result

      if (error) {
        if (error.code === '42P01' || error.code === 'PGRST205') {
          throw new Error('La tabla de creencias aún no está configurada. Ejecuta create-beliefs-table.sql en el SQL Editor de Supabase.')
        }
        if (error.code === '42501') {
          throw new Error('Supabase rechazó el guardado por permisos. Ejecuta create-beliefs-table.sql y confirma que tu usuario tenga el rol de administrador.')
        }
        throw new Error(error.message)
      }

      if (editingBeliefId) {
        setBeliefs((currentBeliefs) => currentBeliefs.map((belief) => (
          belief.id === savedBelief.id ? savedBelief : belief
        )))
        setSuccessMessage('La creencia se actualizó correctamente.')
      } else {
        setBeliefs((currentBeliefs) => [...currentBeliefs, savedBelief])
        setSuccessMessage('La creencia se guardó correctamente y ya aparecerá en la página pública.')
      }
      setEditingBeliefId(null)
      setTitle('')
      setDescription('')
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo guardar la creencia. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (belief: Belief) => {
    setEditingBeliefId(belief.id)
    setTitle(belief.title)
    setDescription(belief.description)
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const handleCancelEdit = () => {
    setEditingBeliefId(null)
    setTitle('')
    setDescription('')
    setErrorMessage(null)
  }

  const handleDelete = async (belief: Belief) => {
    if (!window.confirm(`¿Eliminar la creencia "${belief.title}"? Esta acción no se puede deshacer.`)) return

    setDeletingId(belief.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const { error } = await supabase.from('beliefs').delete().eq('id', belief.id)
      if (error) {
        if (error.code === '42501') {
          throw new Error('No tienes permisos para eliminar creencias. Confirma que tu usuario tenga el rol de administrador en Supabase.')
        }
        throw new Error(error.message)
      }

      setBeliefs((currentBeliefs) => currentBeliefs.filter((item) => item.id !== belief.id))
      if (editingBeliefId === belief.id) handleCancelEdit()
      setSuccessMessage('La creencia se eliminó correctamente.')
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo eliminar la creencia. Inténtalo de nuevo.')
    } finally {
      setDeletingId(null)
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
                <li key={belief.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-primary-900">{belief.title}</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-primary-600">{belief.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="px-3"
                      aria-label={`Editar ${belief.title}`}
                      onClick={() => handleEdit(belief)}
                      disabled={loading || deletingId !== null}
                    >
                      <Pencil className="mr-2 h-4 w-4" />Editar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="px-3 text-red-700 hover:text-red-800"
                      aria-label={`Eliminar ${belief.title}`}
                      onClick={() => void handleDelete(belief)}
                      loading={deletingId === belief.id}
                      disabled={loading || (deletingId !== null && deletingId !== belief.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />Eliminar
                    </Button>
                  </div>
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
            <h2 className="text-lg font-semibold text-primary-900">
              {editingBeliefId ? 'Editar creencia' : 'Agregar creencia'}
            </h2>
            <Input
              name="title"
              placeholder="Título de la creencia"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <Textarea
              name="description"
              placeholder="Descripción"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" loading={loading} disabled={deletingId !== null}>
                {editingBeliefId ? 'Guardar cambios' : 'Guardar Creencia'}
              </Button>
              {editingBeliefId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={loading}>
                  <X className="mr-2 h-4 w-4" />Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
