import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/curriculum", label: "Curriculum" },
    { path: "/templates", label: "Templates" },
    { path: "/tracker", label: "Tracker" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="gradient-bg w-10 h-10 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Dorm Desk Studio</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    "font-medium transition-colors hover:text-gray-900 cursor-pointer",
                    location === item.path
                      ? "text-primary font-medium"
                      : "text-gray-600"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
              Free Plan
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--creative))] to-[hsl(var(--primary))] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex space-x-4 overflow-x-auto">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <span
                className={cn(
                  "font-medium whitespace-nowrap transition-colors cursor-pointer",
                  location === item.path
                    ? "text-primary font-medium"
                    : "text-gray-600"
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
