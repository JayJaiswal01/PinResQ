import { ChevronRight, MapPin, Award, AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const slides = [
    {
      icon: AlertCircle,
      title: "Report Accidents Instantly",
      description: "Capture incidents with video and real-time GPS location. Help emergency services respond faster.",
      image: "https://images.unsplash.com/photo-1603561093485-1b3a25b2731a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBhbWJ1bGFuY2UlMjBoaWdod2F5fGVufDF8fHx8MTc3MTMwOTM4NXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: Users,
      title: "Volunteer Network",
      description: "Trained volunteers receive alerts to provide immediate CPR and first aid until professionals arrive.",
      image: "https://images.unsplash.com/photo-1765996796562-ce301df337a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJzdCUyMGFpZCUyMHRyYWluaW5nJTIwbWVkaWNhbHxlbnwxfHx8fDE3NzEzMDkzODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: Award,
      title: "Earn Rewards",
      description: "Get points and badges for verified reports. Join a community making roads safer for everyone.",
      image: "https://images.unsplash.com/photo-1758404958502-44f156617bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxwaW5nJTIwcGVvcGxlJTIwZW1lcmdlbmN5fGVufDF8fHx8MTc3MTMwOTM4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Skip button */}
      <div className="p-4 flex justify-end">
        <Button variant="ghost" onClick={handleSkip}>
          Skip
        </Button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="w-full max-w-sm">
          {/* Image */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden mb-8 shadow-lg">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 inline-flex">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl mb-3">{slide.title}</h2>
            <p className="text-gray-600 leading-relaxed">
              {slide.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? "w-8 bg-blue-600" 
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Next button */}
          <Button 
            onClick={handleNext}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            size="lg"
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
