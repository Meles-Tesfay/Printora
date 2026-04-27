-- Create a table for user uploaded assets
create table if not exists public.user_assets (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    file_name text not null,
    file_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS policies for user_assets
alter table public.user_assets enable row level security;

create policy "Users can view their own assets"
    on public.user_assets for select
    using (auth.uid() = user_id);

create policy "Users can insert their own assets"
    on public.user_assets for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own assets"
    on public.user_assets for delete
    using (auth.uid() = user_id);

-- Storage bucket for user uploads
insert into storage.buckets (id, name, public) 
values ('user_assets', 'user_assets', true)
on conflict (id) do nothing;

-- Ensure public access to the bucket objects
create policy "Public Access"
    on storage.objects for select
    using ( bucket_id = 'user_assets' );

create policy "Users can upload to their own folder"
    on storage.objects for insert
    with check (
        bucket_id = 'user_assets' and 
        (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Users can update their own folder"
    on storage.objects for update
    using (
        bucket_id = 'user_assets' and 
        (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Users can delete their own folder"
    on storage.objects for delete
    using (
        bucket_id = 'user_assets' and 
        (storage.foldername(name))[1] = auth.uid()::text
    );
