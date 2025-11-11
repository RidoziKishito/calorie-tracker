-- Supabase schema for CalorieTracker
-- Apply this in Supabase SQL editor (or psql) before connecting the FastAPI backend

-- Use public schema
set search_path to public;

-- Optional: enable useful extensions
create extension if not exists pgcrypto; -- for gen_random_uuid()
-- uuid-ossp extension name contains a dash; in Supabase use quoted identifier
create extension if not exists "uuid-ossp"; -- for uuid_generate_v4()

-- Drop existing tables if you need a clean slate (beware: this will delete data)
-- drop table if exists food_logs cascade;
-- drop table if exists users cascade;

-- Users table
create table if not exists users (
  id serial primary key,
  email text not null unique,
  name text not null,
  hashed_password text not null,

  -- Profile fields
  age integer,
  gender text,
  height double precision,
  weight double precision,
  "activityLevel" text,
  goal text,
  "dailyCalories" integer default 2000,

  created_at timestamptz not null default now()
);

create index if not exists idx_users_email on users (email);

-- Food logs table
create table if not exists food_logs (
  id serial primary key,
  user_id integer not null references users(id) on delete cascade,

  name text not null,
  calories integer not null,
  protein integer not null,
  carbs integer not null,
  fat integer not null,
  portion text not null,
  "mealType" text not null,
  "imageUrl" text,

  "timestamp" timestamptz not null default now()
);

create index if not exists idx_food_logs_user_id on food_logs (user_id);
create index if not exists idx_food_logs_timestamp on food_logs ("timestamp");

-- Optional: simple view to summarize daily calories per user
create or replace view v_user_daily_calories as
select
  u.id as user_id,
  u.email,
  date(fl."timestamp") as day,
  sum(fl.calories) as total_calories
from users u
left join food_logs fl on fl.user_id = u.id
group by u.id, u.email, date(fl."timestamp");

-- Notes:
-- 1) We intentionally keep integer IDs to match the current frontend and backend models
-- 2) Authentication is handled by FastAPI; we are not using Supabase Auth in this setup
-- 3) RLS policies are not enabled here because access is via the backend server account
-- 4) Ensure your Supabase connection string includes sslmode=require (default from dashboard)
