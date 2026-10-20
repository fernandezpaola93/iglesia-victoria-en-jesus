import Link from 'next/link'
import { Church, Users, Heart, BookOpen, Music, Calendar, ArrowRight, MapPin, Clock, Smartphone } from 'lucide-react'
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
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center bg-primary-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent" />
        
        <div className="container-custom relative z-10 py-12 sm:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-800 text-accent-300 text-sm font-medium mb-6 animate-fade-in-up">
              <Church className="h-4 w-4" aria-hidden="true" />
              <span>Bienvenidos a nuestra familia de fe</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 animate-fade-in-up leading-tight" style={{ animationDelay: '100ms' }}>
              Una iglesia donde
              <br />
              <span className="text-accent-400">encuentras propósito</span>
              <br />
              <span className="text-primary-100">y perteneces</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-primary-200 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Somos una comunidad diversa unida por el Evangelio. No importa tu historia, aquí tienes un lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
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
              <Link href="/descargar-app">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  <Smartphone className="mr-2 h-5 w-5" aria-hidden="true" />
                  Descargar App
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce sm:bottom-8" aria-hidden="true">
          <svg className="h-6 w-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Service Times */}
      <section className="section bg-primary-50">
        <div className="container-custom px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-3">
              Horarios de Cultos
            </h2>
            <p className="text-primary-600">
              Te esperamos con los brazos abiertos. Encuentra un horario que funcione para ti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {serviceTimes.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="group hover:border-accent-300 transition-colors">
                  <CardBody className="flex flex-col items-center text-center p-6 sm:p-8">
                    <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary-100 text-primary-700 mb-4 sm:mb-6 group-hover:bg-accent-100 group-hover:text-accent-600 transition-colors">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-primary-900 mb-1">{service.type}</h3>
                    <div className="flex items-center gap-2 text-primary-600 mb-2 text-sm">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      <span>Sanctuario Principal</span>
                    </div>
                    <div className="flex items-center gap-2 text-accent-600 font-medium text-sm">
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
        <div className="container-custom px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-3">
              Nuestros Valores
            </h2>
            <p className="text-primary-600">
              Estos principios guían todo lo que hacemos como comunidad de fe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="h-full group">
                  <CardBody className="flex flex-col h-full p-6 sm:p-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary-100 text-primary-700 mb-4 sm:mb-6 group-hover:bg-accent-100 group-hover:text-accent-600 transition-colors">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-semibold text-primary-900 mb-2">{value.title}</h3>
                    <p className="text-primary-600 leading-relaxed flex-1 text-sm sm:text-base">{value.description}</p>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-900">
        <div className="container-custom px-4">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-800/50 border border-primary-700 text-accent-300 text-sm font-medium mb-6">
              ¿Primera vez?
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              ¿Listo para visitarnos?
            </h2>
            <p className="text-primary-300 mb-8 text-base sm:text-lg">
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
        <div className="container-custom px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-3">
                Encuéntranos
              </h2>
              <p className="text-primary-600 mb-6">
                Estamos ubicados en el corazón de la ciudad, con fácil acceso y amplio estacionamiento. Nos encantaría verte este domingo.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 flex-shrink-0">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Dirección</p>
                    <p className="text-primary-600 text-sm">Centro Comercial La Casona, Piso 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 flex-shrink-0">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Oficina</p>
                    <p className="text-primary-600 text-sm">Lun-Vie: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-2xl bg-primary-200 flex items-center justify-center overflow-hidden">
              <iframe
                src="https://maps.google.com/?q=Centro+Comercial+La+Casona+Piso+1+Al+lado+del+Puente+San+Antonio+de+los+Altos+Estado+Miranda+Venezuela&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}