import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Flag, Calendar, Ruler, Award, Shirt } from "lucide-react";

type PlayerParams = {
  params: {
    id: string;
  };
};

export default function PlayerDetailPage({ params }: PlayerParams) {
  const playerId = parseInt(params.id);

  // This would normally come from a database
  const player = {
    id: playerId,
    name: playerId === 1 ? "Temesgen Derese" : "Player Name",
    position: "Forward",
    number: 10,
    nationality: "Ethiopia",
    birthdate: "1997-05-12",
    height: "1.82m",
    weight: "76kg",
    image:
      "https://images.unsplash.com/photo-1564164841584-391b5c7b590c?w=800&q=80",
    bio: "Temesgen Derese is the captain and star forward of Hadiya Hossana FC. Known for his clinical finishing and leadership on the pitch, he has been with the club since 2018. Derese has represented the Ethiopian national team on multiple occasions and is considered one of the top talents in Ethiopian football.",
    stats: {
      appearances: 87,
      goals: 42,
      assists: 18,
      yellowCards: 8,
      redCards: 1,
    },
    seasonStats: [
      { season: "2022/23", appearances: 32, goals: 18, assists: 7 },
      { season: "2021/22", appearances: 30, goals: 15, assists: 6 },
      { season: "2020/21", appearances: 25, goals: 9, assists: 5 },
    ],
    achievements: [
      "Ethiopian Premier League Top Scorer (2021/22)",
      "Hadiya Hossana FC Player of the Year (2022)",
      "Ethiopian Cup Winner (2021)",
      "Ethiopian Super Cup Winner (2021)",
    ],
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Player Hero Section */}
        <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-12">
          <div className="container mx-auto px-4">
            <Link
              href="/players"
              className="inline-flex items-center text-white hover:text-green-200 mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Players
            </Link>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="relative h-80 w-full md:h-96">
                <Image
                  src={player.image}
                  alt={player.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center mb-2">
                  <div className="bg-white text-green-800 font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-full mr-4">
                    {player.number}
                  </div>
                  <div className="bg-[#7f001b] px-3 py-1 text-sm rounded">
                    {player.position}
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {player.name}
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center">
                    <Flag className="h-5 w-5 mr-2" />
                    <span>{player.nationality}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Age: {calculateAge(player.birthdate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Ruler className="h-5 w-5 mr-2" />
                    <span>Height: {player.height}</span>
                  </div>
                  <div className="flex items-center">
                    <Shirt className="h-5 w-5 mr-2" />
                    <span>Weight: {player.weight}</span>
                  </div>
                </div>

                <p className="text-green-100">{player.bio}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Player Stats */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Player Statistics</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-[#7f001b] mb-2">
                  {player.stats.appearances}
                </div>
                <div className="text-gray-600">Appearances</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-[#7f001b] mb-2">
                  {player.stats.goals}
                </div>
                <div className="text-gray-600">Goals</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-[#7f001b] mb-2">
                  {player.stats.assists}
                </div>
                <div className="text-gray-600">Assists</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">
                  {player.stats.yellowCards}
                </div>
                <div className="text-gray-600">Yellow Cards</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {player.stats.redCards}
                </div>
                <div className="text-gray-600">Red Cards</div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Season by Season</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left font-semibold">
                      Season
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Appearances
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">Goals</th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Assists
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {player.seasonStats.map((season, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-3 px-4">{season.season}</td>
                      <td className="py-3 px-4">{season.appearances}</td>
                      <td className="py-3 px-4">{season.goals}</td>
                      <td className="py-3 px-4">{season.assists}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Achievements</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {player.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="bg-[#7f001b] bg-opacity-10 p-2 rounded-full mr-4">
                    <Award className="h-6 w-6 text-[#7f001b]" />
                  </div>
                  <div>
                    <p className="font-medium">{achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Players */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">More Players</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[2, 3, 4, 5].map((id) => (
                <Link href={`/players/${id}`} key={id}>
                  <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="relative h-48 w-full">
                      <Image
                        src={`https://images.unsplash.com/photo-${id === 2 ? "1539701938214-0d9736e1c16b" : id === 3 ? "1574629810360-7efbbe195018" : id === 4 ? "1553108715-308e8537ce55" : "1570498839593-e565b39455fc"}?w=400&q=80`}
                        alt="Player"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">
                        {id === 2
                          ? "Abebe Kebede"
                          : id === 3
                            ? "Dawit Tefera"
                            : id === 4
                              ? "Solomon Gebre"
                              : "Yonas Tadesse"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {id === 2
                          ? "Midfielder"
                          : id === 3
                            ? "Defender"
                            : id === 4
                              ? "Goalkeeper"
                              : "Forward"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
