import { AlertCircle, Phone, MapPin, Users, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";

interface HomeScreenProps {
  onReportAccident: () => void;
  volunteerMode: boolean;
  onToggleVolunteerMode: (enabled: boolean) => void;
}

export function HomeScreen({ 
  onReportAccident, 
  volunteerMode, 
  onToggleVolunteerMode 
}: HomeScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl mb-1">G-BERRS</h1>
            <p className="text-sm text-gray-600">Emergency Response System</p>
          </div>
          <Badge variant={volunteerMode ? "default" : "outline"} className="bg-green-600 text-white">
            {volunteerMode ? "Active" : "Standby"}
          </Badge>
        </div>

        {/* Volunteer mode toggle */}
        <Card className="p-4 mb-6 bg-white/80 backdrop-blur-sm border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="font-medium">Volunteer Mode</p>
                <p className="text-xs text-gray-600">Receive nearby alerts</p>
              </div>
            </div>
            <Switch 
              checked={volunteerMode}
              onCheckedChange={onToggleVolunteerMode}
            />
          </div>
        </Card>
      </div>

      {/* Map preview */}
      <div className="px-6 mb-6">
        <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden shadow-md">
          {/* Simulated map */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path d="M 0 100 Q 100 50 200 100 T 400 100" stroke="#4B5563" strokeWidth="2" fill="none" />
              <path d="M 50 150 Q 150 120 250 140 T 400 150" stroke="#4B5563" strokeWidth="1.5" fill="none" />
              <path d="M 0 50 Q 120 80 240 60 T 400 70" stroke="#4B5563" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          
          {/* Location marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
              <div className="relative bg-blue-600 p-3 rounded-full shadow-lg">
                <Navigation className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Location label */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Current Location Detected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency button */}
      <div className="px-6 mb-6">
        <Button
          onClick={onReportAccident}
          className="w-full h-24 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl shadow-xl shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="w-10 h-10" />
            <span className="text-xl">Report Accident</span>
          </div>
        </Button>
      </div>

      {/* Quick actions */}
      <div className="px-6 pb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-2">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-red-100 p-3 rounded-full">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-medium">Emergency Call</span>
              <span className="text-xs text-gray-500">911 / 112</span>
            </div>
          </Card>
          
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-2">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-blue-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Nearby Incidents</span>
              <span className="text-xs text-gray-500">Live map</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activity indicator */}
      <div className="px-6 pb-24">
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-full">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">System Active</p>
              <p className="text-xs text-gray-600">0 active incidents nearby</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
