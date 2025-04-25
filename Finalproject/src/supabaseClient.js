import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znbeyerzncbefvyugdye.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYmV5ZXJ6bmNiZWZ2eXVnZHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MTg4MzMsImV4cCI6MjA2MTE5NDgzM30.LD8k4PqzbHqBQPWJAVM4-RdHWFRsphY0fIhTbr_Y9iE'; // Replace with your Supabase API Key

export const supabase = createClient(supabaseUrl, supabaseKey);