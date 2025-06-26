import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

const UpgradePrompt = () => {
  const features = [
    "All curriculum modules",
    "Premium templates",
    "Monthly group calls",
    "1-on-1 mentorship",
  ];

  return (
    <div className="bg-gradient-to-br from-[hsl(var(--warm))] to-[hsl(var(--creative))] rounded-xl p-6 text-white">
      <h3 className="font-bold mb-2">Unlock Your Full Potential</h3>
      <p className="text-white/90 text-sm mb-4">
        Get access to advanced modules, premium templates, and 1-on-1 mentorship.
      </p>
      <div className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Link href="/subscribe">
          <Button className="w-full bg-white text-[hsl(var(--warm))] hover:bg-gray-50 font-semibold">
            Upgrade for $7/month
          </Button>
        </Link>
        <Link href="/subscribe">
          <Button
            variant="secondary"
            className="w-full bg-white/20 backdrop-blur text-white hover:bg-white/30 font-semibold"
          >
            Lifetime Access - $77
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UpgradePrompt;
