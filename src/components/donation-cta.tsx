import Link from "next/link";
import { Heart } from "lucide-react";

export default function DonationCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#7f001b] to-[#5a0013] text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block bg-white p-3 rounded-full mb-6">
          <Heart className="w-8 h-8 text-[#7f001b]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Support Hadiya Hossana FC
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Your donations help us invest in facilities, youth development, and
          community programs. Join our supporters in making a difference.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/donate"
            className="inline-flex items-center px-8 py-4 bg-white text-[#7f001b] rounded font-bold hover:bg-gray-100 transition-colors"
          >
            Make a Donation
          </Link>
          <Link
            href="/membership"
            className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded font-bold hover:bg-white hover:text-[#7f001b] transition-colors"
          >
            Become a Member ($500/year)
          </Link>
        </div>
      </div>
    </section>
  );
}
