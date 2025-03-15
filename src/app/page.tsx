import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UpcomingMatches from "@/components/upcoming-matches";
import NewsFeed from "@/components/news-feed";
import DonationCTA from "@/components/donation-cta";
import { createClient } from "../../supabase/server";
import { ArrowUpRight, Trophy, Calendar, Users, Star } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <UpcomingMatches />
      <NewsFeed />

      {/* Club Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2 text-[#7f001b]">1992</div>
              <div className="text-gray-300">Year Founded</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-[#7f001b]">12</div>
              <div className="text-gray-300">Major Trophies</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-[#7f001b]">
                25,000+
              </div>
              <div className="text-gray-300">Stadium Capacity</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-[#7f001b]">2M+</div>
              <div className="text-gray-300">Global Fans</div>
            </div>
          </div>
        </div>
      </section>

      {/* Club Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Club Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our club is built on a foundation of excellence, community, and
              passion for the beautiful game.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Trophy className="w-6 h-6" />,
                title: "Excellence",
                description:
                  "Striving for the highest standards in everything we do",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Community",
                description:
                  "Engaging with and giving back to our local community",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Tradition",
                description:
                  "Honoring our rich history while looking to the future",
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Development",
                description:
                  "Nurturing young talent through our world-class academy",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-[#7f001b] mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Players Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Players</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet some of our star players who represent FC United on the pitch
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "James Rodriguez",
                position: "Forward",
                number: 10,
                image:
                  "https://images.unsplash.com/photo-1564164841584-391b5c7b590c?w=400&q=80",
              },
              {
                name: "David Thompson",
                position: "Midfielder",
                number: 8,
                image:
                  "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?w=400&q=80",
              },
              {
                name: "Carlos Silva",
                position: "Defender",
                number: 4,
                image:
                  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80",
              },
              {
                name: "Michael Johnson",
                position: "Goalkeeper",
                number: 1,
                image:
                  "https://images.unsplash.com/photo-1553108715-308e8537ce55?w=400&q=80",
              },
            ].map((player, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={player.image}
                    alt={player.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <div className="inline-block bg-[#7f001b] text-white font-bold text-xl px-3 py-1 mb-2">
                    {player.number}
                  </div>
                  <h3 className="text-xl font-bold">{player.name}</h3>
                  <p className="text-gray-600">{player.position}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/players"
              className="inline-flex items-center px-6 py-3 text-white bg-[#7f001b] rounded hover:bg-opacity-90 transition-colors"
            >
              View All Players
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <DonationCTA />

      <Footer />
    </div>
  );
}
