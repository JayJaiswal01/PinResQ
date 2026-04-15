import { useState } from "react";
import { OnboardingScreen } from "./components/onboarding-screen";
import { HomeScreen } from "./components/home-screen";
import { ReportAccidentScreen } from "./components/report-accident-screen";
import { VerificationStatusScreen } from "./components/verification-status-screen";
import { VolunteerAlertScreen } from "./components/volunteer-alert-screen";
import { MapScreen } from "./components/map-screen";
import { RewardsScreen } from "./components/rewards-screen";
import { ProfileScreen } from "./components/profile-screen";
import { BottomNavigation, NavigationTab } from "./components/bottom-navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { AlertCircle } from "lucide-react";

type Screen = 
  | "onboarding" 
  | "home" 
  | "reportAccident" 
  | "verificationStatus" 
  | "volunteerAlert"
  | "map"
  | "rewards"
  | "profile";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");
  const [volunteerMode, setVolunteerMode] = useState(false);
  const [showVolunteerAlert, setShowVolunteerAlert] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleOnboardingComplete = () => {
    setCurrentScreen("home");
  };

  const handleReportAccident = () => {
    setShowConfirmDialog(true);
  };

  const confirmReportAccident = () => {
    setShowConfirmDialog(false);
    setCurrentScreen("reportAccident");
  };

  const handleReportSubmit = () => {
    setCurrentScreen("verificationStatus");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        setCurrentScreen("home");
        break;
      case "map":
        setCurrentScreen("map");
        break;
      case "rewards":
        setCurrentScreen("rewards");
        break;
      case "profile":
        setCurrentScreen("profile");
        break;
    }
  };

  const handleToggleVolunteerMode = (enabled: boolean) => {
    setVolunteerMode(enabled);
    if (enabled) {
      // Simulate receiving an alert after enabling volunteer mode
      setTimeout(() => {
        setShowVolunteerAlert(true);
      }, 2000);
    }
  };

  const handleViewVolunteerAlert = () => {
    setCurrentScreen("volunteerAlert");
    setShowVolunteerAlert(false);
  };

  const showBottomNav = 
    currentScreen !== "onboarding" && 
    currentScreen !== "reportAccident" && 
    currentScreen !== "verificationStatus" &&
    currentScreen !== "volunteerAlert";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Mobile container */}
      <div className="w-full max-w-md h-screen bg-white shadow-2xl relative overflow-hidden">
        {/* Screen content */}
        <div className="h-full">
          {currentScreen === "onboarding" && (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          )}
          
          {currentScreen === "home" && (
            <HomeScreen
              onReportAccident={handleReportAccident}
              volunteerMode={volunteerMode}
              onToggleVolunteerMode={handleToggleVolunteerMode}
            />
          )}
          
          {currentScreen === "reportAccident" && (
            <ReportAccidentScreen
              onBack={handleBackToHome}
              onSubmit={handleReportSubmit}
            />
          )}
          
          {currentScreen === "verificationStatus" && (
            <VerificationStatusScreen onBack={handleBackToHome} />
          )}
          
          {currentScreen === "volunteerAlert" && (
            <VolunteerAlertScreen
              onBack={handleBackToHome}
              onNavigate={() => {
                alert("Navigation started to incident location");
                handleBackToHome();
              }}
            />
          )}
          
          {currentScreen === "map" && <MapScreen />}
          
          {currentScreen === "rewards" && <RewardsScreen />}
          
          {currentScreen === "profile" && <ProfileScreen />}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-[90%] rounded-2xl">
            <DialogTitle className="sr-only">Report Emergency Confirmation</DialogTitle>
            <DialogDescription className="sr-only">
              Confirm that you want to report a real emergency
            </DialogDescription>
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Report Emergency?</h3>
              <p className="text-gray-600 mb-6">
                Only report real emergencies. False reports may result in penalties and delay actual emergency responses.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 h-12 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmReportAccident}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Volunteer Alert Notification */}
        {showVolunteerAlert && (
          <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top">
            <div className="bg-red-600 text-white rounded-2xl shadow-2xl p-4 border-2 border-red-700">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Emergency Alert!</p>
                  <p className="text-sm text-red-100">
                    Accident reported 1.2 km away. Immediate help needed.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleViewVolunteerAlert}
                  className="flex-1 bg-white text-red-600 hover:bg-red-50 rounded-full h-10"
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowVolunteerAlert(false)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}