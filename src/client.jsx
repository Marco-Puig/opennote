import { createClient } from "@supabase/supabase-js";

const URL = "https://dsmzsdwcqosymcyvemmn.supabase.co";

const API_KEY = process.env.REACT_APP_API_KEY;

export const supabase = createClient(URL, API_KEY);
