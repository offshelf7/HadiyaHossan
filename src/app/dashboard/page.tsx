import { createClient } from "../../../supabase/server";
import {
  InfoIcon,
  UserCircle,
  ShieldAlert,
  BarChart3,
  DollarSign,
  ShoppingBag,
  Newspaper,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
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
  const isSalesperson = userRole === "salesperson";

  // Fetch some basic stats
  const { data: totalProducts } = await supabase
    .from("products")
    .select("id", { count: "exact" });

  const { data: totalNews } = await supabase
    .from("news")
    .select("id", { count: "exact" });

  const { data: totalDonations } = await supabase
    .from("donations")
    .select("id", { count: "exact" });

  return (
    <main className="w-full">
      <div className="p-8 flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {isAdmin && <ShieldAlert className="text-[#640015]" />}
            {isReporter && <Newspaper className="text-[#640015]" />}
            {isSalesperson && <ShoppingBag className="text-[#640015]" />}
            <h1 className="text-3xl font-bold">
              {isAdmin && "Admin Dashboard"}
              {isReporter && "Reporter Dashboard"}
              {isSalesperson && "Sales Dashboard"}
              {!isAdmin && !isReporter && !isSalesperson && "User Dashboard"}
            </h1>
          </div>
          <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
            <InfoIcon size="14" />
            <span>
              Welcome to your dashboard,{" "}
              {userData?.full_name || userData?.name || user.email}
            </span>
          </div>
        </header>

        {/* User Profile Section */}
        <section className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <UserCircle size={48} className="text-primary" />
            <div>
              <h2 className="font-semibold text-xl">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Profile
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">
                {totalProducts?.length || 0}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Newspaper className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">News Articles</p>
              <h3 className="text-2xl font-bold">{totalNews?.length || 0}</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Donations</p>
              <h3 className="text-2xl font-bold">
                {totalDonations?.length || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Dashboard Content based on role */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin features */}
          {isAdmin &&
            [
              {
                title: "Manage Users",
                description: "View and manage user accounts",
                link: "/dashboard/users",
                icon: <Users className="h-8 w-8 text-[#640015] mb-2" />,
              },
              {
                title: "Manage News",
                description: "Create, edit, and delete news articles",
                link: "/dashboard/news",
                icon: <Newspaper className="h-8 w-8 text-[#640015] mb-2" />,
              },
              {
                title: "Manage Shop",
                description: "Manage products and inventory",
                link: "/shop/admin",
                icon: <ShoppingBag className="h-8 w-8 text-[#640015] mb-2" />,
              },
              {
                title: "Donation Reports",
                description: "View donation statistics and reports",
                link: "/dashboard/donations",
                icon: <BarChart3 className="h-8 w-8 text-[#640015] mb-2" />,
              },
              {
                title: "User Roles",
                description: "Assign roles to users",
                link: "/dashboard/roles",
                icon: <UserCircle className="h-8 w-8 text-[#640015] mb-2" />,
              },
              {
                title: "System Settings",
                description: "Configure website settings",
                link: "/dashboard/settings",
                icon: <Settings className="h-8 w-8 text-[#640015] mb-2" />,
              },
            ].map((item, index) => (
              <Link href={item.link} key={index}>
                <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow h-full">
                  {item.icon}
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </Link>
            ))}

          {/* Reporter features */}
          {isReporter &&
            [
              {
                title: "Manage News",
                description: "Create, edit, and delete news articles",
                link: "/dashboard/news",
                icon: <Newspaper className="h-8 w-8 text-[#640015] mb-2" />,
              },
              {
                title: "Upload Media",
                description: "Upload photos and videos for news articles",
                link: "/dashboard/media",
                icon: <Image className="h-8 w-8 text-[#640015] mb-2" />,
              },
              {
                title: "Draft Articles",
                description: "Manage your draft articles",
                link: "/dashboard/drafts",
                icon: <FileText className="h-8 w-8 text-[#640015] mb-2" />,
              },
            ].map((item, index) => (
              <Link href={item.link} key={index}>
                <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow h-full">
                  {item.icon}
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </Link>
            ))}

          {/* Salesperson features */}
          {isSalesperson &&
            [
              {
                title: "Manage Products",
                description: "Add, edit, and remove products",
                link: "/shop/admin",
                icon: <ShoppingBag className="h-8 w-8 text-[#640015] mb-2" />,
              },
              {
                title: "Orders",
                description: "View and manage customer orders",
                link: "/dashboard/orders",
                icon: <ShoppingCart className="h-8 w-8 text-[#640015] mb-2" />,
              },
              {
                title: "Sales Reports",
                description: "View sales statistics and reports",
                link: "/dashboard/sales",
                icon: <BarChart3 className="h-8 w-8 text-[#640015] mb-2" />,
              },
            ].map((item, index) => (
              <Link href={item.link} key={index}>
                <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow h-full">
                  {item.icon}
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </Link>
            ))}

          {/* Regular user - show nothing special */}
          {!isAdmin && !isReporter && !isSalesperson && (
            <div className="col-span-3 bg-white rounded-lg border p-6">
              <h3 className="font-bold text-lg mb-2">
                Welcome to your account
              </h3>
              <p className="text-gray-600 mb-4">
                You don't have any special roles assigned. Contact an
                administrator if you believe this is an error.
              </p>
              <Button className="bg-[#640015] hover:bg-[#111827]">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
