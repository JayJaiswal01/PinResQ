import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, NavigationTab } from "./bottom-navigation";
import { setupWebSocket } from "@/services/api";
import { VolunteerAlertModal } from "./VolunteerAlertModal";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeAlert, setActiveAlert] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const client = setupWebSocket(
      () => console.log("Connected to PinResQ Live"),
      (data) => {
        if (data.isAlert) {
          setActiveAlert(data);
        }
      },
      userId || undefined
    );

    return () => {
      client.deactivate();
    };
  }, []);

  // Derive active tab from pathname
  let activeTab: NavigationTab = "home";
  if (location.pathname.startsWith("/map")) activeTab = "map";
  else if (location.pathname.startsWith("/rewards")) activeTab = "rewards";
  else if (location.pathname.startsWith("/profile")) activeTab = "profile";

  const handleTabChange = (tab: NavigationTab) => {
    switch (tab) {
      case "home": navigate("/dashboard"); break;
      case "map": navigate("/map"); break;
      case "rewards": navigate("/rewards"); break;
      case "profile": navigate("/profile"); break;
    }
  };

  const handleAcceptIncident = (incident: any) => {
    setActiveAlert(null);
    // Redirect to Google Maps natively as requested
    const url = `https://www.google.com/maps/dir/?api=1&destination=${incident.latitude},${incident.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pb-[72px]">
          <Outlet />
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      <VolunteerAlertModal 
        incident={activeAlert} 
        isOpen={!!activeAlert} 
        onClose={() => setActiveAlert(null)}
        onAccept={handleAcceptIncident}
      />
    </div>
  );
}
