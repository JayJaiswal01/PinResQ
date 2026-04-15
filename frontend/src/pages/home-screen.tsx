import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Phone, MapPin, Users, Navigation, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toggleVolunteer, getAllReports, setupWebSocket } from "@/services/api";

export function HomeScreen() {
  const navigate = useNavigate();
  const [volunteerMode, setVolunteerMode] = useState(false);
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);

  useEffect(() => {
    const isVolunteer = localStorage.getItem('volunteerMode') === 'true';
    setVolunteerMode(isVolunteer);

    // Initial fetch of incidents
    getAllReports().then(res => {
      setRecentIncidents(res.data.slice(0, 5));
    });

    // WebSocket for live feed
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">PinResQ</h1>
            <p className="text-sm text-gray-600">Emergency Response System</p>
          </div>
          <Badge className={`${volunteerMode ? "bg-green-600" : "bg-gray-400"} text-white transition-colors`}>
            {volunteerMode ? "Active" : "Standby"}
          </Badge>
        </div>

        {/* Volunteer mode toggle */}
        <Card className="p-4 mb-6 bg-white/80 backdrop-blur-sm border-green-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2.5 rounded-full">
                <Users className="w-5 h-5 text-green-700" />
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

      {/* Map preview */}
      <div className="px-6 mb-6 cursor-pointer" onClick={() => navigate('/map')}>
        <div className="relative w-full h-44 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden shadow-md group">
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path d="M 0 100 Q 100 50 200 100 T 400 100" stroke="#4B5563" strokeWidth="2" fill="none" />
              <path d="M 50 150 Q 150 120 250 140 T 400 150" stroke="#4B5563" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-110">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
              <div className="relative bg-blue-600 p-3 rounded-full shadow-lg">
                <Navigation className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md flex items-center justify-between group-hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-800">Explore Nearby Incidents</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency button */}
      <div className="px-6 mb-8">
        <Button
          onClick={() => navigate('/report')}
          className="w-full h-24 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl shadow-xl shadow-red-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] border-0"
          size="lg"
        >
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="w-9 h-9" />
            <span className="text-xl font-bold tracking-tight">REPORT ACCIDENT</span>
          </div>
        </Button>
      </div>

      {/* Live Feed Section */}
      <div className="px-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Live Incident Feed</h3>
          <Badge variant="outline" className="text-[10px] animate-pulse">LIVE UPDATES</Badge>
        </div>
        
        <div className="space-y-3">
          {recentIncidents.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-400">No active incidents nearby</p>
            </div>
          ) : (
            recentIncidents.map((incident) => (
              <Card 
                key={incident.id} 
                className="p-3 border-0 shadow-sm bg-white hover:bg-red-50 transition-colors cursor-pointer group"
                onClick={() => navigate('/map')}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200 transition-colors">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-gray-900 truncate">Incident #{incident.id}</p>
                      <div className="flex items-center text-[10px] text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-0.5">
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

