"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/actions";
import {
  Home,
  Newspaper,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  BarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole?: string;
}

export default function SidebarNavigation({ userRole = "user" }: SidebarProps) {
  const pathname = usePathname();

  const isAdmin = userRole === "admin";
  const isReporter = userRole === "reporter";
  const isSalesperson = userRole === "salesperson";

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BarChart className="w-5 h-5" />,
      show: true,
    },
    {
      name: "News Management",
      href: "/dashboard/news",
      icon: <Newspaper className="w-5 h-5" />,
      show: isAdmin || isReporter,
    },
    {
      name: "Shop Management",
      href: "/shop/admin",
      icon: <ShoppingBag className="w-5 h-5" />,
      show: isAdmin || isSalesperson,
    },
    {
      name: "User Management",
      href: "/dashboard/users",
      icon: <Users className="w-5 h-5" />,
      show: isAdmin,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
      show: isAdmin,
    },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
          </li>
          <li>
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
}
