import { createClient } from "../../../../supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductDetailClient from "@/components/product-detail-client";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch product details
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    return notFound();
  }

  // Fetch related products in the same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-xl font-bold text-red-700 mt-2">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-gray-600">{product.description}</p>
              </TabsContent>
              <TabsContent value="details" className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p className="text-gray-600 capitalize">{product.category}</p>
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Available Sizes</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.sizes.map((size: string) => (
                        <span
                          key={size}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Available Colors</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.colors.map((color: string) => (
                        <span
                          key={color}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <ProductDetailClient product={product} />
          </div>
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold">{relatedProduct.name}</h3>
                  <p className="text-red-700 font-medium">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                  <Button asChild variant="outline" className="w-full mt-2">
                    <a href={`/shop/${relatedProduct.id}`}>View Details</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
