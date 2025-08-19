
"use client";

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://aobczqrvpudptqgkwpdy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvYmN6cXJ2cHVkcHRxZ2t3cGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxNzUyODIsImV4cCI6MjAzOTc1MTI4Mn0.-1r_j6kOR-v4K3yo0-B2F2y14pnJ54uL4J9S3aZp9wM'
  )
}
