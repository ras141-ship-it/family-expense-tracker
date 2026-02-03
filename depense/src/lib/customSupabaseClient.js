import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvuhvyexcqniatdzmsmp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dWh2eWV4Y3FuaWF0ZHptc21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjY3NzgsImV4cCI6MjA4NTcwMjc3OH0.nVoo7vqWtVy2v_nsAdFJCkAgA_4iZeeIW9fV2QrdGPI';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
