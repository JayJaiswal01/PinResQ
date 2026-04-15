import { useState, useEffect } from "react";
import { 
  MapPin, 
  Ambulance,
  Navigation,
  AlertCircle,
  Crosshair,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllReports } from "@/services/api";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icon issue using unpkg CDNs because raw imports fail in Vite mostly
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

/** Recenter the map whenever userPos changes */
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
  const [userPos, setUserPos] = useState<[number, number]>([28.6139, 77.2090]); // Default Delhi

  useEffect(() => {
    // Attempt to grab actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Geolocation error:', err.message),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    getAllReports().then(res => {
      const data = res.data.map((r: any, idx: number) => {
        // Fallbacks if no details string found
        const severityObj = r.severity?.toLowerCase() || "moderate";
        const hasFireObj = r.fireSmokePresent || false;
        
        return {
          id: r.id,
          type: r.status === "RESOLVED" ? "resolved" : "active",
          severity: severityObj,
          location: `Lat: ${r.latitude?.toFixed(4)}, Lng: ${r.longitude?.toFixed(4)}`, // string fallback
          coords: [r.latitude || 28.6139 + (idx*0.001), r.longitude || 77.2090 + (idx*0.001)] as [number, number],
          time: r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : "Recent",
          distance: `${(1 + (idx % 4) * 0.5).toFixed(1)} km`,
          hasAmbulance: r.status === "EN_ROUTE" || r.status === "DISPATCHED",
          hasFire: hasFireObj,
          hasVolunteers: r.vehiclesInvolved || 0
        };
      });
      setIncidents(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    })
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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b z-10 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Incident Map</h2>
            <p className="text-sm text-gray-600">
              {loading ? "Loading..." : `${filteredIncidents.length} incidents`}
            </p>
          </div>
          <Badge className="bg-green-600">Live</Badge>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as any)}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative">
        <MapContainer
          center={userPos}
          zoom={14}
          zoomControl={false}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
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
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md z-10 pointer-events-none">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <img src={userIcon.options.iconUrl} className="w-3 h-5 object-contain" alt="User" />
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={activeIcon.options.iconUrl} className="w-3 h-5 object-contain" alt="Active" />
              <span>Active Incident</span>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md min-w-[120px] z-10 pointer-events-none">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-600">Active</span>
              <Badge className="bg-red-600">{incidents.filter(i => i.type === "active").length}</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-600">Resolved</span>
              <Badge variant="outline">{incidents.filter(i => i.type === "resolved").length}</Badge>
            </div>
          </div>
        </div>

        {/* Recenter Button */}
        <Button 
          variant="secondary"
          size="icon"
          onClick={handleRecenter}
          className="absolute bottom-6 right-4 rounded-full shadow-lg z-10 bg-white hover:bg-gray-100"
        >
          <Crosshair className="w-5 h-5 text-gray-700" />
        </Button>
      </div>

      {/* Bottom sheet - Incident details overlay */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t-4 border-blue-600 px-6 py-5 max-h-[40%] overflow-y-auto z-20 transition-transform">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Badge className={`mb-2 ${
                  selected.type === "active" ? "bg-red-600" : "bg-gray-600"
                }`}>
                  {selected.type.toUpperCase()}
                </Badge>
                <h3 className="text-lg font-medium tracking-tight">Location {selected.location}</h3>
                <p className="text-sm text-gray-600">{selected.distance} away • {selected.time}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedIncident(null)}
                className="rounded-full"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 rounded-lg p-3 text-center transition-colors">
                <AlertCircle className={`w-5 h-5 mx-auto mb-1 ${
                  selected.severity === "severe" ? "text-red-600" : 
                  selected.severity === "moderate" ? "text-orange-600" : "text-yellow-600"
                }`} />
                <p className="text-xs font-medium capitalize">{selected.severity}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center transition-colors">
                <Ambulance className={`w-5 h-5 mx-auto mb-1 ${selected.hasAmbulance ? "text-blue-600" : "text-gray-400"}`} />
                <p className="text-xs font-medium">{selected.hasAmbulance ? "En route" : "Awaiting"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center transition-colors">
                <Flame className={`w-5 h-5 mx-auto mb-1 ${selected.hasFire ? "text-orange-600" : "text-gray-400"}`} />
                <p className="text-xs font-medium">{selected.hasFire ? "Fire/Smoke" : "Clear"}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm text-sm font-semibold h-11">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
              <Button variant="outline" className="flex-1 rounded-full shadow-sm text-sm font-semibold h-11 border-gray-200">
                View Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}