
"use client";

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://iwdfzvfqgupmrtpizeml.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZGZ6dmZxZ3VwbXJ0cGl6ZW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0MjYxMDUsImV4cCI6MjAzNDk4MjEwNX0.5B8i26G2L-dIAbrg22hpM3Ow1i9sCIYf0G0M32V6vQY'
  )
}
