import Link from 'next/link'
import { Church, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Heart } from 'lucide-react'

const footerLinks = {
  iglesia: [
    { href: '/nosotros', label: 'Nuestra Historia' },
    { href: '/pastores', label: 'Pastores' },
    { href: '/creencias', label: 'Qué Creemos' },
    { href: '/ministerios', label: 'Ministerios' },
  ],
  recursos: [
    { href: '/predicas', label: 'Predicas' },
    { href: '/estudios', label: 'Estudios Bíblicos' },
    { href: '/devocionales', label: 'Devocionales' },
    { href: '/eventos', label: 'Próximos Eventos' },
  ],
  contacto: [
    { href: '/contacto', label: 'Contáctanos' },
    { href: '/oracion', label: 'Peticiones de Oración' },
    { href: '/donar', label: 'Donaciones' },
    { href: '/visita', label: 'Planifica tu Visita' },
  ],
}

const socialLinks = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="bg-primary-950 text-primary-100" role="contentinfo">
      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6" aria-label="Victoria en Jesús - Inicio">
              <Church className="h-10 w-10 text-accent-400" aria-hidden="true" />
              <span className="font-display font-semibold text-2xl text-white">
                Victoria en Jesús
              </span>
            </Link>
            <p className="text-primary-300 mb-6 max-w-xs leading-relaxed">
              Una comunidad de fe centrada en Cristo, comprometida con el Evangelio y el servicio a nuestra ciudad.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-accent-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links - Iglesia */}
          <nav aria-label="Enlaces de la iglesia">
            <h3 className="font-display font-medium text-white mb-4">Iglesia</h3>
            <ul className="space-y-3">
              {footerLinks.iglesia.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-300 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Links - Recursos */}
          <nav aria-label="Recursos">
            <h3 className="font-display font-medium text-white mb-4">Recursos</h3>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-300 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-medium text-white mb-4">Contacto</h3>
            <address className="not-italic space-y-3 text-primary-300">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p>Av. Principal #123, Centro<br />Ciudad, Estado, C.P. 00000</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent-400 flex-shrink-0" aria-hidden="true" />
                <a href="tel:+525512345678" className="hover:text-accent-400 transition-colors">
                  +52 55 1234 5678
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent-400 flex-shrink-0" aria-hidden="true" />
                <a href="mailto:info@victoriaenjesus.org" className="hover:text-accent-400 transition-colors">
                  info@victoriaenjesus.org
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-400 text-sm">
              © {new Date().getFullYear()} Iglesia Victoria en Jesús. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-primary-400">
              <Link href="/privacidad" className="hover:text-accent-400 transition-colors">Política de Privacidad</Link>
              <span aria-hidden="true">·</span>
              <Link href="/terminos" className="hover:text-accent-400 transition-colors">Términos de Uso</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}