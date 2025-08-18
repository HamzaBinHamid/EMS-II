import { createClient } from "@supabase/supabase-js";
import type { Institute } from "@/types/institute";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchInstitutes() {
  const { data, error } = await supabase.from("institutes").select("institute_name, institute_category, image_url");
  if (error) throw error;

  // Use the stored image_url directly if it's a full URL
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