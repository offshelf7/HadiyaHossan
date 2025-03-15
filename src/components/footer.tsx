import Link from "next/link";
import { Twitter, Instagram, Facebook, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <Image
                src="https://raw.githubusercontent.com/TempoLabsAI/assets/main/hadiya-hossana-fc-logo.png"
                alt="Hadiya Hossana FC Logo"
                width={40}
                height={40}
                className="object-contain mr-2"
              />
              <span className="text-xl font-bold">HADIYA HOSSANA FC</span>
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              Hadiya Hossana FC is a professional football club with a rich
              history and passionate fanbase. Join us on our journey to glory.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Club Column */}
            <div>
              <h3 className="font-semibold text-white mb-4">Club</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-red-500"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/history"
                    className="text-gray-400 hover:text-red-500"
                  >
                    History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stadium"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Stadium
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Teams Column */}
            <div>
              <h3 className="font-semibold text-white mb-4">Teams</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/first-team"
                    className="text-gray-400 hover:text-red-500"
                  >
                    First Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/women"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Women's Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/academy"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Academy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/staff"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Staff
                  </Link>
                </li>
              </ul>
            </div>

            {/* Fans Column */}
            <div>
              <h3 className="font-semibold text-white mb-4">Fans</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/tickets"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Tickets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/membership"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Membership
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donate"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Donate
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessibility"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center md:text-left">
          <div className="text-gray-500">
            © {currentYear} Hadiya Hossana Football Club. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
