import Image from "next/image";
import Link from "next/link";
import { CalendarDays, User } from "lucide-react";

type NewsArticle = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
};

export default function NewsFeed() {
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest News</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest happenings at FC United
          </p>
        </div>

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

        <div className="text-center mt-10">
          <Link
            href="/news"
            className="inline-flex items-center px-6 py-3 text-white bg-[#7f001b] rounded hover:bg-opacity-90 transition-colors font-medium"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
}
