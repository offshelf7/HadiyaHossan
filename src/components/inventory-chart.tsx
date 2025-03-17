"use client";

import { useEffect, useRef } from "react";
import { Product } from "@/types/product";

interface InventoryChartProps {
  products: Product[];
}

export default function InventoryChart({ products }: InventoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadChart = async () => {
      const Chart = (await import("chart.js/auto")).default;

      // Group products by category
      const categories = Array.from(new Set(products.map((p) => p.category)));
      const productsByCategory = categories.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.category === category,
        );
        return {
          category,
          inStock: categoryProducts.filter((p) => p.inStock).length,
          outOfStock: categoryProducts.filter((p) => !p.inStock).length,
          total: categoryProducts.length,
        };
      });

      // Destroy existing chart if it exists
      const chartInstance = Chart.getChart(chartRef.current);
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create new chart
      if (chartRef.current) {
        new Chart(chartRef.current, {
          type: "bar",
          data: {
            labels: categories.map(
              (c) => c.charAt(0).toUpperCase() + c.slice(1),
            ),
            datasets: [
              {
                label: "In Stock",
                data: productsByCategory.map((c) => c.inStock),
                backgroundColor: "rgba(34, 197, 94, 0.7)",
              },
              {
                label: "Out of Stock",
                data: productsByCategory.map((c) => c.outOfStock),
                backgroundColor: "rgba(239, 68, 68, 0.7)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Number of Products",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Product Categories",
                },
              },
            },
          },
        });
      }
    };

    loadChart();
  }, [products]);

  return (
    <div className="w-full h-[300px]">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
