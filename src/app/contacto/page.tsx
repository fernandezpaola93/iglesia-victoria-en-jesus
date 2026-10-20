'use client'

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, UserPlus, Calendar, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Dirección',
    details: [
      'Centro Comercial La Casona, Piso 1',
      'Al lado del Puente, San Antonio de los Altos, Estado Miranda, Venezuela',
    ],
    link: null,
  },
  {
    icon: Phone,
    title: 'Teléfono',
    details: [
      '+584226177853'
    ],
    link: 'tel:+584226177853',
  },
  {
    icon: Mail,
    title: 'Email',
    details: [
      'victoriaenjesusvzla@gmail.com'
    ],
    link: 'mailto:victoriaenjesusvzla@gmail.com',
  },
  {
    icon: Clock,
    title: 'Horarios de Oficina',
    details: [
      'Lunes a Viernes: 9:00 AM - 5:00 PM',
      'Sábados: 9:00 AM - 1:00 PM',
      'Domingos: Cerrado (solo cultos)'
    ],
    link: null,
  },
]

export default function ContactPage() {
  const [serveFormData, setServeFormData] = useState({
    name: '',
    email: '',
    phone: '',
    areas: [] as string[],
    experience: '',
    availability: '',
  })
  const [serveSubmitting, setServeSubmitting] = useState(false)
  const [serveStatus, setServeStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleServeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServeSubmitting(true)
    setServeStatus('idle')

    try {
      const res = await fetch('/api/servir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serveFormData),
      })

      if (res.ok) {
        setServeStatus('success')
        setServeFormData({
          name: '',
          email: '',
          phone: '',
          areas: [],
          experience: '',
          availability: '',
        })
      } else {
        setServeStatus('error')
      }
    } catch {
      setServeStatus('error')
    } finally {
      setServeSubmitting(false)
    }
  }

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="bg-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
        <div className="container-custom relative py-20 lg:py-28">
          <div className="max-w-3xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-800 text-accent-300 text-sm font-medium mb-6">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Contáctanos</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Nos encantaría<br /><span className="text-accent-400">saber de ti</span>
            </h1>
            <p className="text-lg text-primary-200 mb-8 max-w-xl mx-auto">
              ¿Tienes preguntas? ¿Necesitas oración? ¿Quieres servir? Estamos aquí para ayudarte.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="section bg-white container-custom">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              <h2 className="font-display text-xl font-bold text-primary-900 mb-6">Información de Contacto</h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 flex-shrink-0">
                        <item.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary-900 mb-2">{item.title}</h3>
                        <div className="space-y-1 text-primary-600 text-sm">
                          {item.details.map((detail, i) => (
                            <p key={i}>{detail}</p>
                          ))}
                        </div>
                        {item.link && (
                          <a href={item.link} className="mt-2 inline-flex items-center gap-1 text-accent-600 hover:text-accent-700 text-sm font-medium">
                            {item.link.startsWith('tel') ? 'Llamar' : 'Enviar email'}
                            <Send className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Social */}
              <Card className="p-6 bg-primary-900 border-primary-800">
                <h3 className="font-semibold text-white mb-4">Síguenos</h3>
                <div className="flex gap-3">
                  {['Facebook', 'Instagram', 'YouTube', 'Spotify'].map((social) => (
                    <a key={social} href="#" className="h-10 w-10 rounded-lg bg-primary-800 flex items-center justify-center text-primary-300 hover:bg-accent-500 hover:text-primary-950 transition-colors" aria-label={social}>
                      {social.charAt(0)}
                    </a>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Form & Prayer */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Envíanos un mensaje</CardTitle>
              </CardHeader>
              <CardBody>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input id="name" required placeholder="Juan Pérez" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required placeholder="juan@email.com" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" placeholder="+52 55 1234 5678" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Asunto *</Label>
                    <select id="subject" required className="input">
                      <option value="">Selecciona un tema</option>
                      <option value="general">Información general</option>
                      <option value="visit">Planificar visita</option>
                      <option value="prayer">Petición de oración</option>
                      <option value="serve">Quiero servir</option>
                      <option value="membership">Membresía</option>
                      <option value="baptism">Bautismo</option>
                      <option value="marriage">Matrimonio</option>
                      <option value="counseling">Consejería</option>
                      <option value="donation">Donaciones</option>
                      <option value="press">Prensa/Medios</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea id="message" rows={5} required placeholder="Cuéntanos cómo podemos ayudarte..." />
                  </div>
                  <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                    <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                    Enviar mensaje
                  </Button>
                </form>
              </CardBody>
            </Card>

            {/* Serve Form */}
            <Card id="servir">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-6 w-6 text-accent-500" aria-hidden="true" />
                  <CardTitle className="text-primary-900">Quiero Servir</CardTitle>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-primary-600 mb-6">
                  Dios te ha dado dones para bendecir a su iglesia. Cuéntanos tus intereses y te conectaremos con el ministerio ideal.
                </p>
                <form className="space-y-4" onSubmit={handleServeSubmit}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="serve-name">Nombre *</Label>
                      <Input
                        id="serve-name"
                        required
                        value={serveFormData.name}
                        onChange={(e) => setServeFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div>
                      <Label htmlFor="serve-email">Email *</Label>
                      <Input
                        id="serve-email"
                        type="email"
                        required
                        value={serveFormData.email}
                        onChange={(e) => setServeFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="juan@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="serve-phone">Teléfono *</Label>
                    <Input
                      id="serve-phone"
                      type="tel"
                      required
                      value={serveFormData.phone}
                      onChange={(e) => setServeFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+58 422 6177853"
                    />
                  </div>
                  <div>
                    <Label htmlFor="serve-areas">Áreas de interés *</Label>
                    <select
                      id="serve-areas"
                      multiple
                      required
                      value={serveFormData.areas}
                      onChange={(e) => setServeFormData({ ...serveFormData, areas: Array.from(e.target.selectedOptions, o => o.value) })}
                      className="input min-h-[100px]"
                      size={5}
                    >
                      <option value="worship">Alabanza y Adoración</option>
                      <option value="teaching">Enseñanza / Escuela Dominical</option>
                      <option value="children">Ministerio de Niños</option>
                      <option value="youth">Juventud</option>
                      <option value="usher">Ujieres / Bienvenida</option>
                      <option value="tech">Equipo Técnico (Audio/Video/Streaming)</option>
                      <option value="prayer">Oración / Intercesión</option>
                      <option value="evangelism">Evangelismo / Alcance</option>
                      <option value="hospitality">Hospitalidad / Café</option>
                      <option value="decor">Decoración / Ambiente</option>
                      <option value="admin">Administración / Oficina</option>
                      <option value="maintenance">Mantenimiento / Limpieza</option>
                      <option value="other">Otro</option>
                    </select>
                    <p className="text-xs text-primary-500 mt-1">Mantén Ctrl/Cmd para seleccionar múltiples</p>
                  </div>
                  <div>
                    <Label htmlFor="serve-experience">Experiencia / Habilidades</Label>
                    <Textarea
                      id="serve-experience"
                      value={serveFormData.experience}
                      onChange={(e) => setServeFormData(prev => ({ ...prev, experience: e.target.value }))}
                      rows={3}
                      placeholder="¿Tienes experiencia previa, formación musical, docente, técnica, etc.?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="serve-availability">Disponibilidad</Label>
                    <Textarea
                      id="serve-availability"
                      value={serveFormData.availability}
                      onChange={(e) => setServeFormData(prev => ({ ...prev, availability: e.target.value }))}
                      rows={2}
                      placeholder="Días y horarios disponibles (ej: Domingos mañana, Miércoles noche, Sábados)"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={serveSubmitting}>
                    {serveSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                        Quiero servir
                      </>
                    )}
                  </Button>
                  {serveStatus === 'success' && (
                    <p className="text-center text-green-600 text-sm font-medium">
                      ¡Registro enviado! Te contactaremos para coordinar tu servicio.
                    </p>
                  )}
                  {serveStatus === 'error' && (
                    <p className="text-center text-red-600 text-sm font-medium">
                      Ocurrió un error al enviar. Inténtalo nuevamente.
                    </p>
                  )}
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section bg-primary-50 container-custom">
        <div className="aspect-video rounded-2xl bg-primary-200 flex items-center justify-center overflow-hidden">
          <iframe
            src="https://maps.google.com/?q=Centro+Comercial+La+Casona+2+San+Antonio+de+los+Altos+Estado+Miranda+Venezuela&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-4">
              Preguntas Frecuentes
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: '¿A qué hora son los cultos?', a: 'Domingos a las 9:00 AM y 11:00 AM. Escuela Dominical a las 10:00 AM.' },
              { q: '¿Hay programa para niños?', a: 'Sí, tenemos Escuela Dominical para todas las edades y guardería para bebés durante los cultos.' },
              { q: '¿Cómo puedo ser miembro?', a: 'Asiste a nuestra clase de membresía (trimestral), completa el formulario y ten una entrevista pastoral.' },
              { q: '¿Ofrecen consejería matrimonial?', a: 'Sí, nuestros pastores ofrecen consejería prematrimonial y matrimonial. Agenda cita en la oficina.' },
              { q: '¿Cómo hago una donación?', a: 'Puedes dar en el culto, transferencia bancaria, o en línea. Contacta a la oficina para detalles.' },
            ].map((faq, index) => (
              <details key={index} className="group border border-primary-200 rounded-xl bg-primary-50">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-medium text-primary-900 pr-4">{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-primary-400 transition-transform group-open:rotate-180 flex-shrink-0" aria-hidden="true" />
                </summary>
                <div className="px-5 pb-5 text-primary-600 border-t border-primary-200">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}