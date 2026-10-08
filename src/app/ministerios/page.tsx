import { BookOpen, Music, Users, Heart, Shield, Globe, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const ministries = [
  {
    category: 'Alabanza',
    icon: Music,
    color: 'bg-purple-100 text-purple-700',
    items: [
      { name: 'Equipo de Alabanza', desc: 'Músicos y vocalistas para cultos dominicales y eventos especiales', schedule: 'Domingos 9:00 AM | Ensayos miércoles 7:00 PM' },
      { name: 'Banda Juvenil', desc: 'Grupo de alabanza liderado por jóvenes para eventos de juventud', schedule: 'Viernes 7:00 PM' },
      { name: 'Coro de Niños', desc: 'Niños de 6-12 años aprendiendo a adorar a través de la música', schedule: 'Domingos 10:00 AM' },
    ]
  },
  {
    category: 'Enseñanza',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-700',
    items: [
      { name: 'Escuela Dominical Adultos', desc: 'Estudio bíblico profundo para crecimiento espiritual', schedule: 'Domingos 10:00 AM' },
      { name: 'Escuela Dominical Niños', desc: 'Clases bíblicas por edades: Preescolar, Primaria, Preadolescentes', schedule: 'Domingos 10:00 AM' },
      { name: 'Estudio Bíblico Entre Semana', desc: 'Estudio expositivo capítulo por capítulo', schedule: 'Miércoles 7:00 PM' },
      { name: 'Clases de Discipulado', desc: 'Fundamentos de la fe, bautismo, membresía, vida cristiana', schedule: 'Según demanda' },
    ]
  },
  {
    category: 'Servicio',
    icon: Users,
    color: 'bg-green-100 text-green-700',
    items: [
      { name: 'Ujieres y Bienvenida', desc: 'Primer contacto, asistencia, ofrendas, orden en cultos', schedule: 'Domingos 30 min antes de cada culto' },
      { name: 'Equipo Técnico', desc: 'Audio, video, streaming, iluminación, presentación', schedule: 'Domingos y eventos especiales' },
      { name: 'Decoración y Ambiente', desc: 'Preparación del santuario, flores, decoración estacional', schedule: 'Según calendario' },
    ]
  },
  {
    category: 'Cuidado y Evangelismo',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    items: [
      { name: 'Ministerio de Oración', desc: 'Intercesión por la iglesia, peticiones, cadena de oración', schedule: 'Miércoles 6:00 PM | Disponible 24/7' },
      { name: 'Visitación y Cuidado Pastoral', desc: 'Visitas a enfermos, ancianos, hospitales, nuevos creyentes', schedule: 'Según necesidades' },
      { name: 'Evangelismo Comunitario', desc: 'Salidas a parques, plazas, hogares, eventos de alcance', schedule: 'Sábados 10:00 AM' },
      { name: 'Apoyo a Familias', desc: 'Consejería prematrimonial, matrimonial, parental, duelo', schedule: 'Con cita previa' },
    ]
  },
  {
    category: 'Próxima Generación',
    icon: Globe,
    color: 'bg-orange-100 text-orange-700',
    items: [
      { name: 'Juventud (13-18 años)', desc: 'Cultos, grupos pequeños, retiros, campamentos, servicio', schedule: 'Viernes 7:00 PM | Domingos 11:00 AM' },
      { name: 'Jóvenes Adultos (18-25)', desc: 'Estudio bíblico, comunidad, mentoría, misiones', schedule: 'Martes 7:30 PM' },
      { name: 'Universitarios', desc: 'Grupo en campus, estudio bíblico, alcance universitario', schedule: 'Según calendario universitario' },
    ]
  },
]

export default function MinistriesPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="bg-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
        <div className="container-custom relative py-20 lg:py-28">
          <div className="max-w-3xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-800 text-accent-300 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Áreas de servicio</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Encuentra tu lugar<br /><span className="text-accent-400">para servir</span>
            </h1>
            <p className="text-lg text-primary-200 mb-8 max-w-xl mx-auto">
              Dios te ha dado dones únicos. Úsalos para bendecir a otros y crecer en comunidad.
            </p>
            <Link href="/contacto#servir">
              <Button variant="accent" size="lg">
                Quiero servir
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ministries by Category */}
      <section className="section bg-white container-custom">
        {ministries.map((category, catIndex) => (
          <div key={catIndex} className="mb-16 last:mb-0">
            <div className="flex items-center gap-3 mb-8">
              <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', category.color)}>
                <category.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-primary-900">{category.category}</h2>
                <p className="text-primary-500">Ministerios de {category.category.toLowerCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((ministry, index) => (
                <Card key={index} className="h-full group">
                  <CardBody className="p-6">
                    <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">{ministry.name}</h3>
                    <p className="text-primary-600 text-sm mb-4 leading-relaxed">{ministry.desc}</p>
                    <div className="flex items-center gap-2 text-sm text-primary-500">
                      <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span>{ministry.schedule}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Join Form */}
        <Card className="bg-primary-900 border-primary-800">
          <CardBody className="p-8 lg:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              ¿No sabes por dónde empezar?
            </h2>
            <p className="text-primary-300 mb-8 max-w-2xl mx-auto">
              Completa nuestro formulario de dones y talentos y te ayudaremos a encontrar el ministerio perfecto para ti.
            </p>
            <Link href="/contacto#servir">
              <Button variant="accent" size="lg">
                Descubrir mis dones
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </CardBody>
        </Card>
      </section>
    </div>
  )
}