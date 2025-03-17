"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Product } from "@/types/product";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps = {}) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    image: product?.image || "",
    category: product?.category || "jerseys",
    sizes: product?.sizes || ["S", "M", "L", "XL"],
    colors: product?.colors || [],
    inStock: product?.inStock ?? true,
  });

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      inStock: checked,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizes?.includes(sizeInput.trim())) {
      setFormData({
        ...formData,
        sizes: [...(formData.sizes || []), sizeInput.trim()],
      });
      setSizeInput("");
    }
  };

  const removeSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes?.filter((s) => s !== size),
    });
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors?.includes(colorInput.trim())) {
      setFormData({
        ...formData,
        colors: [...(formData.colors || []), colorInput.trim()],
      });
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors?.filter((c) => c !== color),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a unique ID if it's a new product
      const productId = product?.id || `${formData.category}-${Date.now()}`;

      const productData = {
        id: productId,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image: formData.image,
        category: formData.category,
        sizes: formData.sizes,
        colors: formData.colors,
        inStock: formData.inStock,
      };

      if (product) {
        // Update existing product
        await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);
      } else {
        // Insert new product
        await supabase.from("products").insert(productData);
      }

      router.push("/shop/admin");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jerseys">Jerseys</SelectItem>
                  <SelectItem value="shorts">Shorts</SelectItem>
                  <SelectItem value="footwear">Footwear</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Sizes</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.sizes?.map((size) => (
                <div
                  key={size}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="Add size (e.g. S, M, L)"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addSize}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Colors</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.colors?.map((color) => (
                <div
                  key={color}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="Add color (e.g. Red, Blue)"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addColor}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-red-700 hover:bg-red-800"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : product
                  ? "Update Product"
                  : "Add Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/shop/admin")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
