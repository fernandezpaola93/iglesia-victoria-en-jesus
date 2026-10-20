-- ============================================
-- FIX: registro de usuarios (trigger handle_new_user)
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================
--
-- PROBLEMA:
--   POST /auth/v1/signup -> 500
--   {"code":"500","error_code":"unexpected_failure","msg":"Database error saving new user"}
--
--   La tabla public.profiles de esta base NO tiene las columnas
--   'avatar_url' ni 'updated_at', pero el trigger handle_new_user hace:
--
--     insert into public.profiles (id, full_name, avatar_url, role)
--
--   -> ERROR: column "avatar_url" does not exist
--   -> se revierte la creacion del usuario en auth.users
--
--   Aparte, el trigger update_profiles_updated_at tambien falla en cada
--   UPDATE de profiles, porque escribe en new.updated_at (columna inexistente).
--   Eso hacia imposible cambiar el rol de un usuario desde la base.
--
-- SOLUCION:
--   1) Agregar las columnas que faltan.
--   2) Recrear los triggers para que solo usen columnas existentes.
--
-- Es idempotente: se puede volver a ejecutar sin romper nada.
-- ---------------------------------------------------------------

-- 1) Columnas que faltan
alter table public.profiles
    add column if not exists avatar_url text;

alter table public.profiles
    add column if not exists updated_at timestamp with time zone default now();

-- 2) Trigger de creacion de perfil (solo columnas que existen)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
    insert into public.profiles (id, full_name, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        'miembro'
    );
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- 3) Trigger de updated_at
create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
    before update on public.profiles
    for each row execute function public.update_updated_at_column();

-- 4) Por si hay usuarios sin perfil (por ejemplo, creados antes del trigger)
insert into public.profiles (id, full_name, role)
select u.id,
       coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
       'miembro'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- ============================================
-- VERIFICACION
-- ============================================
-- select column_name, data_type from information_schema.columns
-- where table_schema = 'public' and table_name = 'profiles' order by ordinal_position;
--
-- select id, full_name, role from public.profiles order by created_at;
