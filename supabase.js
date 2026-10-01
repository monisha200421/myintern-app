import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wyvtaxxzuqeimpfwsdqw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dnRheHh6dXFlaW1wZndzZHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MzMzOTEsImV4cCI6MjEwNjQwOTM5MX0.OnjZ7RD-7K8sYDKzN1tHWIoUT6sPfzRpJsuU-iCXoS4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
