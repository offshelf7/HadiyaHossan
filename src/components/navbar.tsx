import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { User, UserCircle, Menu } from "lucide-react";
import UserProfile from "./user-profile";
import Image from "next/image";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center">
          <div className="relative w-10 h-10 mr-2">
            <Image
              src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fsoccer.et%2Fclub%2Fhadiya-hossana%2F&psig=AOvVaw2-4I4X7ZyM3q4Nn1EUsGjx&ust=1742124513222000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOj799f9i4wDFQAAAAAdAAAAABAE"
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
            className="font-medium text-gray-700 hover:text-red-700 transition-colors"
          >
            Players
          </Link>
          <Link
            href="/fixtures"
            className="font-medium text-gray-700 hover:text-red-700 transition-colors"
          >
            Fixtures
          </Link>
          <Link
            href="/news"
            className="font-medium text-gray-700 hover:text-red-700 transition-colors"
          >
            News
          </Link>
          <Link
            href="/shop"
            className="font-medium text-gray-700 hover:text-red-700 transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/donate"
            className="font-medium text-gray-700 hover:text-red-700 transition-colors"
          >
            Donate
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button>Dashboard</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-md hover:bg-red-800"
              >
                Sign Up
              </Link>
              <button className="md:hidden text-gray-700">
                <Menu className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
