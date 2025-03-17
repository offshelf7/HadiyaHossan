import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import NewsForm from "@/components/news-form";

export default async function CreateNewsPage() {
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create News Article</h1>
      <NewsForm userId={user.id} />
    </div>
  );
}
