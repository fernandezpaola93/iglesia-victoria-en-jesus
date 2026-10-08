import Link from 'next/link'
import { Church, Users, Heart, BookOpen, Music, Calendar, ArrowRight, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'

const serviceTimes = [
  { day: 'Domingos', time: '10:00 AM - 12:00 PM', type: 'Culto Dominical', icon: Church },
  { day: 'Martes', time: '6:00 PM - 7:00 PM', type: 'Oración', icon: Heart },
  { day: 'Sábados', time: '10:00 AM - 12:00 PM', type: 'Culto Juvenil', icon: Music },
]

const values = [
  {
    icon: Heart,
    title: 'Amor Centrado en Cristo',
    description: 'Todo lo que hacemos fluye de nuestro amor por Jesús y su amor por nosotros.',
  },
  {
    icon: BookOpen,
    title: 'Enseñanza Bíblica',
    description: 'Predicamos y enseñamos la Palabra de Dios con fidelidad y relevancia.',
  },
  {
    icon: Users,
    title: 'Comunidad Auténtica',
    description: 'Crecemos juntos en grupos pequeños donde nos conocemos y cuidamos mutuamente.',
  },
  {
    icon: Music,
    title: 'Adoración Apasionada',
    description: 'Expresamos nuestro amor a Dios através de una adoración genuina y contemporánea.',
  },
  {
    icon: Calendar,
    title: 'Servicio Generoso',
    description: 'Servimos a nuestra comunidad y al mundo con la compasión de Cristo.',
  },
  {
    icon: Church,
    title: 'Discipulado Intencional',
    description: 'Equipamos a cada creyente para madurar en la fe y hacer discípulos.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-primary-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent" />
        
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-800 text-accent-300 text-sm font-medium mb-8 animate-fade-in-up">
              <Church className="h-4 w-4" aria-hidden="true" />
              <span>Bienvenidos a nuestra familia de fe</span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Una iglesia donde
              <br />
              <span className="text-accent-400">encuentras propósito</span>
              <br />
              <span className="text-primary-100">y perteneces</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-200 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Somos una comunidad diversa unida por el Evangelio. No importa tu historia, aquí tienes un lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link href="/visita">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  Planifica tu visita
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/nosotros">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Conócenos más
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <svg className="h-6 w-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Service Times */}
      <section className="section bg-primary-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
              Horarios de Cultos
            </h2>
            <p className="text-primary-600">
              Te esperamos con los brazos abiertos. Encuentra un horario que funcione para ti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {serviceTimes.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="group hover:border-accent-300 transition-colors">
                  <CardBody className="flex flex-col items-center text-center p-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-100 text-primary-700 mb-6 group-hover:bg-accent-100 group-hover:text-accent-600 transition-colors">
                      <Icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-primary-900 mb-1">{service.type}</h3>
                    <div className="flex items-center gap-2 text-primary-600 mb-2">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      <span>Sanctuario Principal</span>
                    </div>
                    <div className="flex items-center gap-2 text-accent-600 font-medium">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      <span>{service.day} • {service.time}</span>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-primary-600">
              Estos principios guían todo lo que hacemos como comunidad de fe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="h-full group">
                  <CardBody className="flex flex-col h-full p-8">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary-100 text-primary-700 mb-6 group-hover:bg-accent-100 group-hover:text-accent-600 transition-colors">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-primary-900 mb-3">{value.title}</h3>
                    <p className="text-primary-600 leading-relaxed flex-1">{value.description}</p>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-800/50 border border-primary-700 text-accent-300 text-sm font-medium mb-6">
              ¿Primera vez?
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
              ¿Listo para visitarnos?
            </h2>
            <p className="text-primary-300 mb-10 text-lg">
              Queremos que tu primera visita sea increíble. Completa nuestro formulario y te contactaremos para darte la bienvenida personalmente.
            </p>
            <Link href="/visita">
              <Button variant="accent" size="lg" className="w-full sm:w-auto">
                Planifica mi visita
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Map/Location Placeholder */}
      <section className="section bg-primary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
                Encuéntranos
              </h2>
              <p className="text-primary-600 mb-8">
                Estamos ubicados en el corazón de la ciudad, con fácil acceso y amplio estacionamiento. Nos encantaría verte este domingo.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Dirección</p>
                    <p className="text-primary-600">Av. Principal #123, Centro, Ciudad</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Oficina</p>
                    <p className="text-primary-600">Lun-Vie: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-2xl bg-primary-200 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 text-primary-300 mx-auto mb-4" aria-hidden="true" />
                <p className="text-primary-500">Mapa interactivo próximamente</p>
                <p className="text-primary-400 text-sm mt-2">Integración con Google Maps</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}