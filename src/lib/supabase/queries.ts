import { createClient } from "@supabase/supabase-js";
import type { Institute } from "@/types/institute";
import type { FeeStructure } from "@/types/feeStructure";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchInstitutes(): Promise<Institute[]> {
  const { data, error } = await supabase
    .from("institutes")
    .select("institute_name, image_url");

  if (error) throw error;

  const institutesWithUrls = data.map((institute) => {
    if (institute.image_url) {
      const publicUrl = institute.image_url.startsWith("http")
        ? institute.image_url
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/institutes_images/${institute.image_url}`;
      return { ...institute, image_url: publicUrl };
    }
    return institute;
  });

  return institutesWithUrls as Institute[];
}

export async function fetchFeeStructures(): Promise<FeeStructure[]> {
  const { data, error } = await supabase
    .from("fee_structure")
    .select("id, grades, subjects_with_fee");

  if (error) throw error;

  return data as FeeStructure[];
}
