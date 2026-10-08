import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600">Error de autenticación</h1>
        <p className="mt-4 text-gray-600">
          El enlace de confirmación es inválido o ha expirado.
        </p>
        <div className="mt-6 space-y-3">
          <Link
            href="/login"
            className="block py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="block py-2 px-4 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  )
}