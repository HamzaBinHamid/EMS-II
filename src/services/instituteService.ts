// src/services/instituteService.ts
import supabase from "../lib/supabase";
import { Institute } from "../types/institute";

export const getInstitutes = async (): Promise<Institute[]> => {
  const { data, error } = await supabase.from("institutes").select("*");

  if (error) {
    console.error("Error fetching institutes:", error.message);
    throw new Error(error.message);
  }
  return data || [];
};
