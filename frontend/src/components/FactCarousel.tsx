import { useState, useEffect } from "react";
import { AlertCircle, Shield, Clock, Heart } from "lucide-react";

const facts = [
  {
    id: 1,
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    text: "Every 4 minutes, someone in India dies in a road accident.",
  },
  {
    id: 2,
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-50",
    text: "First aid within 10 minutes can double survival chances.",
  },
  {
    id: 3,
    icon: Shield,
    color: "text-green-500",
    bg: "bg-green-50",
    text: "PinResQ connects you to the nearest volunteer in under 60 seconds.",
  },
  {
    id: 4,
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50",
    text: "Your quick reporting helps save lives and reduces ambulance dispatch times.",
  }
];

export function FactCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[220px] rounded-[28px] overflow-hidden bg-white border border-gray-100 shadow-sm transition-all">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {facts.map((fact) => {
          const Icon = fact.icon;
          return (
            <div key={fact.id} className="min-w-full h-full flex flex-col justify-center items-center p-6 text-center">
              <div className={`p-4 rounded-full ${fact.bg} mb-4`}>
                <Icon className={`w-8 h-8 ${fact.color}`} />
              </div>
              <p className="text-gray-800 font-medium text-lg lg:text-xl leading-relaxed max-w-sm">
                "{fact.text}"
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {facts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-6 bg-red-500" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
