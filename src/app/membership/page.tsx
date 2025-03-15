import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MembershipForm from "@/components/membership-form";
import { Check, Star, Shield, Ticket } from "lucide-react";

export default function MembershipPage() {
  const benefits = [
    {
      icon: <Ticket className="h-6 w-6 text-green-600" />,
      title: "Priority Tickets",
      description:
        "Get priority access to match tickets before they go on general sale",
    },
    {
      icon: <Star className="h-6 w-6 text-green-600" />,
      title: "Exclusive Content",
      description:
        "Access to exclusive interviews, behind-the-scenes videos, and club news",
    },
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Merchandise Discounts",
      description: "Enjoy 15% discount on all official club merchandise",
    },
    {
      icon: <Check className="h-6 w-6 text-green-600" />,
      title: "Member Events",
      description:
        "Invitations to member-only events and meet-and-greets with players",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Membership Program
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Become an official member of Hadiya Hossana FC and enjoy exclusive
              benefits while supporting your favorite team.
            </p>
          </div>
        </section>

        {/* Membership Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Membership Benefits
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600"
                >
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Membership Options
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-700 text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">Annual Membership</h3>
                  <div className="text-4xl font-bold mb-2">$500</div>
                  <p className="text-green-100">per year</p>
                </div>

                <div className="p-6">
                  <ul className="space-y-4">
                    {[
                      "Priority access to match tickets",
                      "15% discount on merchandise",
                      "Exclusive content and updates",
                      "Official membership card and welcome pack",
                      "Invitations to member-only events",
                      "Voting rights on club matters",
                      "Monthly digital newsletter",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Form */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Apply for Membership
                </h2>
                <p className="text-gray-600 mb-8">
                  Complete the form to apply for your Hadiya Hossana FC
                  membership. Once your application is processed, you'll receive
                  your membership package within 2 weeks.
                </p>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                  <h3 className="font-bold text-lg mb-4">Membership FAQ</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold">
                        How long is the membership valid?
                      </h4>
                      <p className="text-gray-600">
                        Your membership is valid for one year from the date of
                        purchase.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold">Can I cancel my membership?</h4>
                      <p className="text-gray-600">
                        Memberships are non-refundable but can be transferred to
                        another person with approval.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold">
                        How do I use my membership benefits?
                      </h4>
                      <p className="text-gray-600">
                        You'll receive a membership card and account details to
                        access all your benefits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <MembershipForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
