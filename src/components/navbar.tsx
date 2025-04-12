"use client";

import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import CartIcon from "./cart-icon";
import UserProfile from "./user-profile";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/auth";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./language-switcher";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center">
          <div className="relative w-10 h-10 mr-2">
            <Image
              src="https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=300&q=80"
              alt="Hadiya Hossana FC Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold">HADIYA HOSSANA FC</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            href="/players"
            className="font-medium text-gray-700 hover:text-[#640015] transition-colors"
          >
            Players
          </Link>
          <Link
            href="/fixtures"
            className="font-medium text-gray-700 hover:text-[#640015] transition-colors"
          >
            Fixtures
          </Link>
          <Link
            href="/news"
            className="font-medium text-gray-700 hover:text-[#640015] transition-colors"
          >
            News
          </Link>
          <Link
            href="/shop"
            className="font-medium text-gray-700 hover:text-[#640015] transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/donate"
            className="font-medium text-gray-700 hover:text-[#640015] transition-colors"
          >
            Donate
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <LanguageSwitcher />
          <div className="mr-2">
            <CartIcon />
          </div>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button>Dashboard</Button>
              </Link>
              <UserProfile />
              <button
                className="md:hidden text-gray-700 ml-2"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden md:inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="hidden md:inline-block px-4 py-2 text-sm font-medium text-white bg-[#640015] rounded-md hover:bg-[#111827]"
              >
                Sign Up
              </Link>
              <button
                className="md:hidden text-gray-700"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <div className="flex flex-col space-y-4">
            <Link
              href="/players"
              className="font-medium text-gray-700 hover:text-[#640015] transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              Players
            </Link>
            <Link
              href="/fixtures"
              className="font-medium text-gray-700 hover:text-[#640015] transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              Fixtures
            </Link>
            <Link
              href="/news"
              className="font-medium text-gray-700 hover:text-[#640015] transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              News
            </Link>
            <Link
              href="/shop"
              className="font-medium text-gray-700 hover:text-[#640015] transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              Shop
            </Link>
            <Link
              href="/donate"
              className="font-medium text-gray-700 hover:text-[#640015] transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              Donate
            </Link>
            {!user && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md border border-gray-300"
                  onClick={toggleMobileMenu}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#640015] rounded-md hover:bg-[#111827]"
                  onClick={toggleMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
