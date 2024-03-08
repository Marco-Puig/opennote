import { createClient } from "@supabase/supabase-js";

const URL = "https://dsmzsdwcqosymcyvemmn.supabase.co";
//const API_KEY = process.env.REACT_APP_API_KEY;
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbXpzZHdjcW9zeW1jeXZlbW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc1MzAyNDMsImV4cCI6MjAyMzEwNjI0M30.DXEAHSOtmR9M9fm8HOkhBbM1Gu80ngSj4MDZVcKhxAI";

export const supabase = createClient(URL, API_KEY);
