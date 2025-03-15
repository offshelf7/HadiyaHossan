import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, User, Search, Filter } from "lucide-react";

type NewsArticle = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
};

export default function NewsPage() {
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: "Team Secures Dramatic Victory in Last-Minute Thriller",
      excerpt:
        "Hadiya Hossana FC came from behind to win 2-1 against St. George with a stoppage-time goal from captain Temesgen Derese.",
      image:
        "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
      date: "2023-10-08",
      author: "John Smith",
      category: "Match Report",
    },
    {
      id: 2,
      title: "New Signing Makes Impressive Debut",
      excerpt:
        "Brazilian midfielder Carlos Silva impressed fans and critics alike with his man-of-the-match performance.",
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
      date: "2023-10-05",
      author: "Sarah Johnson",
      category: "Player News",
    },
    {
      id: 3,
      title: "Youth Academy Graduate Signs Professional Contract",
      excerpt:
        "Talented 18-year-old defender Michael Thompson has signed his first professional contract with the club.",
      image:
        "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
      date: "2023-10-03",
      author: "David Williams",
      category: "Club News",
    },
    {
      id: 4,
      title: "Club Announces New Partnership with Local Business",
      excerpt:
        "Hadiya Hossana FC has announced a new sponsorship deal with a leading local company that will boost the club's finances.",
      image:
        "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&q=80",
      date: "2023-09-28",
      author: "Emma Brown",
      category: "Club News",
    },
    {
      id: 5,
      title: "Manager Discusses Upcoming Fixture Against Rivals",
      excerpt:
        "Head coach shares his thoughts on preparation and strategy ahead of the crucial derby match this weekend.",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
      date: "2023-09-25",
      author: "Michael Johnson",
      category: "Interview",
    },
    {
      id: 6,
      title: "Injury Update: Star Midfielder to Miss Next Three Matches",
      excerpt:
        "The club's medical team has confirmed that our key midfielder will be sidelined for several weeks due to a hamstring injury.",
      image:
        "https://images.unsplash.com/photo-1511426463457-0571e247d816?w=800&q=80",
      date: "2023-09-22",
      author: "Robert Davis",
      category: "Injury News",
    },
  ];

  const categories = [
    "All",
    "Match Report",
    "Player News",
    "Club News",
    "Interview",
    "Injury News",
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest News</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Stay updated with the latest happenings at Hadiya Hossana FC
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-1/3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                  placeholder="Search news..."
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm ${index === 0 ? "bg-[#7f001b] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* News Articles */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#7f001b] text-white text-xs font-bold px-2 py-1">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 hover:text-[#7f001b] transition-colors">
                      <Link href={`/news/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        {formatDate(article.date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="py-2 px-4 bg-[#7f001b] border border-[#7f001b] text-sm font-medium text-white"
                >
                  1
                </a>
                <a
                  href="#"
                  className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  2
                </a>
                <a
                  href="#"
                  className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  3
                </a>
                <a
                  href="#"
                  className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 hover:bg-gray-50"
                >
                  Next
                </a>
              </nav>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
