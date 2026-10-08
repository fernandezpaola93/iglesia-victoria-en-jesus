import { Church, Heart, BookOpen, Users, Music, Globe, MapPin, Clock, Mail, Phone, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

const beliefs = [
  { icon: BookOpen, title: 'La Biblia', description: 'Creemos que la Biblia es la Palabra inspirada de Dios, infalible y autoritativa para la fe y la vida.' },
  { icon: Heart, title: 'La Trinidad', description: 'Un solo Dios en tres personas: Padre, Hijo y Espíritu Santo, co-iguales y co-eternos.' },
  { icon: Church, title: 'Jesucristo', description: 'Jesús es el Hijo de Dios, nacido de virgen, vivió sin pecado, murió en la cruz y resucitó al tercer día.' },
  { icon: Globe, title: 'Salvación', description: 'La salvación es por gracia mediante la fe en Jesucristo, no por obras, para que nadie se gloríe.' },
  { icon: Users, title: 'La Iglesia', description: 'El cuerpo de Cristo, compuesto por creyentes bautizados, unidos para adoración, edificación y evangelización.' },
  { icon: Music, title: 'Vida Cristiana', description: 'Vida de santidad, llenura del Espíritu Santo, y servicio amoroso a Dios y al prójimo.' },
]

const values = [
  { icon: Heart, title: 'Amor', description: 'Amar a Dios sobre todas las cosas y al prójimo como a nosotros mismos.' },
  { icon: BookOpen, title: 'Verdad', description: 'Fundamentados en la Palabra de Dios como autoridad final.' },
  { icon: Users, title: 'Comunidad', description: 'Vida compartida en grupos pequeños, discipulado y cuidado mutuo.' },
  { icon: Globe, title: 'Misión', description: 'Alcanzar a los perdidos con el Evangelio local y globalmente.' },
  { icon: Music, title: 'Excelencia', description: 'Hacer todo para la gloria de Dios con lo mejor de nuestras capacidades.' },
  { icon: Church, title: 'Generosidad', description: 'Dar con gozo: tiempo, talentos y recursos para el Reino.' },
]

export default function AboutPage() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
        <div className="container-custom relative py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-800 text-accent-300 text-sm font-medium mb-6">
              <Church className="h-4 w-4" aria-hidden="true" />
              <span>Conoce nuestro corazón</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Nuestra historia,<br /><span className="text-accent-400">nuestra fe</span>
            </h1>
            <p className="text-lg text-primary-200 mb-8 max-w-xl">
              Más de 20 años sirviendo a nuestra comunidad con el amor de Cristo. Somos una familia diversa unida por la gracia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/visita">
                <Button variant="accent" size="lg">
                  Planifica tu visita
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Contáctanos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* History & Mission */}
      <section className="section bg-white container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-4">
              <Heart className="h-4 w-4" aria-hidden="true" />
              <span>Nuestra Misión</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-6">
              Hacer discípulos que amen a Dios y sirvan a otros
            </h2>
            <div className="space-y-4 text-primary-600 leading-relaxed">
              <p>
                Desde nuestra fundación en 2003, Iglesia Victoria en Jesús ha sido un faro de esperanza en nuestra ciudad. 
                Comenzamos como un pequeño grupo de estudio bíblico en una sala de estar y, por la gracia de Dios, 
                hemos crecido hasta convertirnos en una comunidad vibrante de cientos de familias.
              </p>
              <p>
                Nuestra pasión es simple: <strong className="text-primary-900">conocer a Cristo y darlo a conocer</strong>. 
                Cada culto, cada ministerio, cada evento tiene un propósito: que más personas experimenten el amor 
                transformador de Jesús y encuentren su lugar en su familia.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-primary-100 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <Church className="h-24 w-24 text-primary-300 mx-auto mb-4" aria-hidden="true" />
                  <p className="text-primary-500">Foto histórica de la iglesia</p>
                  <p className="text-primary-400 text-sm mt-1">Primer templo - Año 2005</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-lg max-w-xs">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-xl bg-accent-100 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-accent-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-primary-900">20+</p>
                  <p className="text-primary-600 text-sm">Años de ministerio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-primary-50 container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
            Nuestros Valores Fundamentales
          </h2>
          <p className="text-primary-600">
            Estos principios guían cada decisión y acción en nuestra iglesia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="h-full group">
                <CardBody className="p-8 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-100 text-primary-700 mx-auto mb-6 group-hover:bg-accent-100 group-hover:text-accent-600 transition-colors">
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-primary-900 mb-3">{value.title}</h3>
                  <p className="text-primary-600 leading-relaxed">{value.description}</p>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Beliefs */}
      <section className="section bg-white container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
            Qué Creemos
          </h2>
          <p className="text-primary-600">
            Nuestra declaración de fe resume las verdades esenciales del cristianismo histórico.
          </p>
        </div>
        <div className="space-y-6 max-w-4xl mx-auto">
          {beliefs.map((belief, index) => {
            const Icon = belief.icon
            return (
              <div key={index} className="flex gap-6 p-6 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors">
                <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary-900 mb-2">{belief.title}</h3>
                  <p className="text-primary-600 leading-relaxed">{belief.description}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-12">
          <Link href="/creencias">
            <Button variant="outline" size="lg">
              Ver declaración completa
              <Send className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Leadership */}
      <section className="section bg-primary-950 text-white container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Nuestro Liderazgo
          </h2>
          <p className="text-primary-300">
            Pastores y líderes comprometidos con servir a la congregación.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Pastor Principal', role: 'Pastor Juan Pérez', desc: 'Fundador y pastor principal desde 2003' },
            { name: 'Pastora Asociada', role: 'Pastora María García', desc: 'Ministerio de familias y consejería' },
            { name: 'Pastor de Jóvenes', role: 'Pastor Carlos López', desc: 'Juventud, jóvenes adultos y discipulado' },
            { name: 'Pastor de Alabanza', role: 'Pastor Andrés Ruiz', desc: 'Adoración, artes creativas y medios' },
          ].map((leader, index) => (
            <Card key={index} className="bg-primary-900 border-primary-800 text-center">
              <CardBody className="p-8">
                <div className="h-24 w-24 rounded-full bg-primary-800 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{leader.role}</h3>
                <p className="text-accent-400 text-sm mb-3">{leader.name}</p>
                <p className="text-primary-400 text-sm">{leader.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary-900 container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
            ¿Listo para ser parte de la familia?
          </h2>
          <p className="text-primary-300 mb-10 text-lg">
            Te invitamos a visitarnos este domingo. Experimenta la diferencia de una comunidad que te ama de verdad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/visita">
              <Button variant="accent" size="lg">
                Planifica tu visita
              </Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Tengo preguntas
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}