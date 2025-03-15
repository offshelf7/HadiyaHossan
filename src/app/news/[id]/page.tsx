import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  User,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";

type NewsParams = {
  params: {
    id: string;
  };
};

export default function NewsDetailPage({ params }: NewsParams) {
  const articleId = parseInt(params.id);

  // This would normally come from a database
  const article = {
    id: articleId,
    title:
      articleId === 1
        ? "Team Secures Dramatic Victory in Last-Minute Thriller"
        : "Article Title",
    content: `<p>In a thrilling encounter at Hossana Stadium, Hadiya Hossana FC secured a dramatic 2-1 victory against St. George with a stoppage-time winner from captain Temesgen Derese.</p>

<p>The match began with St. George taking an early lead in the 15th minute through a well-worked goal finished by their striker. Hadiya Hossana FC dominated possession but struggled to break down a well-organized defense throughout the first half.</p>

<p>Head coach made tactical adjustments at half-time, bringing on an additional attacking midfielder which changed the dynamics of the game. The equalizer came in the 68th minute when Abebe Kebede finished a brilliant team move with a powerful shot from the edge of the box.</p>

<p>As the match seemed headed for a draw, captain Temesgen Derese rose highest to head home a corner kick in the 92nd minute, sending the home crowd into raptures. The victory moves Hadiya Hossana FC to second place in the Ethiopian Premier League table, just three points behind the leaders.</p>

<p>"We showed great character today," said Derese after the match. "Going behind early made it difficult, but we never stopped believing and fighting until the final whistle. This victory is for our amazing fans who supported us throughout."</p>

<p>The team will now prepare for their next fixture, an away match against Fasil Kenema on Saturday.</p>`,
    image:
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&q=80",
    date: "2023-10-08",
    author: "John Smith",
    category: "Match Report",
    tags: [
      "Match Report",
      "Victory",
      "Ethiopian Premier League",
      "Temesgen Derese",
    ],
  };

  const relatedArticles = [
    {
      id: 2,
      title: "New Signing Makes Impressive Debut",
      excerpt:
        "Brazilian midfielder Carlos Silva impressed fans and critics alike with his man-of-the-match performance.",
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
      date: "2023-10-05",
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
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Article Header */}
        <div className="relative h-96 w-full">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <div className="max-w-4xl">
                <div className="mb-4">
                  <span className="bg-[#7f001b] text-white px-3 py-1 text-sm font-bold">
                    {article.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {article.title}
                </h1>
                <div className="flex items-center text-white space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {formatDate(article.date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/3">
                <Link
                  href="/news"
                  className="inline-flex items-center text-gray-600 hover:text-green-700 mb-8"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to News
                </Link>

                <article className="bg-white p-8 rounded-lg shadow-sm">
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  ></div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Share this article:</span>
                      <div className="flex space-x-4">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-500 hover:text-blue-400"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                  <div className="space-y-6">
                    {relatedArticles.map((relatedArticle) => (
                      <div key={relatedArticle.id} className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <Image
                            src={relatedArticle.image}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-[#7f001b]">
                            {relatedArticle.category}
                          </span>
                          <h4 className="font-medium hover:text-[#7f001b]">
                            <Link href={`/news/${relatedArticle.id}`}>
                              {relatedArticle.title}
                            </Link>
                          </h4>
                          <div className="text-xs text-gray-500">
                            {formatDate(relatedArticle.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#7f001b] text-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-4">
                    Subscribe to Updates
                  </h3>
                  <p className="mb-4">
                    Get the latest news and updates delivered directly to your
                    inbox.
                  </p>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full p-2 mb-2 text-gray-800 rounded"
                  />
                  <button className="w-full bg-white text-[#7f001b] font-bold py-2 rounded hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
