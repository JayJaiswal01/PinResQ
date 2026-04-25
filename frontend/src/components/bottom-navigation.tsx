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
    <div className="sticky bottom-0 z-50 border-t border-slate-200/80 bg-white/95 shadow-[0_-12px_35px_rgba(15,23,42,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto w-full max-w-5xl px-2 py-2 sm:px-4">
        <div className="flex items-center justify-around gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all sm:px-4 ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`mb-1 h-5 w-5 transition-transform sm:h-6 sm:w-6 ${isActive ? "scale-110" : ""}`} strokeWidth={2} />
                <span className={`truncate text-[11px] sm:text-xs ${isActive ? "font-medium" : ""}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
