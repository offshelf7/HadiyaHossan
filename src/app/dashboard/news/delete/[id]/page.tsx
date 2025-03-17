import { createClient } from "../../../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DeleteNewsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user data including role
  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const userRole = userData?.user_role || "user";
  const isAdmin = userRole === "admin";
  const isReporter = userRole === "reporter";

  // If not admin or reporter, redirect to home page
  if (!isAdmin && !isReporter) {
    return redirect("/");
  }

  // Fetch article data
  const { data: article } = await supabase
    .from("news")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!article) {
    return redirect("/dashboard/news");
  }

  // Check if user is the author or admin
  if (article.author_id !== user.id && !isAdmin) {
    return redirect("/dashboard/news");
  }

  async function deleteArticle() {
    "use server";

    const supabase = await createClient();

    // Delete the article
    await supabase.from("news").delete().eq("id", params.id);

    return redirect("/dashboard/news");
  }

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Delete Article</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
          <p className="text-gray-600">{article.summary}</p>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          <p className="font-medium">Warning: This action cannot be undone</p>
          <p className="text-sm mt-1">
            Are you sure you want to permanently delete this article?
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/dashboard/news">
            <Button variant="outline">Cancel</Button>
          </Link>

          <form action={deleteArticle}>
            <Button type="submit" variant="destructive">
              Delete Article
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
