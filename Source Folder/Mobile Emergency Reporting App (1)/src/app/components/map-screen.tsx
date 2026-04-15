import { useState } from "react";
import { 
  MapPin, 
  Filter, 
  Ambulance,
  Navigation,
  AlertCircle,
  Clock,
  Flame
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function MapScreen() {
  const [filterMode, setFilterMode] = useState<"all" | "active" | "resolved">("active");

  const incidents = [
    {
      id: 1,
      type: "active",
      severity: "moderate",
      location: "NH-44, Near Gurgaon Toll",
      time: "3 min ago",
      distance: "1.2 km",
      position: { x: "65%", y: "35%" },
      hasAmbulance: true,
      hasVolunteers: 2
    },
    {
      id: 2,
      type: "active",
      severity: "severe",
      location: "MG Road & Connaught Place",
      time: "8 min ago",
      distance: "3.5 km",
      position: { x: "40%", y: "60%" },
      hasAmbulance: true,
      hasFire: true,
      hasVolunteers: 1
    },
    {
      id: 3,
      type: "resolved",
      severity: "minor",
      location: "Nehru Place Metro",
      time: "25 min ago",
      distance: "2.1 km",
      position: { x: "75%", y: "70%" },
      hasAmbulance: false,
      hasVolunteers: 0
    }
  ];

  const filteredIncidents = incidents.filter(incident => {
    if (filterMode === "all") return true;
    return incident.type === filterMode;
  });

  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const selected = incidents.find(i => i.id === selectedIncident);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl">Live Incident Map</h2>
            <p className="text-sm text-gray-600">{filteredIncidents.length} incidents</p>
          </div>
          <Badge className="bg-green-600">
            Live
          </Badge>
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

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-100">
          {/* Map grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {[...Array(8)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={`${(i + 1) * 12.5}%`}
                y1="0"
                x2={`${(i + 1) * 12.5}%`}
                y2="100%"
                stroke="#9CA3AF"
                strokeWidth="1"
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={`${(i + 1) * 12.5}%`}
                x2="100%"
                y2={`${(i + 1) * 12.5}%`}
                stroke="#9CA3AF"
                strokeWidth="1"
              />
            ))}
          </svg>

          {/* Road patterns */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <path d="M 0 200 Q 150 180 300 200 T 600 200" stroke="#4B5563" strokeWidth="4" fill="none" />
            <path d="M 100 0 Q 120 200 140 400 T 180 800" stroke="#4B5563" strokeWidth="4" fill="none" />
            <path d="M 50 300 Q 200 290 350 300 T 650 300" stroke="#6B7280" strokeWidth="3" fill="none" />
          </svg>
        </div>

        {/* Current location */}
        <div className="absolute bottom-1/4 left-1/4" style={{ transform: "translate(-50%, -50%)" }}>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75 w-6 h-6" />
            <div className="relative bg-blue-600 p-2 rounded-full shadow-lg">
              <Navigation className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Incident markers */}
        {filteredIncidents.map((incident) => (
          <div
            key={incident.id}
            className="absolute cursor-pointer"
            style={{ 
              left: incident.position.x, 
              top: incident.position.y,
              transform: "translate(-50%, -100%)"
            }}
            onClick={() => setSelectedIncident(incident.id)}
          >
            <div className="relative">
              {incident.type === "active" && (
                <div className="absolute -inset-2 bg-red-500 rounded-full animate-ping opacity-75" />
              )}
              <MapPin
                className={`w-10 h-10 relative drop-shadow-lg ${
                  incident.type === "active" 
                    ? incident.severity === "severe" 
                      ? "text-red-700" 
                      : "text-orange-600"
                    : "text-gray-400"
                }`}
                fill="currentColor"
              />
              {incident.hasAmbulance && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 shadow-md">
                  <Ambulance className="w-3 h-3 text-white" />
                </div>
              )}
              {incident.hasFire && (
                <div className="absolute -top-1 -right-1 bg-orange-600 rounded-full p-1 shadow-md">
                  <Flame className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-700" fill="currentColor" />
              <span>Active Incident</span>
            </div>
            <div className="flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-blue-600" />
              <span>Emergency Team</span>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md min-w-[120px]">
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
      </div>

      {/* Bottom sheet - Incident details */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t-4 border-blue-600 px-6 py-5 max-h-[40%] overflow-y-auto">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Badge className={`mb-2 ${
                  selected.type === "active" ? "bg-red-600" : "bg-gray-600"
                }`}>
                  {selected.type.toUpperCase()}
                </Badge>
                <h3 className="text-lg font-medium">{selected.location}</h3>
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
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <AlertCircle className={`w-5 h-5 mx-auto mb-1 ${
                  selected.severity === "severe" ? "text-red-600" : 
                  selected.severity === "moderate" ? "text-orange-600" : "text-yellow-600"
                }`} />
                <p className="text-xs capitalize">{selected.severity}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <Ambulance className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="text-xs">{selected.hasAmbulance ? "En route" : "Dispatched"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <Navigation className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-xs">{selected.hasVolunteers} volunteers</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
              <Button variant="outline" className="flex-1 rounded-full">
                View Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}