-- ============================================
-- VINCULAR MIEMBROS (public.members) CON SUS CUENTAS (auth.users)
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================
--
-- QUE HACE:
--   1. Agrega public.members.user_id -> auth.users(id)
--   2. Vincula los miembros existentes con su cuenta (por id y por correo)
--   3. Trigger: los miembros nuevos se vinculan solos al crearlos
--   4. Cada usuario puede ver su propia ficha (por id o por user_id)
--
-- POR QUE:
--   Hoy no hay forma de saber que ficha de public.members corresponde a
--   que usuario de auth.users. Solo el id (members.id) lo define, y los
--   miembros creados desde el panel tienen un uuid propio, no el de auth.
--   Con user_id, un mismo usuario tiene siempre la misma ficha, sin
--   depender de que el correo coincida.
--
-- Es idempotente: se puede volver a ejecutar sin romper nada.
-- ---------------------------------------------------------------

-- 1) Columna
alter table public.members
    add column if not exists user_id uuid references auth.users(id) on delete set null;

comment on column public.members.user_id is
    'Cuenta de autenticacion (auth.users) asociada a esta ficha de miembro';

-- 2) Los admins que ya tienen members.id = auth.users.id (Paola, Administrador)
update public.members m
set user_id = m.id
where m.user_id is null
  and exists (select 1 from auth.users u where u.id = m.id);

-- 3) Vincular el resto por correo
--    (si varios miembros comparten correo, solo se vincula el mas antiguo)
update public.members m
set user_id = u.id
from auth.users u
where m.user_id is null
  and u.email is not null
  and lower(u.email) = lower(m.email)
  and not exists (select 1 from public.members x where x.user_id = u.id)
  and m.id = (
      select m2.id
      from public.members m2
      where m2.email is not null and lower(m2.email) = lower(m.email)
      order by m2.created_at, m2.id
      limit 1
  );

-- 4) Un usuario = un solo miembro
create unique index if not exists idx_members_user_id
    on public.members(user_id)
    where user_id is not null;

-- 5) Trigger: vincular automaticamente al crear o editar un miembro
create or replace function public.link_member_to_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
    v_user_id uuid;
begin
    if new.user_id is null and new.email is not null then
        select u.id into v_user_id
        from auth.users u
        where lower(u.email) = lower(new.email)
        limit 1;

        if v_user_id is not null
           and not exists (
               select 1 from public.members x
               where x.user_id = v_user_id and x.id <> new.id
           ) then
            new.user_id := v_user_id;
        end if;
    end if;
    return new;
end;
$$;

drop trigger if exists trg_link_member_to_user on public.members;
create trigger trg_link_member_to_user
    before insert or update of email, user_id on public.members
    for each row execute function public.link_member_to_user();

-- 6) Cada usuario ve su propia ficha (por id o por user_id)
drop policy if exists "Users can view own member profile" on public.members;
create policy "Users can view own member profile"
    on public.members for select
    to authenticated
    using (id = auth.uid() or user_id = auth.uid());

-- ============================================
-- VERIFICACION
-- ============================================
-- select m.id, m.first_name, m.last_name, m.email, m.user_id, u.email as cuenta
-- from public.members m
-- left join auth.users u on u.id = m.user_id
-- order by m.user_id nulls last, m.created_at;
