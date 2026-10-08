'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Calendar, MapPin, Clock, Users, Heart, CheckCircle, Mail, Phone, Send, ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label, Select } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'

const visitSteps = [
  { number: '01', title: 'Planea tu visita', desc: 'Llena el formulario y te contactaremos para darte la bienvenida personal.' },
  { number: '02', title: 'Llega temprano', desc: 'Te esperamos 15 min antes en la entrada principal. Alguien te recibirá.' },
  { number: '03', title: 'Disfruta el culto', desc: 'Alabanza, enseñanza bíblica relevante y un ambiente cálido y familiar.' },
  { number: '04', title: 'Conéctate', desc: 'Después del culto, café y tiempo para conocer gente. ¡Te presentamos a otros!' },
]

const serviceTimes = [
  { time: '9:00 AM', type: 'Culto Tradicional', desc: 'Himnos, coro, enseñanza expositiva' },
  { time: '11:00 AM', type: 'Culto Contemporáneo', desc: 'Banda completa, alabanza moderna, mismo mensaje' },
]

const kidsInfo = [
  { age: '0-2 años', program: 'Guardería', location: 'Área de bebés', time: 'Durante ambos cultos' },
  { age: '3-5 años', program: 'Preescolar', location: 'Salón Arcoíris', time: 'Durante ambos cultos' },
  { age: '6-11 años', program: 'Escuela Dominical Kids', location: 'Edificio Infantil', time: '10:00 AM (entre cultos)' },
  { age: '12-17 años', program: 'Juventud', location: 'Salón Joven', time: 'Viernes 7:00 PM / Domingos 11:00 AM' },
]

const faqs = [
  { q: '¿Cómo me visto?', a: 'Como te sientas cómodo. Verás desde jeans y camisetas hasta vestidos y camisas. Ven como eres.' },
  { q: '¿Qué hago con mis hijos?', a: 'Tenemos programas seguros y divertidos para todas las edades. Nuestros voluntarios tienen verificación de antecedentes.' },
  { q: '¿Tengo que dar dinero?', a: 'No hay obligación. La ofrenda es para miembros y visitantes regulares. Si eres nuevo, solo disfruta.' },
  { q: '¿Cuánto dura el culto?', a: 'Aproximadamente 90 minutos: 30 min de alabanza, 45 min de enseñanza, 15 min de respuesta/oración.' },
  { q: '¿Hay estacionamiento?', a: 'Sí, tenemos estacionamiento amplio frente al templo y en la calle lateral. Voluntarios te guiarán.' },
  { q: '¿Puedo venir solo?', a: '¡Absolutamente! Muchos vienen solos. Te asignaremos un "anfitrión" que te acompañará y presentará.' },
]

export default function VisitPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="bg-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
        <div className="container-custom relative py-20 lg:py-28">
          <div className="max-w-3xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-800 text-accent-300 text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Planifica tu visita</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Tu primera visita<br /><span className="text-accent-400">sin estrés</span>
            </h1>
            <p className="text-lg text-primary-200 mb-8 max-w-xl mx-auto">
              Sabemos que ir a una iglesia nueva puede dar nervios. Te lo ponemos fácil: cuéntanos cuándo vienes y nos encargamos del resto.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#formulario">
                <Button variant="accent" size="lg">
                  Planificar mi visita
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Tengo preguntas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section bg-white container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
            Qué esperar en tu visita
          </h2>
          <p className="text-primary-600">
            Hemos diseñado una experiencia pensada para que te sientas bienvenido desde el primer momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visitSteps.map((step, index) => (
            <Card key={index} className="text-center p-8 h-full">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-100 text-primary-700 mx-auto mb-6 font-display font-bold text-2xl">
                {step.number}
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">{step.title}</h3>
              <p className="text-primary-600 text-sm">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Service Times */}
      <section className="section bg-primary-50 container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-4">
              Horarios de Cultos Dominicales
            </h2>
            <p className="text-primary-600">Elige el que mejor se adapte a tu horario</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {serviceTimes.map((service, index) => (
              <Card key={index} className="p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-full w-1/2 bg-primary-100 opacity-50" />
                <div className="relative z-10">
                  <span className="font-display text-3xl font-bold text-accent-500 mb-2 block">{service.time}</span>
                  <h3 className="font-display text-xl font-semibold text-primary-900 mb-2">{service.type}</h3>
                  <p className="text-primary-600">{service.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Card className="p-6">
              <Calendar className="h-10 w-10 text-accent-500 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-primary-900 mb-1">Domingos</h3>
              <p className="text-primary-600 text-sm">9:00 AM · 10:00 AM · 11:00 AM</p>
            </Card>
            <Card className="p-6">
              <Clock className="h-10 w-10 text-accent-500 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-primary-900 mb-1">Miércoles</h3>
              <p className="text-primary-600 text-sm">7:00 PM Estudio Bíblico</p>
            </Card>
            <Card className="p-6">
              <Users className="h-10 w-10 text-accent-500 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-primary-900 mb-1">Viernes</h3>
              <p className="text-primary-600 text-sm">7:00 PM Juventud</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Kids Program */}
      <section className="section bg-white container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-4">
              Programa para Niños y Jóvenes
            </h2>
            <p className="text-primary-600">Ambientes seguros, divertidos y bíblicos para cada edad</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-200">
                  <th className="text-left p-4 font-semibold text-primary-900">Edad</th>
                  <th className="text-left p-4 font-semibold text-primary-900">Programa</th>
                  <th className="text-left p-4 font-semibold text-primary-900">Ubicación</th>
                  <th className="text-left p-4 font-semibold text-primary-900">Horario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {kidsInfo.map((kid, index) => (
                  <tr key={index} className="hover:bg-primary-50">
                    <td className="p-4 font-medium text-primary-900">{kid.age}</td>
                    <td className="p-4 text-primary-700">{kid.program}</td>
                    <td className="p-4 text-primary-600">{kid.location}</td>
                    <td className="p-4 text-primary-500 text-sm">{kid.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-primary-500 text-sm mt-6">
            * Todos los voluntarios pasan verificación de antecedentes y capacitación de protección infantil
          </p>
        </div>
      </section>

      {/* Visit Form */}
      <section id="formulario" className="section bg-primary-900 text-white container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Planifica tu visita
            </h2>
            <p className="text-primary-300">
              Llena este formulario y nuestro equipo de bienvenida te contactará para coordinar todo.
            </p>
          </div>

          <Card className="bg-primary-950 border-primary-800">
            <CardBody className="p-8">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="visit-name" className="text-primary-300">Nombre completo *</Label>
                    <Input id="visit-name" required className="bg-primary-900 border-primary-700 text-white placeholder-primary-500 focus:border-accent-500 focus:ring-accent-500/20" />
                  </div>
                  <div>
                    <Label htmlFor="visit-email" className="text-primary-300">Email *</Label>
                    <Input id="visit-email" type="email" required className="bg-primary-900 border-primary-700 text-white placeholder-primary-500 focus:border-accent-500 focus:ring-accent-500/20" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="visit-phone" className="text-primary-300">Teléfono *</Label>
                    <Input id="visit-phone" type="tel" required className="bg-primary-900 border-primary-700 text-white placeholder-primary-500 focus:border-accent-500 focus:ring-accent-500/20" />
                  </div>
                  <div>
                    <Label htmlFor="visit-date" className="text-primary-300">Fecha preferida *</Label>
                    <Input id="visit-date" type="date" required className="bg-primary-900 border-primary-700 text-white placeholder-primary-500 focus:border-accent-500 focus:ring-accent-500/20" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="visit-service" className="text-primary-300">Culto preferido</Label>
                  <Select id="visit-service" className="bg-primary-900 border-primary-700 text-white focus:border-accent-500 focus:ring-accent-500/20">
                    <option value="">Cualquiera</option>
                    <option value="9am">9:00 AM - Tradicional</option>
                    <option value="11am">11:00 AM - Contemporáneo</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="visit-guests" className="text-primary-300">¿Cuántas personas vienen? *</Label>
                  <Select id="visit-guests" required className="bg-primary-900 border-primary-700 text-white focus:border-accent-500 focus:ring-accent-500/20">
                    <option value="1">Solo yo</option>
                    <option value="2">2 personas</option>
                    <option value="3">3 personas</option>
                    <option value="4">4 personas</option>
                    <option value="5">5 personas</option>
                    <option value="6+">6 o más</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="visit-kids" className="text-primary-300">Edades de los niños (si aplica)</Label>
                  <Input id="visit-kids" placeholder="Ej: 3 años, 7 años, 14 años" className="bg-primary-900 border-primary-700 text-white placeholder-primary-500 focus:border-accent-500 focus:ring-accent-500/20" />
                </div>
                <div>
                  <Label htmlFor="visit-notes" className="text-primary-300">¿Algo que debamos saber? (alergias, movilidad, preguntas, etc.)</Label>
                  <Textarea id="visit-notes" rows={3} className="bg-primary-900 border-primary-700 text-white placeholder-primary-500 focus:border-accent-500 focus:ring-accent-500/20" />
                </div>
                <Button type="submit" variant="accent" size="lg" className="w-full">
                  <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                  Confirmar mi visita
                </Button>
                <p className="text-center text-primary-500 text-sm">
                  Te contactaremos por WhatsApp o email dentro de 24 horas para confirmar.
                </p>
              </form>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-white container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-900 mb-4">
              Preguntas Frecuentes
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
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

      {/* Final CTA */}
      <section className="section bg-primary-950 text-white container-custom">
        <Card className="bg-primary-900 border-primary-800 max-w-2xl mx-auto text-center">
          <CardBody className="p-8 lg:p-12">
            <Heart className="h-12 w-12 text-accent-400 mx-auto mb-4" aria-hidden="true" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              ¿Listo para visitarnos?
            </h2>
            <p className="text-primary-300 mb-8">
              No necesitas tener todo resuelto. Solo ven como eres. Te esperamos con los brazos abiertos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#formulario">
                <Button variant="accent" size="lg">
                  Planificar mi visita
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Contactar primero
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  )
}