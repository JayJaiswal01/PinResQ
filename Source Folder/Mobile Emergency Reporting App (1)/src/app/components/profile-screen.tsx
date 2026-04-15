import { 
  User, 
  Shield, 
  Award,
  FileText,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  CheckCircle,
  Heart,
  Briefcase,
  ChevronRight,
  Mail,
  Phone
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";

export function ProfileScreen() {
  const userProfile = {
    name: "Arjun Patel",
    email: "arjun.patel@example.com",
    phone: "+91 98765 43210",
    memberSince: "January 2024",
    verified: true
  };

  const certifications = [
    {
      name: "CPR Certified",
      icon: Heart,
      verified: true,
      expires: "Dec 2025",
      color: "text-red-600 bg-red-100"
    },
    {
      name: "First Aid",
      icon: Briefcase,
      verified: true,
      expires: "Mar 2026",
      color: "text-green-600 bg-green-100"
    },
    {
      name: "Emergency Response",
      icon: Shield,
      verified: false,
      expires: null,
      color: "text-gray-400 bg-gray-100"
    }
  ];

  const menuItems = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage alert preferences",
      hasSwitch: true,
      enabled: true
    },
    {
      icon: FileText,
      label: "Report History",
      description: "View your past reports",
      hasSwitch: false
    },
    {
      icon: Award,
      label: "Certifications",
      description: "Manage training certificates",
      hasSwitch: false
    },
    {
      icon: Settings,
      label: "Settings",
      description: "App preferences",
      hasSwitch: false
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQs and contact",
      hasSwitch: false
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-20 h-20 border-4 border-white/30">
            <AvatarFallback className="bg-blue-800 text-white text-2xl">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl">{userProfile.name}</h2>
              {userProfile.verified && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>
            <p className="text-blue-200 text-sm">Member since {userProfile.memberSince}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-blue-200" />
            <span className="text-blue-100">{userProfile.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-blue-200" />
            <span className="text-blue-100">{userProfile.phone}</span>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="px-6 -mt-6 mb-6">
        <Card className="p-4 border-2 shadow-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Identity Verified</p>
                <p className="text-sm text-gray-600">Trusted volunteer</p>
              </div>
            </div>
            <Badge className="bg-green-600">Active</Badge>
          </div>
        </Card>
      </div>

      {/* Certifications */}
      <div className="px-6 mb-6">
        <h3 className="font-medium mb-3">Certifications & Skills</h3>
        <div className="space-y-3">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <Card
                key={index}
                className={`p-4 ${
                  cert.verified 
                    ? "border-2 bg-gradient-to-br from-white to-gray-50" 
                    : "border-dashed border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cert.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-medium ${cert.verified ? "" : "text-gray-500"}`}>
                        {cert.name}
                      </p>
                      {cert.verified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    {cert.verified ? (
                      <p className="text-sm text-gray-600">Expires: {cert.expires}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Not certified</p>
                    )}
                  </div>
                  {!cert.verified && (
                    <Button variant="outline" size="sm">
                      Add
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
        <Button variant="outline" className="w-full mt-3 rounded-full">
          <Award className="w-4 h-4 mr-2" />
          Upload New Certificate
        </Button>
      </div>

      {/* Menu Items */}
      <div className="px-6 mb-6">
        <h3 className="font-medium mb-3">Settings & Support</h3>
        <Card className="divide-y">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-4 flex items-center gap-3"
              >
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {item.hasSwitch ? (
                  <Switch defaultChecked={item.enabled} />
                ) : (
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            );
          })}
        </Card>
      </div>

      {/* Stats Summary */}
      <div className="px-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <h3 className="font-medium mb-4">Your Impact</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-medium text-purple-700 mb-1">8</div>
              <p className="text-xs text-gray-600">Reports</p>
            </div>
            <div>
              <div className="text-2xl font-medium text-purple-700 mb-1">1,250</div>
              <p className="text-xs text-gray-600">Points</p>
            </div>
            <div>
              <div className="text-2xl font-medium text-purple-700 mb-1">3</div>
              <p className="text-xs text-gray-600">Badges</p>
            </div>
          </div>
        </Card>
      </div>

      {/* App Info */}
      <div className="px-6 mb-6">
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p className="font-medium">G-BERRS v1.0.2</p>
            <p>Geo-Verified Bystander Emergency</p>
            <p>Response & Reporting System</p>
            <div className="pt-3 flex justify-center gap-4 text-xs">
              <button className="text-blue-600 hover:underline">Privacy Policy</button>
              <button className="text-blue-600 hover:underline">Terms of Service</button>
            </div>
          </div>
        </Card>
      </div>

      {/* Logout Button */}
      <div className="px-6 mb-6">
        <Button variant="outline" className="w-full h-12 rounded-full text-red-600 border-red-200 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}