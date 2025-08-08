import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ivxhmuhlmdofodxrhvap.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2eGhtdWhsbWRvZm9keHJodmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODIzODgsImV4cCI6MjA3MDI1ODM4OH0.M1UkAXYedD5koG-P4WLEeHrtHPpGbRS4G1VW1Jx2uJ0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getServerSideProps({ params, res }) {
  const { alias } = params;

  const { data, error } = await supabase
    .from("urls")
    .select("original_url")
    .eq("id", alias)
    .maybeSingle();

  if (error || !data) {
    // Redirect ke halaman 404 atau homepage kalau alias tidak ditemukan
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  res.writeHead(302, { Location: data.original_url });
  res.end();

  return { props: {} };
}

export default function RedirectPage() {
  // Ini tidak akan ditampilkan karena redirect sudah dilakukan di server
  return null;
}
