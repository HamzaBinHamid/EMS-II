import supabase from "@/lib/supabase";
import type { Institute } from "@/types/institute";

export const fetchInstitutes = async (): Promise<Institute[]> => {
  const { data, error } = await supabase.from("institutes").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
};
