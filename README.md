# Iglesia Victoria en Jesús - Sitio Web + Panel Administrativo

Sitio web completo para iglesia construido con **Next.js 14**, **Supabase**, **Tailwind CSS** y **TypeScript**. Incluye sitio público y panel administrativo privado con autenticación.

## 🎨 Características

### Sitio Público
- **Inicio** - Hero, horarios, valores, CTA
- **Nosotros** - Historia, misión, valores, liderazgo, declaraciones de fe
- **Ministerios** - Categorizados por área (Alabanza, Enseñanza, Servicio, etc.)
- **Eventos** - Próximos eventos, horario semanal, tipos de eventos
- **Contacto** - Formulario, peticiones de oración, formulario de servicio
- **Visita** - Planificador de primera visita, FAQs, programa para niños

### Panel Administrativo (Privado)
- **Dashboard** - Estadísticas, miembros recientes, eventos próximos, acciones rápidas
- **Miembros** - CRUD completo, búsqueda, filtros, paginación, estados de membresía
- **Ministerios** - Gestión de ministerios, líderes, horarios, categorías
- **Eventos** - Calendario, tipos de evento, inscripciones, recurrencia
- **Autenticación** - Supabase Auth (email/password, magic links)

### Base de Datos (Supabase)
- `households` - Familias/hogares
- `members` - Miembros con datos avanzados (foto, historial espiritual, contactos emergencia)
- `ministries` - Ministerios con categorías y líderes
- `member_ministries` - Relación muchos-a-muchos con roles
- `spiritual_milestones` - Bautismo, membresía, matrimonio, etc.
- `pastoral_notes` - Notas confidenciales con seguimiento
- `events` - Eventos recurrentes y únicos

## 🚀 Inicio Rápido

### 1. Requisitos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- pnpm (recomendado) o npm/yarn

### 2. Configurar Supabase

1. Crea un proyecto en Supabase
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase-church-schema.sql`
3. Ve a **Storage** y crea dos buckets:
   - `member-photos` (privado)
   - `certificates` (privado)
4. En **Authentication > Providers**, habilita Email/Password
5. En **Authentication > URL Configuration**, agrega:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Instalar y Configurar

```bash
# Clonar e instalar
cd victoria-en-jesus
pnpm install

# Copiar variables de entorno
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_SITE_NAME="Iglesia Victoria en Jesús"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Ejecutar

```bash
# Desarrollo
pnpm dev

# Producción
pnpm build
pnpm start
```

Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── auth/callback/      # Callback de autenticación
│   ├── dashboard/          # Panel administrativo
│   │   ├── layout.tsx      # Layout con sidebar
│   │   ├── page.tsx        # Dashboard principal
│   │   ├── miembros/       # Gestión de miembros
│   │   ├── ministerios/    # Gestión de ministerios
│   │   └── eventos/        # Gestión de eventos
│   ├── nosostros/          # Página nosotros
│   ├── ministerios/        # Página ministerios pública
│   ├── eventos/            # Página eventos pública
│   ├── contacto/           # Página contacto
│   ├── visita/             # Planificador de visita
│   ├── login/              # Login
│   ├── registro/           # Registro
│   ├── layout.tsx          # Layout raíz
│   ├── page.tsx            # Home
│   └── globals.css         # Estilos globales
├── components/
│   ├── auth/               # AuthProvider
│   ├── layout/             # Header, Footer
│   └── ui/                 # Componentes UI reutilizables
├── lib/
│   ├── supabase/           # Clientes Supabase
│   ├── types.ts            # Tipos TypeScript
│   └── utils.ts            # Utilidades
├── middleware.ts           # Protección de rutas
└── tailwind.config.js      # Configuración de colores
```

## 🎨 Personalización

### Colores
Edita `tailwind.config.js` para cambiar la paleta:
- `primary` - Azul oscuro (principal)
- `accent` - Amarillo/dorado (acento)

### Fuentes
- **Display**: Playfair Display (títulos)
- **Sans**: Inter (texto general)

### Logo
Reemplaza `public/icon.svg` y actualiza el componente Header.

## 🔐 Autenticación y Roles

El middleware protege `/dashboard/*`. Para roles avanzados:

1. Agrega campo `role` a tabla `members` o usa **Supabase Custom Claims**
2. Actualiza `middleware.ts` para verificar roles
3. Ajusta políticas RLS en Supabase según roles

## 📦 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Agrega variables de entorno en Settings
3. Deploy automático

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠 Scripts Disponibles

```bash
pnpm dev          # Desarrollo con Turbopack
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check
```

## 📋 Próximos Pasos Sugeridos

- [ ] Página de detalle de miembro (`/dashboard/miembros/[id]`)
- [ ] Página de detalle de ministerio
- [ ] Página de detalle de evento con inscripciones
- [ ] Reportes y estadísticas avanzadas
- [ ] Envío de emails (Resend/SendGrid)
- [ ] Notificaciones push
- [ ] App móvil (React Native + Expo)
- [ ] Donaciones en línea (Stripe)
- [ ] Streaming en vivo integrado
- [ ] Multi-idioma (i18n)

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

MIT License - Úsalo libremente para tu iglesia.

## 🙏 Créditos

- **Next.js** - Framework React
- **Supabase** - Backend as a Service
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **shadcn/ui** - Inspiración componentes UI

---

**¿Preguntas?** Abre un issue o contacta al equipo de desarrollo.

*Desarrollado con ❤️ para la gloria de Dios*