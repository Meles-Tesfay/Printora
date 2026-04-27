const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("No DATABASE_URL found in .env.local!");
    process.exit(1);
}

const client = new Client({ connectionString });

const sql = `
-- ─── user_assets table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_assets (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name   TEXT NOT NULL,
    file_url    TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.user_assets ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own assets' AND tablename = 'user_assets') THEN
        CREATE POLICY "Users can view their own assets"
            ON public.user_assets FOR SELECT
            USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own assets' AND tablename = 'user_assets') THEN
        CREATE POLICY "Users can insert their own assets"
            ON public.user_assets FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own assets' AND tablename = 'user_assets') THEN
        CREATE POLICY "Users can delete their own assets"
            ON public.user_assets FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- ─── Storage bucket ───────────────────────────────────────────────────────────
-- NOTE: The storage bucket itself must be created via the Supabase Dashboard
-- (Storage → New bucket → name: "user_assets", Public: ON).
-- The RLS policies below only apply to storage.objects (controlled via SQL).

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_assets public read' AND tablename = 'objects') THEN
        CREATE POLICY "user_assets public read"
            ON storage.objects FOR SELECT
            USING (bucket_id = 'user_assets');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_assets authenticated insert' AND tablename = 'objects') THEN
        CREATE POLICY "user_assets authenticated insert"
            ON storage.objects FOR INSERT
            WITH CHECK (
                bucket_id = 'user_assets'
                AND auth.role() = 'authenticated'
                AND (storage.foldername(name))[1] = auth.uid()::text
            );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_assets owner delete' AND tablename = 'objects') THEN
        CREATE POLICY "user_assets owner delete"
            ON storage.objects FOR DELETE
            USING (
                bucket_id = 'user_assets'
                AND (storage.foldername(name))[1] = auth.uid()::text
            );
    END IF;
END $$;
`;

(async () => {
    try {
        console.log("Connecting to Supabase...");
        await client.connect();
        console.log("Connected. Running migration 004 (user_assets)...");
        await client.query(sql);
        console.log("✅ Migration 004 complete!");
        console.log("");
        console.log("⚠️  IMPORTANT: You still need to create the storage bucket manually:");
        console.log("   1. Go to your Supabase Dashboard → Storage");
        console.log("   2. Click 'New bucket'");
        console.log("   3. Name: user_assets");
        console.log("   4. Toggle 'Public bucket' ON");
        console.log("   5. Click 'Create bucket'");
    } catch (err) {
        console.error("❌ Migration error:", err.message);
    } finally {
        await client.end();
    }
})();
