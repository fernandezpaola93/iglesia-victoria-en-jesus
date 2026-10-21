import { Smartphone, Download, AlertCircle } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'

export default function DownloadAppPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-primary-50">
      <div className="container-custom px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary-100 text-primary-700 mb-6">
            <Smartphone className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
            Lleva la Iglesia contigo
          </h1>
          <p className="text-primary-600 mb-8 text-lg">
            Descarga nuestra aplicación para mantenerte conectado, ver predicaciones y gestionar tu perfil en cualquier lugar.
          </p>

          <div className="grid gap-6">
            <Card className="hover:border-accent-300 transition-colors">
              <CardBody className="p-6 sm:p-8 flex flex-col items-center">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Android</h2>
                <p className="text-primary-600 mb-6 text-sm">
                  Descarga el archivo APK directamente e instálalo en tu dispositivo Android.
                </p>
                <a
                  href="/app-release.apk"
                  download="victoria-en-jesus.apk"
                  className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 bg-primary-900 text-white hover:bg-primary-800 px-6 py-3 text-base"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Descargar para Android
                </a>
              </CardBody>
            </Card>

            <Card className="bg-primary-900 text-white">
              <CardBody className="p-6 sm:p-8 flex flex-col items-center">
                <AlertCircle className="h-8 w-8 text-accent-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">iOS / iPhone</h2>
                <p className="text-primary-200 mb-4 text-sm">
                  La aplicación para iOS se instala como una Web App.
                </p>
                <ol className="text-left text-sm text-primary-300 space-y-2 list-decimal list-inside">
                  <li>Abre este sitio en Safari.</li>
                  <li>Toca el botón "Compartir" (ícono de cuadrado con flecha).</li>
                  <li>Selecciona "Agregar al inicio" (Add to Home Screen).</li>
                </ol>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
