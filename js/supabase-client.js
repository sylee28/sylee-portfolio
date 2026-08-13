/* ===========================================================
   Fill these two values in after you create your Supabase project.
   Settings → API → "Project URL" and "anon public" key.
   These are safe to expose in front-end code — they only work
   together with the Row Level Security rules in supabase/schema.sql,
   which are what actually keep writes admin-only.
   =========================================================== */
const SUPABASE_URL = 'https://xdceymgnclxpplllbezk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6_mbPpw2EK4x_jZdyHTHSw_oe360xIj';

window.supabaseClient = (SUPABASE_URL.indexOf('YOUR_') === 0)
  ? null
  : window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (!window.supabaseClient) {
  console.warn('Supabase 尚未設定。請照 supabase/README.md 的步驟建立專案，並把網址和 anon key 填進 js/supabase-client.js。');
}
