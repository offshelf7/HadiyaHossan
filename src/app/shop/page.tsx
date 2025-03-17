import { createClient } from "../../../supabase/server";
import ProductCard from "@/components/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, LayoutDashboard } from "lucide-react";

export default async function ShopPage() {
  const supabase = await createClient();

  // Fetch products from database
  const { data: products = [] } = await supabase.from("products").select("*");

  // Get user data to check if admin or salesperson
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isAdminOrSalesperson = false;

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("user_role")
      .eq("id", user.id)
      .single();

    isAdminOrSalesperson =
      userData?.user_role === "admin" || userData?.user_role === "salesperson";
  }

  // Get unique categories
  const categories = Array.from(
    new Set(products.map((product) => product.category)),
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Club Shop</h1>
            <p className="text-gray-600">
              Support Hadiya Hossana FC by purchasing official merchandise.
            </p>
          </div>
          {isAdminOrSalesperson && (
            <div className="flex gap-3">
              <Link href="/shop/admin">
                <Button variant="outline" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/shop/admin/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Sales Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 flex flex-wrap">
            <TabsTrigger value="all">All Products</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products
                  .filter((product) => product.category === category)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Footer />
    </>
  );
}
