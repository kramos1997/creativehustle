import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Star, Crown } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = ({ selectedPlan }: { selectedPlan: "monthly" | "lifetime" }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const upgradeUserMutation = useMutation({
    mutationFn: (tier: string) => apiRequest("POST", "/api/upgrade", { tier }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Upgrade Successful!",
        description: "Welcome to Premium! All content is now unlocked.",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      // Mock payment for development when no Stripe keys are provided
      toast({
        title: "Payment Simulation",
        description: "This is a payment simulation for demonstration purposes.",
      });
      
      setTimeout(() => {
        const tier = selectedPlan === "monthly" ? "premium" : "lifetime";
        upgradeUserMutation.mutate(tier);
      }, 1000);
      
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      const tier = selectedPlan === "monthly" ? "premium" : "lifetime";
      upgradeUserMutation.mutate(tier);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {import.meta.env.VITE_STRIPE_PUBLIC_KEY && <PaymentElement />}
      
      {!import.meta.env.VITE_STRIPE_PUBLIC_KEY && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-orange-800">
            <Star className="w-5 h-5" />
            <span className="font-medium">Demo Mode</span>
          </div>
          <p className="text-orange-700 text-sm mt-1">
            This is a demonstration. No actual payment will be processed.
          </p>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={(!stripe || !elements) && import.meta.env.VITE_STRIPE_PUBLIC_KEY}
        className="w-full bg-primary hover:bg-primary/90 py-3 text-lg font-semibold"
      >
        {selectedPlan === "monthly" ? "Subscribe for $7/month" : "Get Lifetime Access - $77"}
      </Button>
    </form>
  );
};

const Subscribe = () => {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">("lifetime");
  const [loading, setLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  useEffect(() => {
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      // Skip payment intent creation in demo mode
      return;
    }

    if (selectedPlan === "monthly") {
      // Create subscription for monthly plan
      setLoading(true);
      apiRequest("POST", "/api/create-subscription")
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setLoading(false);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
        });
    } else {
      // Create payment intent for lifetime plan
      setLoading(true);
      apiRequest("POST", "/api/create-payment-intent", { amount: 77 })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setLoading(false);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
        });
    }
  }, [selectedPlan]);

  const features = [
    "All curriculum modules (12+ modules)",
    "Premium templates & resources",
    "Monthly group mentorship calls",
    "1-on-1 business coaching sessions",
    "Private community access",
    "Downloadable business tools",
    "Email support & feedback",
    "Future content updates included",
  ];

  const PaymentSection = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }

    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      return <SubscribeForm selectedPlan={selectedPlan} />;
    }

    if (!clientSecret) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }

    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <SubscribeForm selectedPlan={selectedPlan} />
      </Elements>
    );
  };

  if (user?.tier === "premium" || user?.tier === "lifetime") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
              <p className="text-gray-600 mb-6">
                You already have {user.tier} access to all features.
              </p>
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                {user.tier === "lifetime" ? "Lifetime Member" : "Premium Member"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="gradient-bg w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Creative Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to all premium content, templates, and mentorship to build your dream creative business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
            
            {/* Monthly Plan */}
            <Card 
              className={`cursor-pointer transition-all ${
                selectedPlan === "monthly" 
                  ? "border-primary border-2 bg-primary/5" 
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Monthly Plan</h3>
                    <p className="text-sm text-gray-600">Perfect for getting started</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">$7</div>
                    <div className="text-sm text-gray-500">/month</div>
                  </div>
                </div>
                {selectedPlan === "monthly" && (
                  <Badge className="bg-primary text-white">Selected</Badge>
                )}
              </CardContent>
            </Card>

            {/* Lifetime Plan */}
            <Card 
              className={`cursor-pointer transition-all relative ${
                selectedPlan === "lifetime" 
                  ? "border-primary border-2 bg-primary/5" 
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPlan("lifetime")}
            >
              <div className="absolute -top-3 left-4 bg-gradient-to-r from-[hsl(var(--warm))] to-[hsl(var(--creative))] text-white px-3 py-1 rounded-full text-xs font-medium">
                BEST VALUE
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Lifetime Access</h3>
                    <p className="text-sm text-gray-600">One-time payment, forever access</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">$77</div>
                    <div className="text-sm text-gray-500">one-time</div>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Save $27 compared to 12 months!
                </div>
                {selectedPlan === "lifetime" && (
                  <Badge className="bg-primary text-white mt-2">Selected</Badge>
                )}
              </CardContent>
            </Card>

            {/* Features List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Complete Your Purchase
                </h3>
                
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {selectedPlan === "monthly" ? "Monthly Subscription" : "Lifetime Access"}
                    </span>
                    <span className="font-bold text-gray-900">
                      {selectedPlan === "monthly" ? "$7/month" : "$77"}
                    </span>
                  </div>
                  {selectedPlan === "lifetime" && (
                    <div className="text-sm text-green-600 mt-1">
                      💡 Best value - Save money long term!
                    </div>
                  )}
                </div>

                <PaymentSection />

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Secure payment processing • Cancel anytime
                  </p>
                  {!import.meta.env.VITE_STRIPE_PUBLIC_KEY && (
                    <p className="text-xs text-orange-600 mt-2">
                      Demo mode - No actual payment will be processed
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Money Back Guarantee */}
            <Card className="mt-6 bg-green-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-green-800 mb-2">30-Day Money Back Guarantee</h4>
                <p className="text-sm text-green-700">
                  Try Dorm Desk Studio risk-free. If you're not completely satisfied, get a full refund within 30 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can cancel your monthly subscription anytime from your account settings. You'll retain access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What's the difference between plans?</h3>
              <p className="text-gray-600 text-sm">
                Both plans include the same features. Lifetime access is a one-time payment while monthly is recurring. Lifetime saves you money long-term.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer student discounts?</h3>
              <p className="text-gray-600 text-sm">
                Our pricing is already student-friendly! We believe in making creative education accessible to college students.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How does the mentorship work?</h3>
              <p className="text-gray-600 text-sm">
                Premium members get access to monthly group video calls and can book 1-on-1 sessions for personalized business guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
