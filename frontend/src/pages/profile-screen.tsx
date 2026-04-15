import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  LogOut,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toggleVolunteer } from "@/services/api";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [volunteerMode, setVolunteerMode] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || "User");
    setUserEmail(localStorage.getItem('userEmail') || "");
    setUserPhone(localStorage.getItem('userPhone') || "");
    setVolunteerMode(localStorage.getItem('volunteerMode') === 'true');
  }, []);

  const handleToggleVolunteerMode = async (enabled: boolean) => {
    setVolunteerMode(enabled);
    localStorage.setItem('volunteerMode', String(enabled));
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        await toggleVolunteer(userId);
      } catch (e) {
        console.error("Failed to toggle volunteer mode", e);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* Header & Profile Info */}
      <div className="bg-white px-6 pt-8 pb-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
          <Button variant="ghost" size="icon" className="text-gray-500 rounded-full">
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white shadow-md">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-medium">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-blue-600">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">{userName}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Verified Citizen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Volunteer Mode Card */}
        <Card className={`p-5 transition-all duration-300 border-2 ${
          volunteerMode ? 'bg-green-50 border-green-200' : 'bg-white border-transparent shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-full ${
                volunteerMode ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-base">Volunteer Mode</h4>
                  {volunteerMode && (
                    <Badge variant="secondary" className="bg-green-200 text-green-800 hover:bg-green-200 uppercase text-[10px] tracking-wider px-1.5 py-0">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 pr-4">
                  {volunteerMode 
                    ? "You are ready to receive emergency alerts nearby." 
                    : "Turn on to help others in emergency situations nearby."}
                </p>
              </div>
            </div>
            <Switch 
              checked={volunteerMode}
              onCheckedChange={handleToggleVolunteerMode}
              className="data-[state=checked]:bg-green-600 scale-110"
            />
          </div>
        </Card>

        {/* Account Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Account Details</h4>
          <Card className="divide-y divide-gray-100 border-0 shadow-sm">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{userPhone || "Not set"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userEmail || "Not set"}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Security & Support */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Settings</h4>
          <Card className="divide-y divide-gray-100 border-0 shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </Card>
        </div>

        {/* Logout */}
        <div className="pt-4 pb-12">
          <Button 
            variant="outline" 
            className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-white"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
          <p className="text-center text-xs text-gray-400 mt-6">PinResQ v1.0.0</p>
        </div>
      </div>
    </div>
  );
}