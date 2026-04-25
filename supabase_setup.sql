-- SQL to setup Supabase for "Trabalhe Conosco" feature

-- 1. Create the table for candidates if not exists
CREATE TABLE IF NOT EXISTS public.candidatos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    url_curriculo TEXT NOT NULL,
    status TEXT DEFAULT 'Novo'
);

-- Note: To enable Realtime for this table, run:
-- ALTER PUBLICATION supabase_realtime ADD TABLE candidatos;

-- 2. Enable RLS on the table
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow anyone to insert (Submit resume)
CREATE POLICY "Allow public inserts" ON public.candidatos
FOR INSERT WITH CHECK (true);

-- 4. Create policy to allow authenticated users to view (Admin Panel)
CREATE POLICY "Allow authenticated selects" ON public.candidatos
FOR SELECT TO authenticated USING (true);

-- 5. Create policy to allow authenticated users to delete (Admin Panel)
CREATE POLICY "Allow authenticated deletes" ON public.candidatos
FOR DELETE TO authenticated USING (true);

-- 6. Create policy to allow authenticated users to update (Admin Panel)
CREATE POLICY "Allow authenticated updates" ON public.candidatos
FOR UPDATE TO authenticated USING (true);

-- 7. STORAGE POLICIES (Run these in the SQL Editor)
-- Note: Make sure the bucket 'curriculos' exists in Storage and is set to "Public"

-- Allow public uploads to bucket 'curriculos'
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'curriculos' );

-- Allow public access to read files in 'curriculos'
CREATE POLICY "Allow public view"
ON storage.objects FOR SELECT
USING ( bucket_id = 'curriculos' );
