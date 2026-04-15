import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  MapPin, 
  AlertCircle, 
  Check, 
  ChevronLeft,
  Upload,
  Navigation,
  Flame,
  Car,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { createReport } from "@/services/api";
import { IncidentUpdateModal } from "@/components/IncidentUpdateModal";

export function ReportAccidentScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("moderate");
  const [hasFire, setHasFire] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [reportId, setReportId] = useState<number | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090, address: "Detecting location..." });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ ...location, lat: pos.coords.latitude, lng: pos.coords.longitude, address: "NH-44, Current GPS Location" }),
        () => {} 
      );
    }
  }, []);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const payload = {
          userId: Number(localStorage.getItem('userId')) || 1,
          latitude: location.lat,
          longitude: location.lng,
          severity: selectedSeverity,
          vehiclesInvolved: vehicleCount,
          fireSmokePresent: hasFire,
          hasVideo: videoUploaded
        };
        const res = await createReport(payload);
        const newId = res.data.report.id;
        setReportId(newId);
        setShowUpdateModal(true);
      } catch (e) {
        console.error("Failed to submit report", e);
        alert("Failed to submit report. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleUpdateComplete = () => {
    setShowUpdateModal(false);
    navigate(`/report/status`);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden pb-12">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl">Report Accident</h2>
            <p className="text-sm text-gray-600">Step {step} of {totalSteps}</p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* Step 1: Video Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
                <Camera className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl mb-2">Capture Incident</h3>
              <p className="text-gray-600">
                Record a short video (5-30 seconds) of the accident scene
              </p>
            </div>

            {!videoUploaded ? (
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                <button
                  onClick={() => setVideoUploaded(true)}
                  className="w-full p-12 flex flex-col items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors bg-transparent border-0"
                >
                  <Upload className="w-12 h-12" />
                  <div className="text-center">
                    <p className="font-medium">Tap to record or upload</p>
                    <p className="text-sm">Max 30 seconds</p>
                  </div>
                </button>
              </Card>
            ) : (
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 p-2 rounded-full">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Video recorded</p>
                    <p className="text-sm text-gray-600">15 seconds • 2.3 MB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideoUploaded(false)}
                  >
                    Retake
                  </Button>
                </div>
              </Card>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Privacy & Safety</p>
                  <p>Only record the accident scene. Avoid capturing faces or license plates unnecessarily.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2">Confirm Location</h3>
              <p className="text-gray-600">
                GPS location auto-detected. Adjust pin if needed.
              </p>
            </div>

            {/* Map */}
            <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden shadow-md">
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <path d="M 0 150 Q 100 100 200 150 T 400 150" stroke="#4B5563" strokeWidth="2" fill="none" />
                  <path d="M 50 200 Q 150 180 250 190 T 400 200" stroke="#4B5563" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <MapPin className="w-12 h-12 text-red-600 drop-shadow-lg" fill="currentColor" />
              </div>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">GPS Accuracy: High</span>
                </div>
              </div>
            </div>

            <Card className="p-4 border-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Latitude</span>
                  <span className="font-mono text-sm">{location.lat.toFixed(4)}° N</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Longitude</span>
                  <span className="font-mono text-sm">{location.lng.toFixed(4)}° E</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t mt-2">
                  <span className="text-sm text-gray-600">Address</span>
                  <span className="text-sm text-right">{location.address}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-3">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-2">Incident Details</h3>
              <p className="text-gray-600">
                Quick assessment to help dispatch the right resources
              </p>
            </div>

            {/* Injury Severity */}
            <div className="space-y-3">
              <Label className="text-base">Injury Severity</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "minor", label: "Minor", color: "bg-yellow-100 border-yellow-300 text-yellow-700" },
                  { value: "moderate", label: "Moderate", color: "bg-orange-100 border-orange-300 text-orange-700" },
                  { value: "severe", label: "Severe", color: "bg-red-100 border-red-300 text-red-700" }
                ].map((severity) => (
                  <button
                    key={severity.value}
                    onClick={() => setSelectedSeverity(severity.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSeverity === severity.value
                        ? severity.color + " ring-2 ring-offset-2"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium">{severity.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fire Present */}
            <Card 
              className={`p-4 cursor-pointer transition-all border-2 ${
                hasFire ? "bg-red-50 border-red-300" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setHasFire(!hasFire)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${hasFire ? "bg-red-200" : "bg-gray-100"}`}>
                    <Flame className={`w-5 h-5 ${hasFire ? "text-red-600" : "text-gray-600"}`} />
                  </div>
                  <div>
                    <p className="font-medium">Fire or Smoke</p>
                    <p className="text-sm text-gray-600">Requires fire brigade</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  hasFire ? "bg-red-600 border-red-600" : "border-gray-300"
                }`}>
                  {hasFire && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            </Card>

            {/* Vehicle Count */}
            <div className="space-y-3">
              <Label className="text-base">Vehicles Involved</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setVehicleCount(Math.max(1, vehicleCount - 1))}
                  className="h-12 w-12 rounded-full"
                >
                  -
                </Button>
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Car className="w-5 h-5 text-gray-600" />
                    <span className="text-3xl font-medium">{vehicleCount}</span>
                  </div>
                  <p className="text-sm text-gray-600">vehicle{vehicleCount !== 1 ? "s" : ""}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setVehicleCount(Math.min(10, vehicleCount + 1))}
                  className="h-12 w-12 rounded-full"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl mb-2">Review & Submit</h3>
              <p className="text-gray-600">
                Please verify all information before submitting
              </p>
            </div>

            <Card className="p-4 border-2">
              <h4 className="font-medium mb-3">Report Summary</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Camera className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Video Evidence</p>
                    <p className="font-medium">15-second recording attached</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{location.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Severity</p>
                    <p className="font-medium capitalize">{selectedSeverity || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Vehicles</p>
                    <p className="font-medium">{vehicleCount} vehicle{vehicleCount !== 1 ? "s" : ""} involved</p>
                  </div>
                </div>
                {hasFire && (
                  <div className="flex items-start gap-3">
                    <Flame className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Fire Alert</p>
                      <p className="font-medium text-red-600">Fire brigade required</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Important</p>
                  <p>False reports may result in penalties. Only submit if this is a genuine emergency.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer buttons */}
      {!showUpdateModal && (
        <div className="fixed bottom-0 mt-auto px-6 py-4 border-t bg-white w-full max-w-md">
          <Button
            onClick={handleNext}
            disabled={(step === 1 && !videoUploaded) || isSubmitting}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50"
            size="lg"
          >
            {isSubmitting ? "Submitting..." : (step === totalSteps ? "Submit Report" : "Continue")}
          </Button>
        </div>
      )}

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