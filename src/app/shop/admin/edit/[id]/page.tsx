import { createClient } from "../../../../../../supabase/server";
import { redirect } from "next/navigation";
import ProductForm from "@/components/product-form";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user data including role
  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Check if user is admin or salesperson
  const isAdmin = userData?.user_role === "admin";
  const isSalesperson = userData?.user_role === "salesperson";

  // If not admin or salesperson, redirect to home page
  if (!isAdmin && !isSalesperson) {
    return redirect("/");
  }

  // Fetch product data
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    return redirect("/shop/admin");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
