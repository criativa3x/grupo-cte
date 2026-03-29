import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lrbfejskngapnzuwtiim.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JBe4LeOgxxcDPbJV1QZ0HA_ANnF_TvS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
  },
});
