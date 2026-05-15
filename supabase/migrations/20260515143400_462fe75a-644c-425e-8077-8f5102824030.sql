
DROP POLICY IF EXISTS "media_select_public" ON storage.objects;
CREATE POLICY "media_select_own" ON storage.objects FOR SELECT USING (
  bucket_id = 'project-media' AND auth.uid()::text = (storage.foldername(name))[1]
);

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
