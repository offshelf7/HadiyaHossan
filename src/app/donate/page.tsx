import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DonationForm from "@/components/donation-form";
import TopDonors from "@/components/top-donors";
import { Heart, TrendingUp, Users, Trophy } from "lucide-react";
import { createClient } from "../../../supabase/server";

export default async function DonatePage() {
  const supabase = await createClient();

  // Get total donations from the database
  const { data: donationData, error } = await supabase
    .from("donations")
    .select("amount")
    .eq("payment_status", "succeeded");

  // Current donation progress data
  const donationGoal = 50000;
  const currentDonations = error
    ? 32750
    : donationData?.reduce(
        (sum, donation) => sum + parseFloat(donation.amount),
        0,
      ) || 32750;
  const percentComplete = (currentDonations / donationGoal) * 100;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-red-400" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Support Hadiya Hossana FC
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Your donations help us invest in facilities, youth development,
              and community programs. Join our supporters in making a
              difference.
            </p>
          </div>
        </section>

        {/* Donation Progress */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Fundraising Progress
            </h2>
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between mb-2">
                <span className="font-bold">
                  ${currentDonations.toLocaleString()}
                </span>
                <span className="text-gray-500">
                  Goal: ${donationGoal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-600">
                {percentComplete.toFixed(1)}% of our annual fundraising goal
              </p>
            </div>
          </div>
        </section>

        {/* Top Donors Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Top Donors</h2>
            <div className="max-w-4xl mx-auto">
              <TopDonors />
            </div>
          </div>
        </section>

        {/* Donation Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Make a Donation</h2>
                <p className="text-gray-600 mb-8">
                  Your support makes a real difference to our club. Every
                  donation, no matter the size, contributes to our success both
                  on and off the pitch.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Youth Development</h3>
                      <p className="text-gray-600">
                        Support our academy and help develop the next generation
                        of talent
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Team Success</h3>
                      <p className="text-gray-600">
                        Help us compete at the highest level and bring home
                        trophies
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Community Impact</h3>
                      <p className="text-gray-600">
                        Support our community programs and outreach initiatives
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <DonationForm />
              </div>
            </div>
          </div>
        </section>

        {/* Donor Recognition */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Our Generous Supporters</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                "Ethiopian Airlines",
                "Commercial Bank of Ethiopia",
                "Dashen Brewery",
                "Ethio Telecom",
                "Awash Bank",
                "BGI Ethiopia",
                "Heineken Ethiopia",
                "Abyssinia Bank",
              ].map((sponsor, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-16 flex items-center justify-center">
                    <span className="font-medium text-gray-800">{sponsor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
