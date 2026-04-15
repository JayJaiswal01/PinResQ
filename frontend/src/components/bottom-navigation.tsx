import { Home, Map, Award, User } from "lucide-react";

export type NavigationTab = "home" | "map" | "rewards" | "profile";

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home" as NavigationTab, label: "Home", icon: Home },
    { id: "map" as NavigationTab, label: "Map", icon: Map },
    { id: "rewards" as NavigationTab, label: "Rewards", icon: Award },
    { id: "profile" as NavigationTab, label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? "scale-110" : ""} transition-transform`} strokeWidth={2} />
                <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}