import { Product } from "@/types/product";
import { createClient } from "../../supabase/client";

// This file is kept for backward compatibility
// Products are now stored in the database

export const getProductById = async (id: string): Promise<Product | null> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  return data;
};

export const getProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category", category);

  return data || [];
};
