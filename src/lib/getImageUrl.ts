// src/lib/getImageUrl.ts

import supabase from "@/lib/supabase";

/**
 * Fetches a public URL for a file stored in the "images" bucket in Supabase Storage.
 *
 * @param fileName - The name of the file in the "images" bucket
 * @returns The public URL of the image
 */
export const getImageUrl = (fileName: string): string => {
  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
};

export const getLogoUrl = (): string => getImageUrl("logo4.png");

/**
 * Gets the public URL of the Python course image (python.jpeg).
 */
export const carousel1 = (): string => getImageUrl("carousel1.jpg");
export const carousel2 = (): string => getImageUrl("carousel2.jpg");
export const carousel4 = (): string => getImageUrl("carousel4.jpg");
export const carousel5 = (): string => getImageUrl("carousel5.jpg");
export const fee = (): string => getImageUrl("fee.png");
export const admission = (): string => getImageUrl("admission.png");
export const t1 = (): string => getImageUrl("t1.png");
export const t2 = (): string => getImageUrl("t2.png");
export const t3 = (): string => getImageUrl("t3.png");
export const t4 = (): string => getImageUrl("t4.png");
export const t5 = (): string => getImageUrl("t5.png");
export const t6 = (): string => getImageUrl("t6.png");
export const t7 = (): string => getImageUrl("t7.png");
export const t8 = (): string => getImageUrl("t8.png");
export const t9 = (): string => getImageUrl("t9.png");
