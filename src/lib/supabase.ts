import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

export const useSupabase = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error("Supbase環境変数の設定に問題がある可能性が高いです。");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  return { supabase };
};
