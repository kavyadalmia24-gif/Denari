import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjwdovogugfsubjmxcho.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd2Rvdm9ndWdmc3Viam14Y2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MTA1OTAsImV4cCI6MjA4MDA4NjU5MH0.95i1dDysuqhgGjgx3b3Y2tg2NWqRLNldjwnVJ9z2q64';

export const supabase = createClient(supabaseUrl, supabaseKey);