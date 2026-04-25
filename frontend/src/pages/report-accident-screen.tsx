import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  MapPin, 
  ChevronLeft,
  Upload,
  AlertCircle,
  Stethoscope,
  Flame,
  ShieldAlert,
  Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createReport } from "@/services/api";
import { IncidentUpdateModal } from "@/components/IncidentUpdateModal";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationPicker({ coords, onChange }: { coords: { lat: number; lng: number }; onChange: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coords.lat, coords.lng], 16);
  }, [coords.lat, coords.lng, map]);
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return <Marker position={[coords.lat, coords.lng]} />;
}

export function ReportAccidentScreen() {
  const navigate = useNavigate();
  const [incidentType, setIncidentType] = useState<string>("ACCIDENT");
  const [description, setDescription] = useState<string>("");
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [reportId, setReportId] = useState<number | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090, address: "Detecting location..." });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ ...location, lat: pos.coords.latitude, lng: pos.coords.longitude, address: "Current GPS Location" }),
        () => {} 
      );
    }
  }, []);

  const handleSubmit = async () => {
    if (!description.trim() || !incidentType) {
      alert("Please provide an incident type and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: Number(localStorage.getItem('userId')) || 1,
        latitude: location.lat,
        longitude: location.lng,
        severity: "moderate", // Defaulting for simple flow
        vehiclesInvolved: incidentType === "ACCIDENT" ? 1 : 0,
        fireSmokePresent: incidentType === "FIRE",
        hasVideo: videoUploaded,
        type: incidentType,
        description: description,
        priority: "HIGH" // Default to HIGH for new simplified flow
      };
      
      const res = await createReport(payload);
      const newId = res.data.id || res.data.report?.id;
      setReportId(newId);
      setShowUpdateModal(true);
    } catch (e) {
      console.error("Failed to submit report", e);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComplete = () => {
    setShowUpdateModal(false);
    navigate(`/report/status`);
  };

  const emergencyTypes = [
    { id: "ACCIDENT", label: "Accident", icon: Car },
    { id: "MEDICAL", label: "Medical", icon: Stethoscope },
    { id: "FIRE", label: "Fire", icon: Flame },
    { id: "SECURITY", label: "Security", icon: ShieldAlert }
  ];

  return (
    <div className="min-h-full flex flex-col bg-[#F9FAFB] lg:p-8">
      <div className="max-w-3xl w-full mx-auto bg-white lg:rounded-3xl lg:shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-20">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full bg-gray-50 hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-[#2C3E50]">Report Emergency</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">PinResQ Rapid Dispatch</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          
          {/* Emergency Type Selector */}
          <section>
            <h3 className="text-sm font-bold text-[#2C3E50] uppercase tracking-wider mb-3 px-1">What is the emergency?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {emergencyTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = incidentType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setIncidentType(type.id)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-200 ${
                      isSelected 
                        ? "bg-red-50 border-[#C0392B] text-[#C0392B] shadow-sm transform scale-[1.02]" 
                        : "bg-white border-gray-100 text-[#2C3E50] hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${isSelected ? "text-[#C0392B]" : "text-gray-400"}`} />
                    <span className="font-bold text-sm">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Location Field */}
          <section>
             <h3 className="text-sm font-bold text-[#2C3E50] uppercase tracking-wider mb-3 px-1">Confirm Location</h3>
             <div className="w-full h-[180px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative">
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={16}
                  zoomControl={false}
                  style={{ height: '100%', width: '100%', zIndex: 0 }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker 
                    coords={{ lat: location.lat, lng: location.lng }} 
                    onChange={(lat, lng) => setLocation({ 
                      ...location, 
                      lat, 
                      lng, 
                      address: "User Selected Point" 
                    })} 
                  />
                </MapContainer>
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-sm z-[1000] border border-gray-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C0392B]" />
                  <span className="text-sm font-bold text-[#2C3E50] truncate max-w-[200px]">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                </div>
             </div>
             <p className="text-xs text-gray-500 mt-2 px-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Drag or click map to adjust exact position.
             </p>
          </section>

          {/* Audio / Video Upload */}
          <section>
            <h3 className="text-sm font-bold text-[#2C3E50] uppercase tracking-wider mb-3 px-1">Media Evidence (Optional)</h3>
            {!videoUploaded ? (
              <button
                onClick={() => setVideoUploaded(true)}
                className="w-full p-6 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors text-gray-500 font-medium"
              >
                <Camera className="w-5 h-5" />
                Tap to record photo or short video
              </button>
            ) : (
              <div className="w-full p-4 flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-green-900 text-sm">Media attached</p>
                    <p className="text-xs text-green-700">Ready for upload</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setVideoUploaded(false)} className="text-green-700 hover:bg-green-100">Remove</Button>
              </div>
            )}
          </section>

          {/* Text Area Description */}
          <section>
            <h3 className="text-sm font-bold text-[#2C3E50] uppercase tracking-wider mb-3 px-1">Additional details</h3>
            <textarea 
              className="w-full min-h-[120px] p-4 rounded-2xl border border-gray-200 focus:border-[#2C3E50] focus:ring-1 focus:ring-[#2C3E50] outline-none text-sm text-[#2C3E50] bg-gray-50 focus:bg-white transition-colors resize-none placeholder-gray-400"
              placeholder="e.g. 2 cars involved, person injured, leaking fuel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>

        </div>

        {/* Submit Button */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim()}
            className="w-full h-14 bg-[#C0392B] hover:bg-red-800 text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-500/20 active:scale-[0.98] transition-transform"
          >
            {isSubmitting ? "Dispatching..." : "Submit Emergency"}
          </Button>
        </div>

      </div>

      {reportId && (
        <IncidentUpdateModal 
          reportId={reportId}
          isOpen={showUpdateModal}
          onClose={() => navigate('/report/status')}
          onComplete={handleUpdateComplete}
        />
      )}
    </div>
  );
}
