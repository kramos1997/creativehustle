import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const WelcomeSection = () => {
  return (
    <div className="gradient-bg rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Sarah! 🎨</h2>
        <p className="text-white/90 mb-6">
          Ready to turn your creativity into a thriving business? Let's continue your journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/curriculum">
            <Button className="bg-white text-primary hover:bg-gray-50">
              Continue Learning
            </Button>
          </Link>
          <Link href="/subscribe">
            <Button variant="secondary" className="bg-white/20 backdrop-blur text-white hover:bg-white/30">
              Upgrade to Premium
            </Button>
          </Link>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
    </div>
  );
};

export default WelcomeSection;
