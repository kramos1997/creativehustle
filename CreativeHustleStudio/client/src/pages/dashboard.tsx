import Navigation from "@/components/Navigation";
import WelcomeSection from "@/components/WelcomeSection";
import StatsCards from "@/components/StatsCards";
import CurriculumSection from "@/components/CurriculumSection";
import TemplateLibrary from "@/components/TemplateLibrary";
import BizChallenge from "@/components/BizChallenge";
import QuickLog from "@/components/QuickLog";
import FaithEncouragement from "@/components/FaithEncouragement";
import UpgradePrompt from "@/components/UpgradePrompt";
import RecentActivity from "@/components/RecentActivity";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection />
        <StatsCards />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Learning */}
          <div className="lg:col-span-2 space-y-8">
            <CurriculumSection />
            <TemplateLibrary />
            <BizChallenge />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <QuickLog />
            <FaithEncouragement />
            <UpgradePrompt />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
