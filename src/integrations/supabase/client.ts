// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pvpgwuxybdiuticldffe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cGd3dXh5YmRpdXRpY2xkZmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMzkzOTcsImV4cCI6MjA1NTYxNTM5N30.TDuS-Qb7Ca7PeHJ2-0mPnmKRNGPFsVrc3RE7q2nnf0o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);