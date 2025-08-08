import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const SUPABASE_URL = "https://ivxhmuhlmdofodxrhvap.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2eGhtdWhsbWRvZm9keHJodmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODIzODgsImV4cCI6MjA3MDI1ODM4OH0.M1UkAXYedD5koG-P4WLEeHrtHPpGbRS4G1VW1Jx2uJ0";

  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function createShort() {
    if (!url) {
      setResult({ error: "Masukkan URL!" });
      return;
    }
    setLoading(true);
    setResult(null);
    let code = alias || generateRandomAlias();

    try {
      const { data: existing, error: selectError } = await supabase
        .from("urls")
        .select("id")
        .eq("id", code)
        .maybeSingle();

      if (selectError) throw selectError;
      if (existing) {
        setResult({ error: `Custom code "${code}" sudah dipakai` });
      } else {
        const { error: insertError } = await supabase
          .from("urls")
          .insert({ id: code, original_url: url });

        if (insertError) throw insertError;
        setResult({ success: `Shortlink dibuat: ${window.location.origin}/${code}` });
      }
    } catch (e) {
      setResult({ error: "Terjadi error, coba lagi nanti." });
    } finally {
      setLoading(false);
    }
  }

  function generateRandomAlias() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let res = "";
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Zenzxz ShortURL</h1>
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        type="text"
        placeholder="Opsional custom code (contoh: hi)"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button onClick={createShort} disabled={loading} style={{ width: "100%", padding: 10 }}>
        {loading ? "Processing..." : "Create Shortlink"}
      </button>

      {result?.error && <p style={{ color: "red" }}>{result.error}</p>}
      {result?.success && <p style={{ color: "green" }}>{result.success}</p>}
    </div>
  );
}
