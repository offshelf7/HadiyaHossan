import { CalendarDays, MapPin } from "lucide-react";

type Match = {
  id: number;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  isCompleted: boolean;
};

export default function UpcomingMatches() {
  const matches: Match[] = [
    {
      id: 1,
      competition: "Ethiopian Premier League",
      homeTeam: "Hadiya Hossana FC",
      awayTeam: "St. George",
      date: "2023-10-15",
      time: "15:00",
      venue: "Hossana Stadium",
      isCompleted: false,
    },
    {
      id: 2,
      competition: "Ethiopian Cup",
      homeTeam: "Ethiopia Bunna",
      awayTeam: "Hadiya Hossana FC",
      date: "2023-10-21",
      time: "20:00",
      venue: "Addis Ababa Stadium",
      isCompleted: false,
    },
    {
      id: 3,
      competition: "Ethiopian Premier League",
      homeTeam: "Hadiya Hossana FC",
      awayTeam: "Fasil Kenema",
      homeScore: 2,
      awayScore: 1,
      date: "2023-10-08",
      time: "16:30",
      venue: "Hossana Stadium",
      isCompleted: true,
    },
    {
      id: 4,
      competition: "Ethiopian Cup",
      homeTeam: "Hawassa City",
      awayTeam: "Hadiya Hossana FC",
      homeScore: 0,
      awayScore: 3,
      date: "2023-10-01",
      time: "15:00",
      venue: "Hawassa Stadium",
      isCompleted: true,
    },
  ];

  const upcomingMatches = matches.filter((match) => !match.isCompleted);
  const recentResults = matches.filter((match) => match.isCompleted);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Fixtures & Results</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow our team's journey throughout the season
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Upcoming Fixtures */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
              Upcoming Fixtures
            </h3>
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-sm font-semibold text-red-700 mb-2">
                    {match.competition}
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-bold">{match.homeTeam}</div>
                    <div className="text-sm px-3 py-1 bg-gray-100 rounded">
                      VS
                    </div>
                    <div className="font-bold">{match.awayTeam}</div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {formatDate(match.date)} | {match.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {match.venue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Results */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
              Recent Results
            </h3>
            <div className="space-y-4">
              {recentResults.map((match) => (
                <div
                  key={match.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-sm font-semibold text-red-700 mb-2">
                    {match.competition}
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-bold">{match.homeTeam}</div>
                    <div className="flex space-x-1 items-center">
                      <div className="font-bold text-lg">{match.homeScore}</div>
                      <div className="text-gray-400">-</div>
                      <div className="font-bold text-lg">{match.awayScore}</div>
                    </div>
                    <div className="font-bold">{match.awayTeam}</div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {formatDate(match.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {match.venue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/fixtures"
            className="inline-flex items-center px-6 py-3 text-white bg-red-700 rounded hover:bg-red-800 transition-colors font-medium"
          >
            View All Fixtures
          </a>
        </div>
      </div>
    </section>
  );
}
