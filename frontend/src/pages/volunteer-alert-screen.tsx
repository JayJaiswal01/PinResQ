import { 
  MapPin, 
  Navigation, 
  Clock, 
  AlertCircle,
  Heart,
  Briefcase,
  ChevronLeft,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VolunteerAlertScreenProps {
  onBack: () => void;
  onNavigate: () => void;
}

export function VolunteerAlertScreen({ onBack, onNavigate }: VolunteerAlertScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <Badge className="bg-red-600 mb-2">URGENT ALERT</Badge>
            <h2 className="text-2xl">Emergency Nearby</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4">
        {/* Distance & Time Card */}
        <Card className="p-6 bg-gradient-to-br from-red-600 to-red-700 text-white border-0 shadow-lg">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="text-5xl font-medium mb-2">1.2 km</div>
            <p className="text-white/90">from your location</p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/20">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Approx. 3 minutes drive</span>
          </div>
        </Card>

        {/* Incident Details */}
        <Card className="p-4 border-2">
          <h3 className="font-medium mb-3">Incident Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Severity</p>
                <p className="font-medium">Moderate injuries reported</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">NH-44, Near Gurgaon Toll</p>
                <p className="text-sm text-gray-500">Near DLF Cyber City Exit</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Reported</p>
                <p className="font-medium">3 minutes ago</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Skills Needed */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-medium mb-3">Skills Needed</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-600 text-white px-3 py-1">
              <Heart className="w-3 h-3 mr-1" />
              CPR Certified
            </Badge>
            <Badge className="bg-green-600 text-white px-3 py-1">
              <Briefcase className="w-3 h-3 mr-1" />
              First Aid
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Your certified skills match this emergency. You can provide critical help until ambulance arrives.
          </p>
        </Card>

        {/* Emergency Team Status */}
        <Card className="p-4 border-2">
          <h3 className="font-medium mb-3">Professional Response</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ambulance ETA</span>
              <span className="font-medium">8 minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Police ETA</span>
              <span className="font-medium">6 minutes</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-600">Other volunteers</span>
              <span className="font-medium">2 en route</span>
            </div>
          </div>
        </Card>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">Volunteer Safety</p>
              <ul className="space-y-1">
                <li>• Only respond if you feel safe to do so</li>
                <li>• Assess the scene before approaching</li>
                <li>• Follow proper safety protocols</li>
                <li>• Never put yourself at risk</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden shadow-md mb-6">
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path d="M 0 100 Q 100 50 200 100 T 400 100" stroke="#4B5563" strokeWidth="2" fill="none" />
              <path d="M 50 150 Q 150 120 250 140 T 400 150" stroke="#4B5563" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          
          {/* Incident location */}
          <div className="absolute top-1/3 right-1/3 transform">
            <MapPin className="w-10 h-10 text-red-600 drop-shadow-lg animate-bounce" fill="currentColor" />
          </div>

          {/* Your location */}
          <div className="absolute bottom-1/4 left-1/4">
            <div className="bg-blue-600 p-2 rounded-full shadow-lg">
              <Navigation className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full">
            <path 
              d="M 100 150 Q 200 120 280 80" 
              stroke="#3B82F6" 
              strokeWidth="3" 
              strokeDasharray="5,5"
              fill="none" 
            />
          </svg>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 border-t bg-white space-y-3">
        <Button
          onClick={onNavigate}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
          size="lg"
        >
          <Navigation className="mr-2 w-5 h-5" />
          Navigate to Scene
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-full"
          >
            <Phone className="mr-2 w-4 h-4" />
            Call Control
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-full"
            onClick={onBack}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}