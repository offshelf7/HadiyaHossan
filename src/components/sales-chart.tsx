"use client";

import { useEffect, useRef } from "react";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  [key: string]: any;
}

interface SalesChartProps {
  orders: Order[];
}

export default function SalesChart({ orders }: SalesChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadChart = async () => {
      const Chart = (await import("chart.js/auto")).default;

      // Process data for the chart
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      }).reverse();

      const monthLabels = last6Months.map((date) => {
        return date.toLocaleString("default", { month: "short" });
      });

      const monthlySales = last6Months.map((date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        return orders
          .filter((order) => {
            const orderDate = new Date(order.created_at);
            return (
              orderDate.getFullYear() === year && orderDate.getMonth() === month
            );
          })
          .reduce((sum, order) => sum + (order.total_amount || 0), 0);
      });

      // Destroy existing chart if it exists
      const chartInstance = Chart.getChart(chartRef.current);
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create new chart
      if (chartRef.current) {
        new Chart(chartRef.current, {
          type: "line",
          data: {
            labels: monthLabels,
            datasets: [
              {
                label: "Monthly Sales",
                data: monthlySales,
                borderColor: "rgb(220, 38, 38)",
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `$${context.raw}`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return "$" + value;
                  },
                },
              },
            },
          },
        });
      }
    };

    loadChart();
  }, [orders]);

  return (
    <div className="w-full h-[300px]">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
