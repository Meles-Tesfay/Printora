-- Storage bucket for product images uploaded by suppliers
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Ensure public access to the bucket objects
create policy "Public Access to product-images"
    on storage.objects for select
    using ( bucket_id = 'product-images' );

create policy "Suppliers can upload product-images to their own folder"
    on storage.objects for insert
    with check (
        bucket_id = 'product-images' and 
        (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Suppliers can update their own product-images folder"
    on storage.objects for update
    using (
        bucket_id = 'product-images' and 
        (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "Suppliers can delete their own product-images folder"
    on storage.objects for delete
    using (
        bucket_id = 'product-images' and 
        (storage.foldername(name))[1] = auth.uid()::text
    );
