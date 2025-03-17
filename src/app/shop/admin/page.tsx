import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProductTable from "@/components/product-table";

export default async function ShopAdminPage() {
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

  // Fetch products from database
  const { data: products } = await supabase.from("products").select("*");

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shop Management</h1>
        <Link href="/shop/admin/add">
          <Button className="bg-[#640015] hover:bg-[#111827]">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <ProductTable products={products || []} />
    </div>
  );
}
