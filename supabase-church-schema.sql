-- ============================================
-- ESQUEMA SUPABASE PARA IGLESIA (MEDIANA 100-500)
-- Gestión avanzada de miembros + Familias
-- ============================================

-- Extensiones necesarias
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================
-- TABLA: households (Hogares/Familias)
-- ============================================
create table public.households (
    id uuid primary key default uuid_generate_v4(),
    name text not null,                    -- Ej: "Familia García", "Hogar López"
    address text,
    city text,
    state text,
    zip_code text,
    country text default 'México',
    phone text,
    email text,
    notes text,                            -- Notas generales del hogar
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Índice para búsquedas rápidas
create index idx_households_name on public.households(name);
create index idx_households_active on public.households(is_active);

-- ============================================
-- TABLA: members (Miembros/Feligreses)
-- ============================================
create table public.members (
    id uuid primary key default uuid_generate_v4(),
    household_id uuid references public.households(id) on delete set null,
    
    -- Datos personales básicos
    first_name text not null,
    last_name text not null,
    middle_name text,
    preferred_name text,                   -- Nombre que prefiere que le llamen
    gender text check (gender in ('M', 'F', 'Otro', 'Prefiero no decir')),
    date_of_birth date,
    marital_status text check (marital_status in ('Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión libre', 'Separado')),
    
    -- Contacto
    email text,
    phone text,
    phone_secondary text,
    address text,
    city text,
    state text,
    zip_code text,
    
    -- Información espiritual
    baptism_date date,
    baptism_location text,
    membership_date date,                  -- Fecha de membresía oficial
    membership_status text check (membership_status in ('Visitante', 'Miembro', 'Miembro activo', 'Miembro inactivo', 'Trasladado', 'Fallecido')) default 'Visitante',
    salvation_date date,                   -- Fecha de decisión de fe
    salvation_notes text,
    
    -- Foto de perfil
    profile_photo_url text,                -- URL de Supabase Storage
    
    -- Redes sociales / contacto adicional
    facebook_url text,
    instagram_url text,
    whatsapp_number text,
    
    -- Información médica/emergencia (opcional)
    emergency_contact_name text,
    emergency_contact_phone text,
    emergency_contact_relationship text,
    allergies_medical text,
    blood_type text,
    
    -- Metadatos
    notes text,                            -- Notas pastorales/administrativas
    is_active boolean default true,
    created_by uuid,                       -- Quién creó el registro (auth.uid())
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Índices para búsquedas comunes
create index idx_members_household on public.members(household_id);
create index idx_members_name on public.members(last_name, first_name);
create index idx_members_email on public.members(email) where email is not null;
create index idx_members_phone on public.members(phone) where phone is not null;
create index idx_members_status on public.members(membership_status);
create index idx_members_active on public.members(is_active);
create index idx_members_birthday on public.members(date_of_birth);

-- ============================================
-- TABLA: ministries (Ministerios/Áreas de servicio)
-- ============================================
create table public.ministries (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,             -- Ej: "Alabanza", "Niños", "Jóvenes", "Ujieres"
    description text,
    category text check (category in ('Alabanza', 'Enseñanza', 'Servicio', 'Evangelismo', 'Cuidado', 'Administración', 'Otro')),
    leader_id uuid references public.members(id) on delete set null,  -- Líder del ministerio
    meeting_day text,                      -- Ej: "Domingo", "Miércoles", "Viernes"
    meeting_time time,
    meeting_location text,
    is_active boolean default true,
    requires_background_check boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index idx_ministries_category on public.ministries(category);
create index idx_ministries_active on public.ministries(is_active);

-- ============================================
-- TABLA: member_ministries (Relación Miembro-Ministerio + Roles)
-- ============================================
create table public.member_ministries (
    id uuid primary key default uuid_generate_v4(),
    member_id uuid not null references public.members(id) on delete cascade,
    ministry_id uuid not null references public.ministries(id) on delete cascade,
    role text not null check (role in ('Líder', 'Co-líder', 'Miembro', 'Voluntario', 'Aprendiz', 'Asistente')),
    start_date date default current_date,
    end_date date,                         -- Null = activo actualmente
    notes text,
    created_at timestamp with time zone default now(),
    
    unique(member_id, ministry_id, role)   -- Un miembro no puede tener el mismo rol duplicado en un ministerio
);

create index idx_member_ministries_member on public.member_ministries(member_id);
create index idx_member_ministries_ministry on public.member_ministries(ministry_id);
create index idx_member_ministries_active on public.member_ministries(end_date) where end_date is null;

-- ============================================
-- TABLA: spiritual_milestones (Hitos espirituales)
-- ============================================
create table public.spiritual_milestones (
    id uuid primary key default uuid_generate_v4(),
    member_id uuid not null references public.members(id) on delete cascade,
    milestone_type text not null check (milestone_type in (
        'Salvación', 'Bautismo', 'Membresía', 'Primera Comunión', 
        'Confirmación', 'Matrimonio', 'Dedicación de hijos',
        'Llamado al ministerio', 'Ordenación', 'Otro'
    )),
    date date not null,
    location text,
    officiant text,                        -- Quien ofició (pastor, etc.)
    witness_1 text,
    witness_2 text,
    certificate_number text,               -- Número de certificado si aplica
    certificate_url text,                  -- URL del certificado en Storage
    notes text,
    created_at timestamp with time zone default now()
);

create index idx_spiritual_milestones_member on public.spiritual_milestones(member_id);
create index idx_spiritual_milestones_type on public.spiritual_milestones(milestone_type);
create index idx_spiritual_milestones_date on public.spiritual_milestones(date);

-- ============================================
-- TABLA: pastoral_notes (Notas pastorales/seguimiento)
-- ============================================
create table public.pastoral_notes (
    id uuid primary key default uuid_generate_v4(),
    member_id uuid not null references public.members(id) on delete cascade,
    author_id uuid not null,               -- auth.uid() del pastor/líder que escribe
    note_type text check (note_type in ('Consejería', 'Visita', 'Oración', 'Seguimiento', 'Disciplina', 'General')) default 'General',
    title text,
    content text not null,
    is_confidential boolean default true,  -- Solo visible para pastores/líderes autorizados
    follow_up_date date,                   -- Fecha para seguimiento
    follow_up_completed boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index idx_pastoral_notes_member on public.pastoral_notes(member_id);
create index idx_pastoral_notes_author on public.pastoral_notes(author_id);
create index idx_pastoral_notes_followup on public.pastoral_notes(follow_up_date) where follow_up_completed = false;
create index idx_pastoral_notes_confidential on public.pastoral_notes(is_confidential);

-- ============================================
-- TABLA: events (Eventos/Cultos - opcional para futuro)
-- ============================================
create table public.events (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    event_type text check (event_type in ('Culto', 'Estudio bíblico', 'Conferencia', 'Retiro', 'Evento social', 'Capacitación', 'Otro')),
    start_datetime timestamp with time zone not null,
    end_datetime timestamp with time zone,
    location text,
    max_capacity integer,
    requires_registration boolean default false,
    ministry_id uuid references public.ministries(id) on delete set null,
    is_recurring boolean default false,
    recurrence_pattern jsonb,              -- Para eventos recurrentes: {freq: 'weekly', days: [1,4], until: '2025-12-31'}
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index idx_events_date on public.events(start_datetime);
create index idx_events_type on public.events(event_type);
create index idx_events_ministry on public.events(ministry_id);
create index idx_events_active on public.events(is_active);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Miembros con info de hogar
create view public.members_with_household as
select 
    m.*,
    h.name as household_name,
    h.address as household_address,
    h.phone as household_phone,
    h.email as household_email
from public.members m
left join public.households h on m.household_id = h.id;

-- Vista: Miembros activos por ministerio
create view public.active_members_by_ministry as
select 
    min.id as ministry_id,
    min.name as ministry_name,
    min.category,
    mem.id as member_id,
    mem.first_name,
    mem.last_name,
    mem.email,
    mem.phone,
    mm.role,
    mm.start_date
from public.ministries min
join public.member_ministries mm on min.id = mm.ministry_id
join public.members mem on mm.member_id = mem.id
where min.is_active = true
  and mm.end_date is null
  and mem.is_active = true
  and mem.membership_status in ('Miembro', 'Miembro activo');

-- Vista: Próximos cumpleaños (próximos 30 días)
create view public.upcoming_birthdays as
select 
    id,
    first_name,
    last_name,
    date_of_birth,
    extract(month from date_of_birth) as birth_month,
    extract(day from date_of_birth) as birth_day,
    email,
    phone,
    household_id
from public.members
where is_active = true
  and date_of_birth is not null
  and (
    -- Cumpleaños en los próximos 30 días
    (make_date(extract(year from current_date)::int, extract(month from date_of_birth)::int, extract(day from date_of_birth)::int) 
     between current_date and current_date + interval '30 days')
    or
    -- Si ya pasó este año, revisar el próximo año
    (make_date(extract(year from current_date)::int + 1, extract(month from date_of_birth)::int, extract(day from date_of_birth)::int) 
     between current_date and current_date + interval '30 days')
  )
order by 
    case 
        when make_date(extract(year from current_date)::int, extract(month from date_of_birth)::int, extract(day from date_of_birth)::int) >= current_date
        then make_date(extract(year from current_date)::int, extract(month from date_of_birth)::int, extract(day from date_of_birth)::int)
        else make_date(extract(year from current_date)::int + 1, extract(month from date_of_birth)::int, extract(day from date_of_birth)::int)
    end;

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Triggers para updated_at
create trigger update_households_updated_at
    before update on public.households
    for each row execute function public.update_updated_at_column();

create trigger update_members_updated_at
    before update on public.members
    for each row execute function public.update_updated_at_column();

create trigger update_ministries_updated_at
    before update on public.ministries
    for each row execute function public.update_updated_at_column();

create trigger update_pastoral_notes_updated_at
    before update on public.pastoral_notes
    for each row execute function public.update_updated_at_column();

create trigger update_events_updated_at
    before update on public.events
    for each row execute function public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
alter table public.households enable row level security;
alter table public.members enable row level security;
alter table public.ministries enable row level security;
alter table public.member_ministries enable row level security;
alter table public.spiritual_milestones enable row level security;
alter table public.pastoral_notes enable row level security;
alter table public.events enable row level security;

-- Políticas básicas (ajustar según roles de tu app)

-- HOUSEHOLDS: Todos autenticados pueden ver, solo admins/modificar
create policy "Authenticated users can view households"
    on public.households for select
    to authenticated
    using (true);

create policy "Admins can manage households"
    on public.households for all
    to authenticated
    using (exists (
        select 1 from public.members m 
        where m.id = auth.uid() and m.membership_status in ('Miembro activo') 
        -- Agregar campo is_admin a members o usar claim de auth
    ))
    with check (exists (
        select 1 from public.members m 
        where m.id = auth.uid() and m.membership_status in ('Miembro activo')
    ));

-- MEMBERS: Ver propios datos + líderes ven su ministerio
create policy "Members can view own profile"
    on public.members for select
    to authenticated
    using (id = auth.uid());

create policy "Leaders can view ministry members"
    on public.members for select
    to authenticated
    using (exists (
        select 1 from public.member_ministries mm
        join public.ministries min on mm.ministry_id = min.id
        where mm.member_id = auth.uid()
          and mm.end_date is null
          and min.leader_id = auth.uid()
          and members.household_id = mm.member_id  -- Simplificado
    ));

create policy "Admins can manage all members"
    on public.members for all
    to authenticated
    using (false)  -- Cambiar por tu lógica de admin
    with check (false);

-- MINISTRIES: Ver todos, solo líderes/admins modifican
create policy "Authenticated can view ministries"
    on public.ministries for select
    to authenticated
    using (is_active = true);

-- MEMBER_MINISTRIES: Ver propios, líderes gestionan su ministerio
create policy "Members can view own ministry roles"
    on public.member_ministries for select
    to authenticated
    using (member_id = auth.uid());

-- SPIRITUAL_MILESTONES: Ver propios, pastores ver todos
create policy "Members can view own milestones"
    on public.spiritual_milestones for select
    to authenticated
    using (member_id = auth.uid());

-- PASTORAL_NOTES: Solo autor del nota + pastores (confidenciales)
create policy "Authors can manage own notes"
    on public.pastoral_notes for all
    to authenticated
    using (author_id = auth.uid())
    with check (author_id = auth.uid());

create policy "Pastors can view confidential notes"
    on public.pastoral_notes for select
    to authenticated
    using (is_confidential = false or author_id = auth.uid() or false); -- Agregar lógica de pastor

-- EVENTS: Ver eventos activos
create policy "Authenticated can view active events"
    on public.events for select
    to authenticated
    using (is_active = true);

-- ============================================
-- STORAGE: Bucket para fotos de perfil y certificados
-- ============================================
-- Ejecutar en Dashboard de Supabase > Storage:
-- 1. Crear bucket "member-photos" (público: false)
-- 2. Crear bucket "certificates" (público: false)
-- 3. Políticas de Storage para cada bucket

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL - para testing)
-- ============================================

-- Insertar ministerios base
insert into public.ministries (name, description, category, meeting_day, meeting_time) values
('Alabanza y Adoración', 'Equipo de música y canto para cultos', 'Alabanza', 'Domingo', '09:00'),
('Escuela Dominical Niños', 'Enseñanza bíblica para niños 4-12 años', 'Enseñanza', 'Domingo', '10:00'),
('Juventud', 'Ministerio para jóvenes 13-25 años', 'Enseñanza', 'Viernes', '19:00'),
('Ujieres y Bienvenida', 'Servicio de bienvenida y orden en cultos', 'Servicio', 'Domingo', '08:30'),
('Intercesión', 'Grupo de oración por la iglesia', 'Otro', 'Miércoles', '19:00'),
('Evangelismo', 'Salidas y alcance comunitario', 'Evangelismo', 'Sábado', '10:00'),
('Cuidado Pastoral', 'Visitas, consejería y apoyo a miembros', 'Cuidado', null, null);

-- ============================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================
comment on table public.households is 'Hogares/familiares - agrupa miembros que viven juntos';
comment on table public.members is 'Miembros y feligreses de la iglesia con datos completos';
comment on table public.ministries is 'Ministerios y áreas de servicio de la iglesia';
comment on table public.member_ministries is 'Relación muchos-a-muchos: miembros participando en ministerios con roles';
comment on table public.spiritual_milestones is 'Hitos espirituales importantes: bautismo, membresía, matrimonio, etc.';
comment on table public.pastoral_notes is 'Notas confidenciales de seguimiento pastoral';
comment on table public.events is 'Eventos, cultos y actividades de la iglesia';