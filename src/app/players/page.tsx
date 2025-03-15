import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";

type Player = {
  id: number;
  name: string;
  position: string;
  number: number;
  nationality: string;
  age: number;
  image: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets?: number;
  };
};

export default function PlayersPage() {
  const players: Player[] = [
    {
      id: 1,
      name: "Temesgen Derese",
      position: "Forward",
      number: 10,
      nationality: "Ethiopia",
      age: 26,
      image:
        "https://images.unsplash.com/photo-1564164841584-391b5c7b590c?w=400&q=80",
      stats: {
        appearances: 87,
        goals: 42,
        assists: 18,
      },
    },
    {
      id: 2,
      name: "Abebe Kebede",
      position: "Midfielder",
      number: 8,
      nationality: "Ethiopia",
      age: 24,
      image:
        "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?w=400&q=80",
      stats: {
        appearances: 92,
        goals: 15,
        assists: 32,
      },
    },
    {
      id: 3,
      name: "Dawit Tefera",
      position: "Defender",
      number: 4,
      nationality: "Ethiopia",
      age: 28,
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80",
      stats: {
        appearances: 105,
        goals: 3,
        assists: 5,
      },
    },
    {
      id: 4,
      name: "Solomon Gebre",
      position: "Goalkeeper",
      number: 1,
      nationality: "Ethiopia",
      age: 29,
      image:
        "https://images.unsplash.com/photo-1553108715-308e8537ce55?w=400&q=80",
      stats: {
        appearances: 78,
        goals: 0,
        assists: 0,
        cleanSheets: 34,
      },
    },
    {
      id: 5,
      name: "Yonas Tadesse",
      position: "Forward",
      number: 9,
      nationality: "Ethiopia",
      age: 23,
      image:
        "https://images.unsplash.com/photo-1570498839593-e565b39455fc?w=400&q=80",
      stats: {
        appearances: 65,
        goals: 28,
        assists: 12,
      },
    },
    {
      id: 6,
      name: "Henok Alemu",
      position: "Midfielder",
      number: 6,
      nationality: "Ethiopia",
      age: 25,
      image:
        "https://images.unsplash.com/photo-1580196969807-cc6de06c05be?w=400&q=80",
      stats: {
        appearances: 72,
        goals: 8,
        assists: 21,
      },
    },
    {
      id: 7,
      name: "Bereket Haile",
      position: "Defender",
      number: 2,
      nationality: "Ethiopia",
      age: 27,
      image:
        "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80",
      stats: {
        appearances: 95,
        goals: 1,
        assists: 7,
      },
    },
    {
      id: 8,
      name: "Kidus Bekele",
      position: "Defender",
      number: 5,
      nationality: "Ethiopia",
      age: 26,
      image:
        "https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&q=80",
      stats: {
        appearances: 82,
        goals: 2,
        assists: 3,
      },
    },
  ];

  const positions = ["All", "Forward", "Midfielder", "Defender", "Goalkeeper"];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Players</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Meet the talented squad representing Hadiya Hossana FC
            </p>
          </div>
        </section>

        {/* Players Filter */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {positions.map((position, index) => (
                <button
                  key={index}
                  className={`px-6 py-2 rounded-full ${index === 0 ? "bg-[#7f001b] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Players Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {players.map((player) => (
                <Link href={`/players/${player.id}`} key={player.id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={player.image}
                        alt={player.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-0 right-0 bg-[#7f001b] text-white font-bold text-xl px-3 py-1">
                        {player.number}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold">{player.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">{player.position}</span>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {player.nationality}
                        </span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-bold">
                            {player.stats.appearances}
                          </div>
                          <div className="text-xs text-gray-500">Matches</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">
                            {player.stats.goals}
                          </div>
                          <div className="text-xs text-gray-500">Goals</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">
                            {player.position === "Goalkeeper"
                              ? player.stats.cleanSheets
                              : player.stats.assists}
                          </div>
                          <div className="text-xs text-gray-500">
                            {player.position === "Goalkeeper"
                              ? "Clean Sheets"
                              : "Assists"}
                          </div>
                        </div>
                      </div>
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
