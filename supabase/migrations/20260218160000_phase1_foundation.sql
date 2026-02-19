create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text,
  household_size integer not null default 2 check (household_size >= 1 and household_size <= 12),
  shopping_frequency_days integer not null default 7 check (shopping_frequency_days >= 1 and shopping_frequency_days <= 90),
  dietary_preferences text[] not null default '{}'::text[],
  disliked_foods text[] not null default '{}'::text[],
  onboarding_completed_at timestamptz
);

alter table public.profiles
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists display_name text,
  add column if not exists household_size integer not null default 2,
  add column if not exists shopping_frequency_days integer not null default 7,
  add column if not exists dietary_preferences text[] not null default '{}'::text[],
  add column if not exists disliked_foods text[] not null default '{}'::text[],
  add column if not exists onboarding_completed_at timestamptz;

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  quantity numeric(10, 2) not null default 0 check (quantity >= 0),
  unit text,
  storage_location text check (storage_location in ('pantry', 'fridge', 'freezer', 'other')),
  expires_on date,
  status text not null default 'active' check (status in ('active', 'consumed', 'discarded')),
  confidence_score numeric(4, 3) check (confidence_score >= 0 and confidence_score <= 1),
  source text not null default 'manual' check (source in ('manual', 'photo', 'receipt', 'recipe_adjustment')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_item_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  event_type text not null check (event_type in ('added', 'updated', 'consumed', 'discarded', 'expired', 'merged', 'split', 'corrected')),
  delta_quantity numeric(10, 2),
  previous_quantity numeric(10, 2),
  new_quantity numeric(10, 2),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  event_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.recipe_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  source text not null default 'ai' check (source in ('ai', 'manual', 'external')),
  generation_context jsonb not null default '{}'::jsonb,
  status text not null default 'suggested' check (status in ('suggested', 'selected', 'cooked', 'archived')),
  rationale text,
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.schedule_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null,
  cook_window_start timestamptz,
  cook_window_end timestamptz,
  available_minutes integer check (available_minutes is null or available_minutes >= 0),
  will_shop_today boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date),
  check (
    cook_window_start is null
    or cook_window_end is null
    or cook_window_end >= cook_window_start
  )
);

create table if not exists public.weekly_cooking_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start_date date not null,
  target_meals integer not null check (target_meals >= 0 and target_meals <= 21),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start_date)
);

create table if not exists public.cook_feedback_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_record_id uuid references public.recipe_records(id) on delete set null,
  cooked_at timestamptz not null default now(),
  rating integer check (rating is null or rating between 1 and 5),
  effort_level integer check (effort_level is null or effort_level between 1 and 5),
  taste_outcome text check (taste_outcome in ('loved', 'liked', 'neutral', 'disliked')),
  changes_made text,
  would_repeat boolean,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  list_date date not null default current_date,
  status text not null default 'draft' check (status in ('draft', 'active', 'completed', 'archived')),
  source text not null default 'system' check (source in ('system', 'manual')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  shopping_list_id uuid not null references public.shopping_lists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  quantity numeric(10, 2) not null default 1 check (quantity >= 0),
  unit text,
  category text,
  is_checked boolean not null default false,
  linked_inventory_item_id uuid references public.inventory_items(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventory_items_user_id on public.inventory_items(user_id);
create index if not exists idx_inventory_items_user_expires on public.inventory_items(user_id, expires_on);
create index if not exists idx_inventory_item_events_user_id on public.inventory_item_events(user_id);
create index if not exists idx_inventory_item_events_user_event_at on public.inventory_item_events(user_id, event_at desc);
create index if not exists idx_recipe_records_user_id on public.recipe_records(user_id);
create index if not exists idx_recipe_records_user_status_created_at on public.recipe_records(user_id, status, created_at desc);
create index if not exists idx_schedule_checkins_user_id on public.schedule_checkins(user_id);
create index if not exists idx_schedule_checkins_user_date on public.schedule_checkins(user_id, checkin_date desc);
create index if not exists idx_weekly_cooking_intents_user_id on public.weekly_cooking_intents(user_id);
create index if not exists idx_weekly_cooking_intents_user_week on public.weekly_cooking_intents(user_id, week_start_date desc);
create index if not exists idx_cook_feedback_entries_user_id on public.cook_feedback_entries(user_id);
create index if not exists idx_cook_feedback_entries_user_cooked_at on public.cook_feedback_entries(user_id, cooked_at desc);
create index if not exists idx_shopping_lists_user_id on public.shopping_lists(user_id);
create index if not exists idx_shopping_lists_user_date on public.shopping_lists(user_id, list_date desc);
create index if not exists idx_shopping_list_items_user_id on public.shopping_list_items(user_id);
create index if not exists idx_shopping_list_items_list_id on public.shopping_list_items(shopping_list_id);

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_profiles_updated_at'
  ) then
    create trigger set_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.set_current_timestamp_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_inventory_items_updated_at'
  ) then
    create trigger set_inventory_items_updated_at
    before update on public.inventory_items
    for each row
    execute function public.set_current_timestamp_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_recipe_records_updated_at'
  ) then
    create trigger set_recipe_records_updated_at
    before update on public.recipe_records
    for each row
    execute function public.set_current_timestamp_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_schedule_checkins_updated_at'
  ) then
    create trigger set_schedule_checkins_updated_at
    before update on public.schedule_checkins
    for each row
    execute function public.set_current_timestamp_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_weekly_cooking_intents_updated_at'
  ) then
    create trigger set_weekly_cooking_intents_updated_at
    before update on public.weekly_cooking_intents
    for each row
    execute function public.set_current_timestamp_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_cook_feedback_entries_updated_at'
  ) then
    create trigger set_cook_feedback_entries_updated_at
    before update on public.cook_feedback_entries
    for each row
    execute function public.set_current_timestamp_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_shopping_lists_updated_at'
  ) then
    create trigger set_shopping_lists_updated_at
    before update on public.shopping_lists
    for each row
    execute function public.set_current_timestamp_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_shopping_list_items_updated_at'
  ) then
    create trigger set_shopping_list_items_updated_at
    before update on public.shopping_list_items
    for each row
    execute function public.set_current_timestamp_updated_at();
  end if;
end
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user_profile();
  end if;
end
$$;

alter table public.profiles enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_item_events enable row level security;
alter table public.recipe_records enable row level security;
alter table public.schedule_checkins enable row level security;
alter table public.weekly_cooking_intents enable row level security;
alter table public.cook_feedback_entries enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.shopping_list_items enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles for delete
using (auth.uid() = id);

drop policy if exists "inventory_items_select_own" on public.inventory_items;
create policy "inventory_items_select_own"
on public.inventory_items for select
using (auth.uid() = user_id);

drop policy if exists "inventory_items_insert_own" on public.inventory_items;
create policy "inventory_items_insert_own"
on public.inventory_items for insert
with check (auth.uid() = user_id);

drop policy if exists "inventory_items_update_own" on public.inventory_items;
create policy "inventory_items_update_own"
on public.inventory_items for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "inventory_items_delete_own" on public.inventory_items;
create policy "inventory_items_delete_own"
on public.inventory_items for delete
using (auth.uid() = user_id);

drop policy if exists "inventory_item_events_select_own" on public.inventory_item_events;
create policy "inventory_item_events_select_own"
on public.inventory_item_events for select
using (auth.uid() = user_id);

drop policy if exists "inventory_item_events_insert_own" on public.inventory_item_events;
create policy "inventory_item_events_insert_own"
on public.inventory_item_events for insert
with check (auth.uid() = user_id);

drop policy if exists "inventory_item_events_update_own" on public.inventory_item_events;
create policy "inventory_item_events_update_own"
on public.inventory_item_events for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "inventory_item_events_delete_own" on public.inventory_item_events;
create policy "inventory_item_events_delete_own"
on public.inventory_item_events for delete
using (auth.uid() = user_id);

drop policy if exists "recipe_records_select_own" on public.recipe_records;
create policy "recipe_records_select_own"
on public.recipe_records for select
using (auth.uid() = user_id);

drop policy if exists "recipe_records_insert_own" on public.recipe_records;
create policy "recipe_records_insert_own"
on public.recipe_records for insert
with check (auth.uid() = user_id);

drop policy if exists "recipe_records_update_own" on public.recipe_records;
create policy "recipe_records_update_own"
on public.recipe_records for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "recipe_records_delete_own" on public.recipe_records;
create policy "recipe_records_delete_own"
on public.recipe_records for delete
using (auth.uid() = user_id);

drop policy if exists "schedule_checkins_select_own" on public.schedule_checkins;
create policy "schedule_checkins_select_own"
on public.schedule_checkins for select
using (auth.uid() = user_id);

drop policy if exists "schedule_checkins_insert_own" on public.schedule_checkins;
create policy "schedule_checkins_insert_own"
on public.schedule_checkins for insert
with check (auth.uid() = user_id);

drop policy if exists "schedule_checkins_update_own" on public.schedule_checkins;
create policy "schedule_checkins_update_own"
on public.schedule_checkins for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "schedule_checkins_delete_own" on public.schedule_checkins;
create policy "schedule_checkins_delete_own"
on public.schedule_checkins for delete
using (auth.uid() = user_id);

drop policy if exists "weekly_cooking_intents_select_own" on public.weekly_cooking_intents;
create policy "weekly_cooking_intents_select_own"
on public.weekly_cooking_intents for select
using (auth.uid() = user_id);

drop policy if exists "weekly_cooking_intents_insert_own" on public.weekly_cooking_intents;
create policy "weekly_cooking_intents_insert_own"
on public.weekly_cooking_intents for insert
with check (auth.uid() = user_id);

drop policy if exists "weekly_cooking_intents_update_own" on public.weekly_cooking_intents;
create policy "weekly_cooking_intents_update_own"
on public.weekly_cooking_intents for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "weekly_cooking_intents_delete_own" on public.weekly_cooking_intents;
create policy "weekly_cooking_intents_delete_own"
on public.weekly_cooking_intents for delete
using (auth.uid() = user_id);

drop policy if exists "cook_feedback_entries_select_own" on public.cook_feedback_entries;
create policy "cook_feedback_entries_select_own"
on public.cook_feedback_entries for select
using (auth.uid() = user_id);

drop policy if exists "cook_feedback_entries_insert_own" on public.cook_feedback_entries;
create policy "cook_feedback_entries_insert_own"
on public.cook_feedback_entries for insert
with check (auth.uid() = user_id);

drop policy if exists "cook_feedback_entries_update_own" on public.cook_feedback_entries;
create policy "cook_feedback_entries_update_own"
on public.cook_feedback_entries for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "cook_feedback_entries_delete_own" on public.cook_feedback_entries;
create policy "cook_feedback_entries_delete_own"
on public.cook_feedback_entries for delete
using (auth.uid() = user_id);

drop policy if exists "shopping_lists_select_own" on public.shopping_lists;
create policy "shopping_lists_select_own"
on public.shopping_lists for select
using (auth.uid() = user_id);

drop policy if exists "shopping_lists_insert_own" on public.shopping_lists;
create policy "shopping_lists_insert_own"
on public.shopping_lists for insert
with check (auth.uid() = user_id);

drop policy if exists "shopping_lists_update_own" on public.shopping_lists;
create policy "shopping_lists_update_own"
on public.shopping_lists for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "shopping_lists_delete_own" on public.shopping_lists;
create policy "shopping_lists_delete_own"
on public.shopping_lists for delete
using (auth.uid() = user_id);

drop policy if exists "shopping_list_items_select_own" on public.shopping_list_items;
create policy "shopping_list_items_select_own"
on public.shopping_list_items for select
using (auth.uid() = user_id);

drop policy if exists "shopping_list_items_insert_own" on public.shopping_list_items;
create policy "shopping_list_items_insert_own"
on public.shopping_list_items for insert
with check (auth.uid() = user_id);

drop policy if exists "shopping_list_items_update_own" on public.shopping_list_items;
create policy "shopping_list_items_update_own"
on public.shopping_list_items for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "shopping_list_items_delete_own" on public.shopping_list_items;
create policy "shopping_list_items_delete_own"
on public.shopping_list_items for delete
using (auth.uid() = user_id);
