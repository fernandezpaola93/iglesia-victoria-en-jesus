-- Ejecutar una sola vez en Supabase Dashboard > SQL Editor.
-- Guarda las creencias administrables y permite mostrarlas en /creencias.

create table if not exists public.beliefs (
    id uuid primary key default gen_random_uuid(),
    title text not null unique,
    description text not null,
    sort_order integer not null default 100,
    created_at timestamp with time zone not null default now()
);

alter table public.beliefs enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    );
$$;

drop policy if exists "Anyone can view beliefs" on public.beliefs;
drop policy if exists "Admins can manage beliefs" on public.beliefs;

create policy "Anyone can view beliefs"
    on public.beliefs for select
    to anon, authenticated
    using (true);

create policy "Admins can manage beliefs"
    on public.beliefs for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

grant select on public.beliefs to anon, authenticated;
grant insert, update, delete on public.beliefs to authenticated;

insert into public.beliefs (title, description, sort_order)
values
    ('La Biblia', 'Creemos que la Biblia es la Palabra inspirada de Dios, infalible y autoritativa para la fe y la vida.', 10),
    ('La Trinidad', 'Un solo Dios en tres personas: Padre, Hijo y Espíritu Santo, co-iguales y co-eternos.', 20),
    ('Jesucristo', 'Jesús es el Hijo de Dios, nacido de virgen, vivió sin pecado, murió en la cruz y resucitó al tercer día.', 30),
    ('Salvación', 'La salvación es por gracia mediante la fe en Jesucristo, no por obras, para que nadie se gloríe.', 40),
    ('La Iglesia', 'El cuerpo de Cristo, compuesto por creyentes bautizados, unidos para adoración, edificación y evangelización.', 50),
    ('Vida Cristiana', 'Vida de santidad, llenura del Espíritu Santo, y servicio amoroso a Dios y al prójimo.', 60)
on conflict (title) do nothing;
