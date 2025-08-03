// src/lib/getImageUrl.ts

import supabase from "@/services/supabase";

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
export const getPythonImageUrl = (): string => getImageUrl("python.jpeg");
export const getBlockchainImageUrl = (): string => getImageUrl("Blockchain2.jpg");
export const getWebDevelopmentImageUrl = (): string => getImageUrl("web.png");
