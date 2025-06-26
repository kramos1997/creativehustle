import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const FaithEncouragement = () => {
  const handleReadDevotional = () => {
    // Mock devotional reading - in production this would navigate to devotional content
    console.log("Opening devotional content...");
  };

  return (
    <div className="bg-gradient-to-br from-[hsl(var(--faith))] to-[hsl(var(--primary))] rounded-xl p-6 text-white">
      <div className="flex items-center space-x-2 mb-3">
        <Heart className="w-5 h-5" />
        <h3 className="font-bold">Daily Inspiration</h3>
      </div>
      <p className="text-white/90 text-sm mb-4">
        "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." - Ephesians 2:10
      </p>
      <p className="text-white/80 text-xs mb-4">
        Your creativity is a gift meant to bless others. Use it with purpose and watch how God multiplies your efforts.
      </p>
      <Button
        onClick={handleReadDevotional}
        variant="ghost"
        className="text-white/90 hover:text-white text-sm font-medium underline p-0 h-auto"
      >
        Read Today's Devotional
      </Button>
    </div>
  );
};

export default FaithEncouragement;
