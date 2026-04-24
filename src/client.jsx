import { createClient } from "@supabase/supabase-js";

const URL = "https://lyjszfmmjvpqcpaatgzp.supabase.co";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5anN6Zm1tanZwcWNwYWF0Z3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDE5OTIsImV4cCI6MjA5MjYxNzk5Mn0.Wp5Nj4ew14zkXpIGSA4qYA0Odd3Z3oqXaV5g4csXsW0";

export const supabase = createClient(URL, API_KEY);
