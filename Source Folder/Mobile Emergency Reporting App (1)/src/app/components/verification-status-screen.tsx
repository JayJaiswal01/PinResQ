import { 
  Check, 
  Clock, 
  MapPin, 
  Ambulance, 
  Upload,
  ChevronLeft,
  Radio
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface VerificationStatusScreenProps {
  onBack: () => void;
}

export function VerificationStatusScreen({ onBack }: VerificationStatusScreenProps) {
  const statuses = [
    { 
      label: "Report Received", 
      time: "Just now", 
      completed: true,
      description: "Your report has been received by the control center"
    },
    { 
      label: "Verification in Progress", 
      time: "1 min ago", 
      completed: true,
      description: "Video and location are being verified"
    },
    { 
      label: "Emergency Team Dispatched", 
      time: "2 min ago", 
      completed: true,
      description: "Ambulance and police have been notified"
    },
    { 
      label: "Responders En Route", 
      time: "Estimated 8 minutes", 
      completed: false,
      description: "Emergency services are heading to the location"
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl">Incident Status</h2>
            <p className="text-sm text-gray-600">Report #ER-2024-0456</p>
          </div>
          <Badge className="bg-green-600">Verified</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* ETA Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <Ambulance className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Emergency Team</p>
                <p className="text-2xl font-medium">8 minutes</p>
              </div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <p className="text-sm">ETA</p>
            </div>
          </div>
          <Progress value={60} className="h-2 bg-white/20" />
          <p className="text-sm opacity-90 mt-3">Ambulance is 2.4 km away</p>
        </Card>

        {/* Timeline */}
        <div>
          <h3 className="font-medium mb-4">Response Timeline</h3>
          <div className="space-y-1">
            {statuses.map((status, index) => (
              <div key={index} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status.completed 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {status.completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  {index < statuses.length - 1 && (
                    <div className={`w-0.5 h-16 ${
                      status.completed ? "bg-green-600" : "bg-gray-200"
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between mb-1">
                    <p className={`font-medium ${
                      status.completed ? "text-gray-900" : "text-gray-600"
                    }`}>
                      {status.label}
                    </p>
                    <span className="text-sm text-gray-500">{status.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{status.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Map */}
        <Card className="p-4 border-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Incident Location</h4>
            <Button variant="ghost" size="sm">
              <MapPin className="w-4 h-4 mr-1" />
              View Map
            </Button>
          </div>
          <div className="relative w-full h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 400 150">
                <path d="M 0 75 Q 100 50 200 75 T 400 75" stroke="#4B5563" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
              <MapPin className="w-8 h-8 text-red-600" fill="currentColor" />
            </div>
            <div className="absolute top-2 right-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                NH-44, Near Gurgaon Toll
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Media */}
        <Card className="p-4 border-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium">Additional Information</h4>
              <p className="text-sm text-gray-600">Help responders with more details</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload More Photos/Videos
          </Button>
        </Card>

        {/* Volunteers Notified */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-600 p-2 rounded-full">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Nearby Volunteers Alerted</p>
              <p className="text-sm text-gray-600">3 trained responders notified within 2 km</p>
            </div>
          </div>
        </Card>

        {/* Safety Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium mb-2 text-blue-900">Stay Safe</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Move to a safe distance from the accident</li>
            <li>• Turn on hazard lights if in a vehicle</li>
            <li>• Do not move injured persons unless in immediate danger</li>
            <li>• Wait for professional help to arrive</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t bg-white">
        <Button
          variant="outline"
          className="w-full h-12 rounded-full"
          onClick={onBack}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}