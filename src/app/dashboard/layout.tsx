import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import SidebarNavigation from "@/components/sidebar-navigation";
import { SubscriptionCheck } from "@/components/subscription-check";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
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

  return (
    <SubscriptionCheck>
      <div className="flex min-h-screen bg-gray-100">
        <SidebarNavigation userRole={userRole} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SubscriptionCheck>
  );
}
