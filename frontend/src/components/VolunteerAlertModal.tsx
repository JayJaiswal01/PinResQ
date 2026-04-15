import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Navigation, X } from "lucide-react";
import { respondToIncident } from "@/services/api";

interface VolunteerAlertModalProps {
  incident: any;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (incident: any) => void;
}

export function VolunteerAlertModal({ incident, isOpen, onClose, onAccept }: VolunteerAlertModalProps) {
  if (!incident) return null;

  const handleAction = async (status: 'ACCEPTED' | 'REJECTED') => {
    const volunteerId = localStorage.getItem('userId');
    if (!volunteerId) return;

    try {
      await respondToIncident(incident.id, volunteerId, status);
      if (status === 'ACCEPTED') {
        onAccept(incident);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Failed to respond to incident", error);
      alert("Failed to send response.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-l-8 border-l-red-600">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="font-bold text-lg">EMERGENCY ALERT</span>
          </div>
          <DialogTitle className="text-xl font-extrabold tracking-tight">Nearby Incident Reported</DialogTitle>
          <DialogDescription className="text-gray-600 font-medium">
            An emergency has been reported within your 5km radius. Can you respond?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3 my-2 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Location</p>
              <p className="text-sm font-semibold text-gray-800">Coordinates: {incident.latitude?.toFixed(4)}, {incident.longitude?.toFixed(4)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Severity</p>
              <p className="text-sm font-semibold text-gray-800">{incident.severity || "Moderate"}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0 mt-2">
          <Button variant="outline" className="flex-1 rounded-full h-12" onClick={() => handleAction('REJECTED')}>
            Decline
          </Button>
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full h-12 shadow-md" 
            onClick={() => handleAction('ACCEPTED')}
          >
            <Navigation className="w-4 h-4 mr-2" />
            ACCEPT & NAVIGATE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
