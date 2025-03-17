"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trophy, Award } from "lucide-react";

type Donor = {
  donor_name: string;
  total_amount: number;
  last_donation_date: string;
};

export default function TopDonors() {
  const [weeklyTopDonor, setWeeklyTopDonor] = useState<Donor | null>(null);
  const [allTimeTopDonor, setAllTimeTopDonor] = useState<Donor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTopDonors() {
      try {
        // Fetch weekly top donor
        const { data: weeklyData, error: weeklyError } = await supabase
          .from("weekly_top_donors")
          .select("*")
          .order("total_amount", { ascending: false })
          .limit(1)
          .single();

        if (weeklyError && weeklyError.code !== "PGRST116") {
          console.error("Error fetching weekly top donor:", weeklyError);
        } else if (weeklyData) {
          setWeeklyTopDonor(weeklyData);
        }

        // Fetch all-time top donor
        const { data: allTimeData, error: allTimeError } = await supabase
          .from("top_donors")
          .select("*")
          .order("total_amount", { ascending: false })
          .limit(1)
          .single();

        if (allTimeError && allTimeError.code !== "PGRST116") {
          console.error("Error fetching all-time top donor:", allTimeError);
        } else if (allTimeData) {
          setAllTimeTopDonor(allTimeData);
        }
      } catch (error) {
        console.error("Error fetching top donors:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopDonors();

    // Set up realtime subscription for donations table
    const subscription = supabase
      .channel("donations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donations" },
        () => {
          fetchTopDonors();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div className="bg-gray-200 h-40 rounded-lg"></div>
        <div className="bg-gray-200 h-40 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-t-4 border-t-yellow-400">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>This Week's Top Donor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyTopDonor ? (
            <div className="text-center py-2">
              <p className="text-xl font-bold mb-1">
                {weeklyTopDonor.donor_name}
              </p>
              <p className="text-3xl font-bold text-green-600 mb-1">
                ${weeklyTopDonor.total_amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Last donation:{" "}
                {new Date(
                  weeklyTopDonor.last_donation_date,
                ).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No donations this week</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" />
            <span>All-Time Top Donor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allTimeTopDonor ? (
            <div className="text-center py-2">
              <p className="text-xl font-bold mb-1">
                {allTimeTopDonor.donor_name}
              </p>
              <p className="text-3xl font-bold text-green-600 mb-1">
                ${allTimeTopDonor.total_amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Last donation:{" "}
                {new Date(
                  allTimeTopDonor.last_donation_date,
                ).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No donations yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
