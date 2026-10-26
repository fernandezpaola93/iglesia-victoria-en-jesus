import { Church, Heart, BookOpen, Users, Music, Globe } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const defaultBeliefs = [
  { icon: BookOpen, title: 'La Biblia', description: 'Creemos que la Biblia es la Palabra inspirada de Dios, infalible y autoritativa para la fe y la vida.' },
  { icon: Heart, title: 'La Trinidad', description: 'Un solo Dios en tres personas: Padre, Hijo y Espíritu Santo, co-iguales y co-eternos.' },
  { icon: Church, title: 'Jesucristo', description: 'Jesús es el Hijo de Dios, nacido de virgen, vivió sin pecado, murió en la cruz y resucitó al tercer día.' },
  { icon: Globe, title: 'Salvación', description: 'La salvación es por gracia mediante la fe en Jesucristo, no por obras, para que nadie se gloríe.' },
  { icon: Users, title: 'La Iglesia', description: 'El cuerpo de Cristo, compuesto por creyentes bautizados, unidos para adoración, edificación y evangelización.' },
  { icon: Music, title: 'Vida Cristiana', description: 'Vida de santidad, llenura del Espíritu Santo, y servicio amoroso a Dios y al prójimo.' },
]

const beliefIcons: Record<string, typeof BookOpen> = {
  'La Biblia': BookOpen,
  'La Trinidad': Heart,
  Jesucristo: Church,
  Salvación: Globe,
  'La Iglesia': Users,
  'Vida Cristiana': Music,
}

export default async function CreenciasPage() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('beliefs')
    .select('id, title, description')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error al cargar las creencias publicadas:', error)
  }

  const beliefs = data?.length
    ? data.map((belief) => ({ ...belief, icon: beliefIcons[belief.title] || Church }))
    : defaultBeliefs

  return (
    <div className="container-custom py-16">
      <h1 className="font-display text-4xl font-bold text-primary-900 mb-8">Qué Creemos</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {beliefs.map((belief) => (
          <Card key={'id' in belief ? belief.id : belief.title}>
            <CardBody className="p-6 flex gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                <belief.icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{belief.title}</h2>
                <p className="text-primary-600">{belief.description}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
