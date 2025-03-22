"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowUpDown, Plus, Minus } from "lucide-react";
import SidebarNavigation from "@/components/sidebar-navigation";

export default function InventoryManagementPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, [sortField, sortDirection]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAdjustmentChange = (productId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setAdjustments({
      ...adjustments,
      [productId]: numValue,
    });
  };

  const handleUpdateInventory = async (
    productId: string,
    adjustment: number,
  ) => {
    if (adjustment === 0) return;

    setIsSubmitting(true);
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // Call the appropriate function based on whether we're adding or removing inventory
      const functionName =
        adjustment > 0 ? "restock_inventory" : "decrement_inventory";
      const quantity = Math.abs(adjustment);

      const { data, error } = await supabase.rpc(functionName, {
        p_product_id: productId,
        p_quantity: quantity,
      });

      if (error) throw error;

      // Update the local state
      setProducts(
        products.map((p) => {
          if (p.id === productId) {
            return { ...p, inventory_count: p.inventory_count + adjustment };
          }
          return p;
        }),
      );

      // Clear the adjustment
      setAdjustments({
        ...adjustments,
        [productId]: 0,
      });

      toast({
        title: "Success",
        description: `Inventory updated for ${product.name}`,
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast({
        title: "Error",
        description: "Failed to update inventory",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarNavigation userRole="admin" />
      <div className="flex-1 p-8 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>
              Manage product inventory levels and make adjustments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => handleSort("name")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Product Name
                        {sortField === "name" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("category")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Category
                        {sortField === "category" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("inventory_count")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Current Stock
                        {sortField === "inventory_count" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Adjustment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${product.inventory_count <= 5 ? "text-orange-600" : product.inventory_count === 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {product.inventory_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleAdjustmentChange(
                                product.id,
                                String((adjustments[product.id] || 0) - 1),
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={adjustments[product.id] || 0}
                            onChange={(e) =>
                              handleAdjustmentChange(product.id, e.target.value)
                            }
                            className="w-20 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleAdjustmentChange(
                                product.id,
                                String((adjustments[product.id] || 0) + 1),
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleUpdateInventory(
                              product.id,
                              adjustments[product.id] || 0,
                            )
                          }
                          disabled={
                            isSubmitting || !(adjustments[product.id] || 0)
                          }
                          variant={
                            adjustments[product.id] > 0
                              ? "default"
                              : adjustments[product.id] < 0
                                ? "destructive"
                                : "outline"
                          }
                          size="sm"
                        >
                          {adjustments[product.id] > 0
                            ? "Add Stock"
                            : adjustments[product.id] < 0
                              ? "Remove Stock"
                              : "Update"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
