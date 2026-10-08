'use client'

export const dynamic = 'force-dynamic'

import { Mail, Phone, MapPin, Clock, Send, Heart, UserPlus, Shield, Calendar, ChevronDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Dirección',
    details: [
      'Av. Principal #123, Colonia Centro',
      'Ciudad, Estado, C.P. 00000',
      'México'
    ],
    link: null,
  },
  {
    icon: Phone,
    title: 'Teléfono',
    details: [
      'Oficina: +52 55 1234 5678',
      'WhatsApp: +52 55 8765 4321',
      'Lun-Vie: 9:00 AM - 5:00 PM'
    ],
    link: 'tel:+525512345678',
  },
  {
    icon: Mail,
    title: 'Email',
    details: [
      'General: info@victoriaenjesus.org',
      'Oración: oracion@victoriaenjesus.org',
      'Prensa: prensa@victoriaenjesus.org'
    ],
    link: 'mailto:info@victoriaenjesus.org',
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

const prayerCategories = [
  'Sanidad física/emocional',
  'Necesidades financieras',
  'Familia y relaciones',
  'Trabajo/estudios',
  'Decisiones importantes',
  'Salvación de seres queridos',
  'Agradecimiento',
  'Otro',
]

export default function ContactPage() {
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

            {/* Prayer Request */}
            <Card id="oracion" className="bg-primary-50 border-primary-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-accent-500" aria-hidden="true" />
                  <CardTitle className="text-primary-900">Peticiones de Oración</CardTitle>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-primary-600 mb-6">
                  Nuestro equipo de intercesión ora semanalmente por cada petición. 
                  Puedes enviarla de forma confidencial.
                </p>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <Label htmlFor="prayer-name">Tu nombre (opcional)</Label>
                    <Input id="prayer-name" placeholder="Para seguimiento, si lo deseas" />
                  </div>
                  <div>
                    <Label htmlFor="prayer-category">Categoría</Label>
                    <select id="prayer-category" className="input">
                      {prayerCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="prayer-request">Petición de oración *</Label>
                    <Textarea id="prayer-request" rows={4} required placeholder="Comparte tu necesidad..." />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="confidential" className="rounded border-primary-300 text-accent-600 focus:ring-accent-500" />
                    <Label htmlFor="confidential" className="text-sm font-normal cursor-pointer">
                      Mantener confidencial (solo pastores e intercesores)
                    </Label>
                  </div>
                  <Button type="submit" variant="accent" className="w-full sm:w-auto">
                    <Heart className="h-4 w-4 mr-2" aria-hidden="true" />
                    Enviar petición
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
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="serve-name">Nombre *</Label>
                      <Input id="serve-name" required />
                    </div>
                    <div>
                      <Label htmlFor="serve-email">Email *</Label>
                      <Input id="serve-email" type="email" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="serve-phone">Teléfono *</Label>
                    <Input id="serve-phone" type="tel" required />
                  </div>
                  <div>
                    <Label htmlFor="serve-areas">Áreas de interés *</Label>
                    <select id="serve-areas" multiple className="input min-h-[100px]" size={5}>
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
                    <Textarea id="serve-experience" rows={3} placeholder="¿Tienes experiencia previa, formación musical, docente, técnica, etc.?" />
                  </div>
                  <div>
                    <Label htmlFor="serve-availability">Disponibilidad</Label>
                    <Textarea id="serve-availability" rows={2} placeholder="Días y horarios disponibles (ej: Domingos mañana, Miércoles noche, Sábados)" />
                  </div>
                  <Button type="submit" variant="primary" className="w-full sm:w-auto">
                    <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                    Quiero servir
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="section bg-primary-50 container-custom">
        <div className="aspect-video rounded-2xl bg-primary-200 flex items-center justify-center overflow-hidden">
          <div className="text-center p-8">
            <MapPin className="h-16 w-16 text-primary-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-primary-500 text-lg">Mapa interactivo</p>
            <p className="text-primary-400 text-sm mt-2">Integración con Google Maps próximamente</p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium">
              Ver en Google Maps
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
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