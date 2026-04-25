import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Download, MapPin, Users, Navigation, Clock, ChevronRight, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toggleVolunteer, getAllReports, setupWebSocket } from "@/services/api";

export function HomeScreen() {
  const navigate = useNavigate();
  const [volunteerMode, setVolunteerMode] = useState(false);
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installHelpVisible, setInstallHelpVisible] = useState(false);

  useEffect(() => {
    const isVolunteer = localStorage.getItem('volunteerMode') === 'true';
    setVolunteerMode(isVolunteer);

    getAllReports().then(res => {
      setRecentIncidents(res.data.slice(0, 5));
    });

    const client = setupWebSocket(
      () => {},
      (data) => {
        if (!data.isAlert) {
          setRecentIncidents(prev => [data, ...prev].slice(0, 5));
        }
      }
    );

    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleToggleVolunteerMode = async (enabled: boolean) => {
    setVolunteerMode(enabled);
    localStorage.setItem('volunteerMode', String(enabled));
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        await toggleVolunteer(userId);
      } catch (e) {
        console.error("Failed to toggle volunteer mode via API", e);
      }
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      await (deferredPrompt as any).userChoice?.catch(() => undefined);
      setDeferredPrompt(null);
      return;
    }

    setInstallHelpVisible(true);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 via-white to-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl">PinResQ</h1>
            <p className="text-sm text-gray-600">Emergency Response System</p>
          </div>
          <Badge className={`${volunteerMode ? "bg-green-600" : "bg-gray-400"} text-white transition-colors`}>
            {volunteerMode ? "Active" : "Standby"}
          </Badge>
        </div>

        <div className="grid gap-4">
          <Card className="border-green-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2.5">
                  <Users className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Volunteer Mode</p>
                  <p className="text-xs text-gray-500">Receive nearby alerts</p>
                </div>
              </div>
              <Switch
                checked={volunteerMode}
                onCheckedChange={handleToggleVolunteerMode}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 pb-6 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:px-8">
        <div className="cursor-pointer" onClick={() => navigate('/map')}>
          <div className="group relative h-52 w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-100 to-green-100 shadow-md sm:h-60">
            <div className="absolute inset-0 opacity-30">
              <svg className="h-full w-full" viewBox="0 0 400 200">
                <path d="M 0 100 Q 100 50 200 100 T 400 100" stroke="#4B5563" strokeWidth="2" fill="none" />
                <path d="M 50 150 Q 150 120 250 140 T 400 150" stroke="#4B5563" strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-transform group-hover:scale-110">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
                <div className="relative rounded-full bg-blue-600 p-3 shadow-lg">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between rounded-lg bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm transition-colors group-hover:bg-blue-50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-800">Explore Nearby Incidents</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Button
            onClick={() => navigate('/report')}
            className="h-full min-h-24 w-full rounded-[28px] border-0 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl shadow-red-500/30 transition-all hover:scale-[1.01] hover:from-red-700 hover:to-red-800 active:scale-[0.99]"
            size="lg"
          >
            <div className="flex flex-col items-center gap-2 py-2">
              <AlertCircle className="h-9 w-9" />
              <span className="text-xl font-bold tracking-tight">REPORT ACCIDENT</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Live Incident Feed</h3>
          <Badge variant="outline" className="text-[10px] animate-pulse">LIVE UPDATES</Badge>
        </div>

        <div className="space-y-3">
          {recentIncidents.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-400">No active incidents nearby</p>
            </div>
          ) : (
            recentIncidents.map((incident) => (
              <Card
                key={incident.id}
                className="group cursor-pointer border-0 bg-white p-3 shadow-sm transition-colors hover:bg-red-50"
                onClick={() => navigate('/map')}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 transition-colors group-hover:bg-red-200">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <p className="truncate text-sm font-bold text-gray-900">Incident #{incident.id}</p>
                      <div className="flex items-center text-[10px] text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-600">
                      {incident.severity} • {incident.latitude.toFixed(3)}, {incident.longitude.toFixed(3)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
