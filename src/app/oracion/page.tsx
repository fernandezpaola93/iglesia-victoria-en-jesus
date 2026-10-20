'use client'

import { useEffect, useState } from 'react'
import { Church, Send, Heart, ShieldCheck, Mail, User, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface PrayerRequest {
  id: string
  name: string | null
  email: string | null
  request: string
  is_public: boolean
  status: string
  created_at: string
}

export default function OracionPage() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: '',
    isPublic: false,
  })

  useEffect(() => {
    fetchPrayers()
  }, [])

  const fetchPrayers = async () => {
    try {
      const res = await fetch('/api/oraciones/public')
      if (!res.ok) throw new Error('Error al cargar peticiones')
      const result = await res.json()
      setPrayers(result.data || [])
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus('idle')

    try {
      const res = await fetch('/api/oraciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', request: '', isPublic: false })
        await fetchPrayers()
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-primary-200 rounded mx-auto" />
            <div className="h-4 w-full bg-primary-100 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Church className="h-4 w-4" aria-hidden="true" />
            <span>Peticiones de Oración</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
            Comparte tu necesidad de oración
          </h1>
          <p className="text-primary-600">
            "Confía en el Señor de todo tu corazón y no te apoyes en tu propio entendimiento" — Proverbios 3:5
          </p>
        </div>

        {/* Formulario */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-primary-900">Enviar tu petición</CardTitle>
          </CardHeader>
          <CardBody className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="prayer-name">Tu nombre (opcional)</Label>
                  <Input
                    id="prayer-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Para seguimiento, si lo deseas"
                    className="bg-primary-50 border-primary-200 text-primary-900 placeholder-primary-400 focus:border-accent-500 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <Label htmlFor="prayer-email">Email (opcional)</Label>
                  <Input
                    id="prayer-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="bg-primary-50 border-primary-200 text-primary-900 placeholder-primary-400 focus:border-accent-500 focus:ring-accent-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="prayer-request">Tu petición de oración *</Label>
                <Textarea
                  id="prayer-request"
                  required
                  value={formData.request}
                  onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                  rows={4}
                  placeholder="Comparte tu necesidad, agradecimiento o alabanza..."
                  className="bg-primary-50 border-primary-200 text-primary-900 placeholder-primary-400 focus:border-accent-500 focus:ring-accent-500"
                />
              </div>
              <div className="flex items-start gap-2">
                <input
                  id="prayer-public"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-accent-600 bg-primary-50 border-primary-300 rounded focus:ring-accent-500 focus:ring-2 mt-0.5"
                />
                <Label htmlFor="prayer-public" className="text-sm text-primary-700 cursor-pointer">
                  <span className="font-medium">Compartir públicamente</span>
                  <br />
                  <span className="text-xs text-primary-500">
                    Si marcas esta casilla, tu petición se mostrará en esta página para que otros oren por ti.
                    Si no, solo el equipo pastoral la verá.
                  </span>
                </Label>
              </div>
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                    Enviar petición
                  </>
                )}
              </Button>
              {submitStatus === 'success' && (
                <p className="text-center text-green-600 text-sm font-medium">
                  ¡Petición enviada! Nuestro equipo de oración intercederá por ti.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-center text-red-600 text-sm font-medium">
                  Ocurrió un error al enviar. Inténtalo nuevamente.
                </p>
              )}
            </form>
          </CardBody>
        </Card>

        {/* Peticiones públicas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-primary-900">Peticiones Compartidas</CardTitle>
            <div className="flex items-center gap-1 text-xs text-primary-500">
              <Heart className="h-3 w-3" aria-hidden="true" />
              {prayers.length} oración{prayers.length !== 1 ? 'es' : ''} compartida{prayers.length !== 1 ? 's' : ''}
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {prayers.length === 0 ? (
              <div className="p-12 text-center">
                <Heart className="h-10 w-10 text-primary-200 mx-auto mb-3" aria-hidden="true" />
                <p className="text-primary-500 text-sm">No hay peticiones compartidas públicamente todavía.</p>
              </div>
            ) : (
              <div className="divide-y divide-primary-100">
                {prayers.map((prayer) => (
                  <div key={prayer.id} className="p-6 sm:p-8 hover:bg-primary-50 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium flex-shrink-0">
                        {prayer.name?.[0] || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary-900">
                          {prayer.name || 'Anónimo'}
                        </p>
                        <p className="text-xs text-primary-500 mt-0.5">
                          <Clock className="h-3 w-3 inline mr-1" aria-hidden="true" />
                          {new Date(prayer.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <Badge variant="default" className="ml-auto">
                        Pública
                      </Badge>
                    </div>
                    <p className="text-primary-700 leading-relaxed italic">
                      "{prayer.request}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
