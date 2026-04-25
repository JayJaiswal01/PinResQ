import { useState, useEffect } from "react";
import { 
  MapPin, 
  Ambulance,
  Navigation,
  AlertCircle,
  Crosshair,
  Flame,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllReports, setupWebSocket } from "@/services/api";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Emergency Icons
const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const resolvedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 14, { animate: true });
    }
  }, [coords, map]);
  return null;
}

export function MapScreen() {
  const [filterMode, setFilterMode] = useState<"all" | "active" | "resolved">("active");
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState<[number, number]>([28.6139, 77.2090]);

  const fetchIncidents = () => {
    getAllReports().then(res => {
      const data = res.data.map((r: any) => {
        const severityObj = r.severity?.toLowerCase() || "moderate";
        const hasFireObj = r.fireSmokePresent || false;
        
        return {
          id: r.id,
          type: r.status === "RESOLVED" ? "resolved" : "active",
          severity: severityObj,
          location: `Lat: ${r.latitude?.toFixed(4)}, Lng: ${r.longitude?.toFixed(4)}`,
          coords: [r.latitude || 28.6139, r.longitude || 77.2090] as [number, number],
          time: r.timestamp ? new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recent",
          distance: "Nearby", // Calculate actual distance if needed
          hasAmbulance: r.status === "EN_ROUTE" || r.status === "DISPATCHED",
          hasFire: hasFireObj,
          hasVolunteers: r.vehiclesInvolved || 0,
          reportType: r.type || "ACCIDENT"
        };
      });
      setIncidents(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Geolocation error:', err.message),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    fetchIncidents();

    // Setup WebSocket for realtime map updates
    const client = setupWebSocket(
      () => {},
      (data) => {
        if (!data.isAlert) {
          fetchIncidents(); // Refresh when new incidents come in
        }
      }
    );

    return () => {
      client.deactivate();
    };
  }, []);

  const filteredIncidents = incidents.filter(incident => {
    if (filterMode === "all") return true;
    return incident.type === filterMode;
  });

  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const selected = incidents.find(i => i.id === selectedIncident);

  const handleRecenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      );
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-[#F9FAFB]">
      
      {/* Desktop Left Sidebar / Mobile Header */}
      <div className="flex flex-col lg:w-96 lg:h-full lg:border-r border-slate-200 bg-white z-10 shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
        <div className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Live Map</h2>
              <p className="text-sm text-gray-600">
                {loading ? "Loading..." : `${filteredIncidents.length} incidents`}
              </p>
            </div>
            <Badge className="bg-red-50 text-red-600 border border-red-200 animate-pulse">Live</Badge>
          </div>

          <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as any)}>
            <TabsList className="w-full grid grid-cols-3 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Active</TabsTrigger>
              <TabsTrigger value="resolved" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Desktop Side Panel List */}
        <div className="hidden lg:flex flex-col flex-1 overflow-y-auto p-4 gap-3">
          {filteredIncidents.map(incident => (
            <div 
              key={incident.id} 
              onClick={() => setSelectedIncident(incident.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedIncident === incident.id ? 'border-red-500 bg-red-50 shadow-md translate-x-1' : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <Badge className={incident.type === 'active' ? 'bg-red-600' : 'bg-gray-500'}>
                  {incident.reportType}
                </Badge>
                <span className="text-xs text-gray-500 font-medium">{incident.time}</span>
              </div>
              <p className="text-base font-bold text-gray-900 mb-1">Emergency #{incident.id}</p>
              <p className="text-sm text-gray-600 mb-2">{incident.location}</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-[10px] text-gray-500 bg-gray-50 uppercase">{incident.severity}</Badge>
                {incident.hasAmbulance && <Badge variant="outline" className="text-[10px] text-blue-600 bg-blue-50 border-blue-200 uppercase">Ambulance</Badge>}
              </div>
            </div>
          ))}
          {filteredIncidents.length === 0 && (
             <div className="text-center p-8 text-gray-500">No incidents to display.</div>
          )}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative w-full h-[600px] lg:h-full lg:min-h-screen">
        <MapContainer
          center={userPos}
          zoom={14}
          zoomControl={false}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap coords={userPos} />

          {/* User Location */}
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <div className="p-1">
                <strong>📍 Your Location</strong>
              </div>
            </Popup>
          </Marker>

          {/* Incidents */}
          {filteredIncidents.map((incident) => (
            <Marker
              key={incident.id}
              position={incident.coords}
              icon={incident.type === "active" ? activeIcon : resolvedIcon}
              eventHandlers={{
                click: () => {
                  setSelectedIncident(incident.id);
                },
              }}
            >
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg z-10 pointer-events-none border border-slate-100">
          <div className="space-y-3 text-sm font-medium text-slate-700">
            <div className="flex items-center gap-3">
              <img src={userIcon.options.iconUrl} className="w-4 object-contain" alt="User" />
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={activeIcon.options.iconUrl} className="w-4 object-contain" alt="Active" />
              <span>Active Incident</span>
            </div>
          </div>
        </div>

        {/* Recenter Button */}
        <Button 
          variant="secondary"
          size="icon"
          onClick={handleRecenter}
          className="absolute bottom-6 right-4 rounded-full w-12 h-12 shadow-xl z-10 bg-white hover:bg-gray-50 border border-slate-100 text-slate-700"
        >
          <Crosshair className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Bottom Sheet overlay */}
      {selected && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-slate-100 px-6 py-5 max-h-[50%] overflow-y-auto z-40 animate-in slide-in-from-bottom-5">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5" />
          
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge className={`mb-2 px-3 py-1 ${
                  selected.type === "active" ? "bg-red-600" : "bg-gray-600"
                }`}>
                  {selected.reportType}
                </Badge>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Emergency #{selected.id}</h3>
                <p className="text-sm text-gray-500 mt-1">{selected.location} • {selected.time}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedIncident(null)}
                className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-5 h-5"/>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <AlertCircle className={`w-6 h-6 mx-auto mb-2 ${
                  selected.severity === "severe" ? "text-red-500" : 
                  selected.severity === "moderate" ? "text-orange-500" : "text-yellow-500"
                }`} />
                <p className="text-xs font-bold text-slate-700 capitalize">{selected.severity}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <Ambulance className={`w-6 h-6 mx-auto mb-2 ${selected.hasAmbulance ? "text-blue-500" : "text-slate-400"}`} />
                <p className="text-xs font-bold text-slate-700">{selected.hasAmbulance ? "En route" : "Awaiting"}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <Flame className={`w-6 h-6 mx-auto mb-2 ${selected.hasFire ? "text-orange-500" : "text-slate-400"}`} />
                <p className="text-xs font-bold text-slate-700">{selected.hasFire ? "Fire/Smoke" : "Clear"}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold h-12">
                <Navigation className="w-5 h-5 mr-2" />
                Navigate
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl shadow-sm text-sm font-bold h-12 border-slate-200 text-slate-700 hover:bg-slate-50">
                View Details
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}