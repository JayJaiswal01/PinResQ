import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Bell, UserCircle, Menu } from "lucide-react";
import { BottomNavigation, NavigationTab } from "./bottom-navigation";
import { setupWebSocket } from "@/services/api";
import { VolunteerAlertModal } from "./VolunteerAlertModal";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeAlert, setActiveAlert] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
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

  let activeTab: NavigationTab = "home";
  if (location.pathname.startsWith("/map")) activeTab = "map";
  else if (location.pathname.startsWith("/profile")) activeTab = "profile";

  const handleTabChange = (tab: NavigationTab) => {
    switch (tab) {
      case "home":
        navigate("/dashboard");
        break;
      case "map":
        navigate("/map");
        break;
      case "rewards":
        navigate("/dashboard"); // No explicit rewards in PDF navigation list, routing to dashboard
        break;
      case "profile":
        navigate("/profile");
        break;
    }
  };

  const handleAcceptIncident = (incident: any) => {
    setActiveAlert(null);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${incident.latitude},${incident.longitude}`;
    window.open(url, "_blank");
  };

  const desktopNavLinks = [
    { label: "Home", path: "/dashboard" },
    { label: "Report", path: "/report" },
    { label: "Map", path: "/map" },
    { label: "Resources", path: "/resources" },
    { label: "About Us", path: "/about" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      {/* Desktop Top Navbar (Hidden on Mobile) */}
      <header className="hidden lg:flex w-full h-20 bg-white shadow-sm px-8 items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C0392B] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">P</span>
            </div>
            <span className="font-bold text-2xl text-[#2C3E50] tracking-tight">PINRESQ</span>
          </Link>
          
          <nav className="flex items-center gap-8">
            {desktopNavLinks.map(link => {
              const isActive = link.path === location.pathname;
              return (
                <button 
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className={`text-sm font-medium transition-colors hover:text-[#C0392B] ${
                    isActive
                      ? "text-[#C0392B] border-b-2 border-[#C0392B] pb-1"
                      : "text-[#2C3E50]"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-[#2C3E50] hover:text-[#C0392B] transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="flex items-center gap-2 text-[#2C3E50] hover:text-[#C0392B] transition-colors" onClick={() => navigate('/profile')}>
            <UserCircle className="w-8 h-8" />
          </button>
        </div>
      </header>

      {/* Mobile Top Header (Hidden on Desktop) */}
      <header className="lg:hidden w-full h-16 bg-white shadow-sm px-4 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <button className="text-[#2C3E50]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <Link to="/dashboard" className="font-bold text-xl text-[#2C3E50] tracking-tight absolute left-1/2 -translate-x-1/2">
          PINRESQ
        </Link>
        <button className="relative text-[#2C3E50]">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto pb-[90px] lg:pb-10 relative">
        <Outlet />
      </main>

      {/* Mobile Sticky Bottom Nav (Hidden on Desktop) */}
      <div className="lg:hidden">
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
