import React from "react";
import { appPlans } from "../assets/assets";
import Footer from "../components/Footer";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import api from "@/configs/axios";
import { Loader2Icon } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}

const Pricing = () => {
  const [plans] = React.useState<Plan[]>(appPlans);
  const { data: session } = authClient.useSession();

  const handlePurchase = async (planId: string) => {
    try {
      if (!session?.user) return toast("Please Log In To Purchase Credits.");
      const { data } = await api.post("/api/user/purchase-credits", { planId });
      window.location.href = data.payment_link;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="min-h-screen w-full font-poppins text-white"
        style={{
          background: "linear-gradient(180deg, #004d1a 0%, #0073b3 100%)",
        }}
      >
        <div className="text-center w-full max-w-5xl mx-auto px-4 py-4">
          <h2 className="text-gray-100 text-3xl font-medium">
            Choose Your Plan
          </h2>
          <p className="text-gray-300 text-sm max-w-md mx-auto mt-2">
            Start for free and scale up as you grow. Find the perfect plan for
            your content creations needs.
          </p>
        </div>

        <div className="pt-14 py-4 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 flex-wrap gap-4">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#006633]/80 border border-[#004d1a] mx-auto w-full max-w-sm rounded-lg text-white shadow-md hover:shadow-green-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="my-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-200">
                    {" "}
                    / {plan.credits} credits
                  </span>
                </div>

                <p className="text-gray-200 mb-6">{plan.description}</p>

                <ul className="space-y-1.5 mb-6 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-300 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  className="w-full py-2 px-4 border-2 border-[#004d1a] 
bg-gradient-to-r from-[#004d1a] via-[#00FFAB] to-[#0073b3] 
hover:brightness-110 active:scale-95 
text-md font-bold text-white 
rounded-md transition-all
"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto text-center text-sm max-w-md mt-10 font-semibold text-white/60 font-light">
          Project <span className="text-white">Creation/Revision</span> consumes{" "}
          <span className="text-white">5 Credits</span>. You can purchase more
          credits to create more projects.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
