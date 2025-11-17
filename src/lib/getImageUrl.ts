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
export const ourteachers2 = (): string => getImageUrl("ourteachers2.png");
export const fee1 = (): string => getImageUrl("fee1.png");
export const admission1 = (): string => getImageUrl("admission1.png");
export const hamza1 = (): string => getImageUrl("hamza1.png");
export const iqra1 = (): string => getImageUrl("iqra1.png");
export const marwa1 = (): string => getImageUrl("marwa1.png");
export const bakhtawar1 = (): string => getImageUrl("bakhtawar1.png");
export const abdullah1 = (): string => getImageUrl("abdullah1.png");
export const mujahid1 = (): string => getImageUrl("mujahid1.png");
export const hafsa1 = (): string => getImageUrl("hafsa1.png");
export const safia1 = (): string => getImageUrl("safia1.png");
export const mahnoor1 = (): string => getImageUrl("mahnoor1.png");
export const kalsoom1 = (): string => getImageUrl("kalsoom1.png");
export const aqsa1 = (): string => getImageUrl("aqsa1.png");
