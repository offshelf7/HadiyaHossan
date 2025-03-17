import { createClient } from "../../../../../../supabase/server";
import { redirect } from "next/navigation";
import NewsForm from "@/components/news-form";

export default async function EditNewsPage({
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit News Article</h1>
      <NewsForm article={article} userId={user.id} />
    </div>
  );
}
