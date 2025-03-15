import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DonationForm from "@/components/donation-form";
import { Heart, TrendingUp, Users, Trophy } from "lucide-react";

export default function DonatePage() {
  // Current donation progress data
  const donationGoal = 50000;
  const currentDonations = 32750;
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

        {/* Donation Form Section */}
        <section className="py-16 bg-gray-50">
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
        <section className="py-16 bg-white">
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
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm"
                >
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
