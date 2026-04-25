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
  else if (location.pathname.startsWith("/rewards")) activeTab = "rewards";
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
        navigate("/rewards");
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-stretch lg:gap-6 lg:px-6 lg:py-6">
        <aside className="hidden lg:flex lg:w-[320px] xl:w-[360px] flex-col justify-between rounded-[32px] bg-white/40 border border-white/60 backdrop-blur-xl px-8 py-10 text-slate-900 shadow-2xl shadow-slate-950/5">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">About PinResQ</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950">Saving Lives Through Community & Tech.</h1>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                PinResQ is a geo-verified emergency response platform that connects people in distress with nearby volunteers and professional emergency services.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Core Mission</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Reduce emergency response times</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Geo-verify every incident</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Empower local community volunteers</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-100 bg-blue-50/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">How it works</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              When you report an accident, we instantly alert nearby volunteers and broadcast the location to emergency dispatchers via WebSockets.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 lg:min-h-0">
          <div className="relative flex min-h-screen w-full flex-col bg-white lg:min-h-[calc(100vh-3rem)] lg:overflow-hidden lg:rounded-[32px] lg:border lg:border-slate-200/70 lg:shadow-2xl lg:shadow-slate-900/10">
            <div className="flex-1 overflow-y-auto pb-[88px] lg:pb-0">
              <Outlet />
            </div>
            <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
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
