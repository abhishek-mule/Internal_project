-- Create the user_profiles table
create table if not exists public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  role text not null check (role in ('farmer', 'middleman', 'admin')),
  location text,
  wallet_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id),
  unique(wallet_address)
);

-- Create a trigger to update the updated_at column
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language 'plpgsql';

-- Create the trigger for user_profiles
drop trigger if exists update_user_profiles_updated_at on public.user_profiles;
create trigger update_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute procedure update_updated_at_column();

-- Set up Row Level Security
alter table public.user_profiles enable row level security;

-- Create access policies
create policy "Public profiles are viewable by everyone"
  on public.user_profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);