import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cylkxpnemlvpkwkzhlmk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bGt4cG5lbWx2cGt3a3pobG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNjM5NjgsImV4cCI6MjA0MzgzOTk2OH0.H9n1wII6lfCMm5RYTqr6ycHpcJ5oVVMIxNtirDo2mS0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);