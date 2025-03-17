import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserCircle, Shield, Newspaper, ShoppingBag } from "lucide-react";

export default async function UsersManagementPage() {
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

  // If not admin, redirect to home page
  if (!isAdmin) {
    return redirect("/");
  }

  // Fetch all users
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  async function setUserRole(formData: FormData) {
    "use server";

    const userId = formData.get("userId") as string;
    const role = formData.get("role") as string;

    if (!userId || !role) return;

    const supabase = await createClient();

    // Update user role
    await supabase.from("users").update({ user_role: role }).eq("id", userId);

    return redirect("/dashboard/users");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar_url ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar_url}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserCircle className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || user.name || "Unnamed User"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.user_role === "admin" && (
                        <Shield className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      {user.user_role === "reporter" && (
                        <Newspaper className="h-4 w-4 text-blue-600 mr-1" />
                      )}
                      {user.user_role === "salesperson" && (
                        <ShoppingBag className="h-4 w-4 text-green-600 mr-1" />
                      )}
                      <span
                        className={`capitalize ${user.user_role === "admin" ? "text-red-600 font-medium" : ""}`}
                      >
                        {user.user_role || "user"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form
                      action={setUserRole}
                      className="flex justify-end space-x-2"
                    >
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.user_role || "user"}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="reporter">Reporter</option>
                        <option value="salesperson">Salesperson</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-[#640015] hover:bg-[#111827]"
                      >
                        Update
                      </Button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
