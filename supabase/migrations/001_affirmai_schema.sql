-- ============================================================================
-- AffirmAI Database Schema
-- ============================================================================
-- Run this migration against your Supabase project:
--   Supabase Dashboard → SQL Editor → paste & run
-- ============================================================================

-- ─── Profiles ────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  goals text[] default '{}',
  mood_preferences text[] default '{}',
  reminder_time time,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Affirmations ────────────────────────────────────────────────────────────

create table if not exists public.affirmations (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text not null,
  is_ai_generated boolean default false,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- ─── Favorites ───────────────────────────────────────────────────────────────

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  affirmation_id uuid not null references public.affirmations(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, affirmation_id)
);

-- ─── Streaks ─────────────────────────────────────────────────────────────────

create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  visit_date date not null default current_date,
  created_at timestamptz default now(),
  unique(user_id, visit_date)
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists idx_affirmations_category on public.affirmations(category);
create index if not exists idx_affirmations_user on public.affirmations(user_id);
create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_favorites_affirmation on public.favorites(affirmation_id);
create index if not exists idx_streaks_user on public.streaks(user_id);
create index if not exists idx_streaks_date on public.streaks(user_id, visit_date);

-- ─── RLS Policies ────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.affirmations enable row level security;
alter table public.favorites enable row level security;
alter table public.streaks enable row level security;

-- Profiles
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Affirmations: anyone can read (seeded data), users insert own AI-generated
create policy "Anyone reads affirmations"
  on public.affirmations for select
  using (true);

create policy "Users insert own affirmations"
  on public.affirmations for insert
  with check (auth.uid() = user_id);

create policy "Users delete own affirmations"
  on public.affirmations for delete
  using (auth.uid() = user_id);

-- Favorites
create policy "Users read own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users insert own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Streaks
create policy "Users read own streaks"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "Users insert own streaks"
  on public.streaks for insert
  with check (auth.uid() = user_id);

-- ─── Auto-create profile on signup ──────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplicate
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Updated_at trigger ─────────────────────────────────────────────────────

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- ─── Seed Affirmations ──────────────────────────────────────────────────────

insert into public.affirmations (text, category) values
  -- Confidence
  ('I am worthy of all the good things that come my way.', 'confidence'),
  ('I believe in my abilities and trust my journey.', 'confidence'),
  ('I am enough exactly as I am right now.', 'confidence'),
  ('I radiate confidence, certainty, and power.', 'confidence'),
  ('I am becoming stronger and more resilient every day.', 'confidence'),
  ('My potential is limitless and I am capable of anything.', 'confidence'),
  ('I trust myself to make the right decisions.', 'confidence'),
  ('I am proud of who I am becoming.', 'confidence'),
  ('Every challenge I face makes me more confident.', 'confidence'),
  ('I stand tall and speak my truth with conviction.', 'confidence'),

  -- Career Growth
  ('I am creating a career that fulfills and inspires me.', 'career'),
  ('Every day I grow closer to my professional dreams.', 'career'),
  ('I attract opportunities that align with my purpose.', 'career'),
  ('My skills and talents are valued and appreciated.', 'career'),
  ('I am a leader who inspires others through action.', 'career'),
  ('Success flows to me naturally and effortlessly.', 'career'),
  ('I am open to new possibilities in my career.', 'career'),
  ('I contribute meaningfully to everything I work on.', 'career'),
  ('My work ethic and dedication set me apart.', 'career'),
  ('I deserve the success that is coming my way.', 'career'),

  -- Productivity
  ('I am focused, organized, and in control of my time.', 'productivity'),
  ('I complete tasks with energy and enthusiasm.', 'productivity'),
  ('I prioritize what matters and let go of distractions.', 'productivity'),
  ('Every small step I take brings me closer to my goals.', 'productivity'),
  ('I am disciplined and make the most of every moment.', 'productivity'),
  ('My mind is clear and my intentions are focused.', 'productivity'),
  ('I accomplish more by doing less with greater intention.', 'productivity'),
  ('I am in charge of my schedule and my energy.', 'productivity'),
  ('I celebrate progress, not just perfection.', 'productivity'),
  ('I have the power to create change through consistent action.', 'productivity'),

  -- Self Love
  ('I love and accept myself unconditionally.', 'self-love'),
  ('I am deserving of love, happiness, and inner peace.', 'self-love'),
  ('I honor my needs and give myself permission to rest.', 'self-love'),
  ('I am gentle with myself during times of growth.', 'self-love'),
  ('My self-worth is not determined by others'' opinions.', 'self-love'),
  ('I choose to see the beauty in myself every day.', 'self-love'),
  ('I am my own best friend and biggest supporter.', 'self-love'),
  ('I forgive myself for past mistakes and embrace today.', 'self-love'),
  ('I nourish my mind, body, and soul with kindness.', 'self-love'),
  ('I am a beautiful work in progress.', 'self-love'),

  -- Fitness
  ('My body is strong, capable, and full of energy.', 'fitness'),
  ('I am grateful for what my body can do.', 'fitness'),
  ('Every workout brings me closer to my best self.', 'fitness'),
  ('I fuel my body with nourishing food and positive thoughts.', 'fitness'),
  ('I am committed to my health and well-being.', 'fitness'),
  ('My strength grows with every challenge I embrace.', 'fitness'),
  ('I listen to my body and give it what it needs.', 'fitness'),
  ('Movement is a celebration of what my body can do.', 'fitness'),
  ('I am building healthy habits that last a lifetime.', 'fitness'),
  ('My dedication to fitness transforms my mind and body.', 'fitness'),

  -- Relationships
  ('I attract loving, supportive, and genuine people.', 'relationships'),
  ('I communicate with honesty, empathy, and compassion.', 'relationships'),
  ('I am worthy of deep, meaningful connections.', 'relationships'),
  ('I bring joy and positivity to my relationships.', 'relationships'),
  ('I set healthy boundaries that honor my well-being.', 'relationships'),
  ('I am grateful for the people who enrich my life.', 'relationships'),
  ('I give and receive love freely and openly.', 'relationships'),
  ('My relationships grow stronger through understanding.', 'relationships'),
  ('I choose to surround myself with people who uplift me.', 'relationships'),
  ('I am a source of love and inspiration for others.', 'relationships'),

  -- Anxiety Relief
  ('I release all worries and embrace this present moment.', 'anxiety-relief'),
  ('I am safe, I am grounded, and I am at peace.', 'anxiety-relief'),
  ('I breathe in calm and breathe out tension.', 'anxiety-relief'),
  ('My mind is quiet and my heart is at ease.', 'anxiety-relief'),
  ('I trust that everything is unfolding as it should.', 'anxiety-relief'),
  ('I choose peace over worry, and faith over fear.', 'anxiety-relief'),
  ('I am in control of my thoughts and I choose calm.', 'anxiety-relief'),
  ('This too shall pass, and I will emerge stronger.', 'anxiety-relief'),
  ('I let go of what I cannot control and focus on what I can.', 'anxiety-relief'),
  ('I am surrounded by peace and everything is well.', 'anxiety-relief')

on conflict do nothing;
