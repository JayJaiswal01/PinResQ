import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Users, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats, setupWebSocket } from "@/services/api";
import { FactCarousel } from "@/components/FactCarousel";

export function HomeScreen() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeCount: 0,
    resolvedToday: 0,
    totalVolunteers: 0,
    avgResponseMinutes: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const client = setupWebSocket(
      () => {},
      (data) => {
        if (!data.isAlert) fetchStats(); 
      }
    );
    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <div className="w-full pt-6 px-4 lg:px-8">
      
      {/* Top Hero + Fact Carousel Row */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Left: Hero block */}
        <div className="flex-1 flex flex-col justify-center gap-6 lg:gap-8 bg-white p-8 lg:p-10 rounded-[28px] border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-[1.15] tracking-tight">
              Smart Emergency Response. <br className="hidden lg:block"/>
              <span className="text-[#C0392B]">Stronger Communities.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
              When every second counts, PinResQ ensures your emergency reaches the right people instantly. 
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/report')}
              className="h-14 px-8 rounded-full bg-[#C0392B] hover:bg-red-800 text-white text-lg font-bold shadow-lg shadow-red-500/20"
            >
              Report Emergency
            </Button>
            <Button
              onClick={() => navigate('/map')}
              variant="outline"
              className="h-14 px-8 rounded-full border-2 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white text-lg font-bold"
            >
              View Live Map
            </Button>
          </div>
        </div>

        {/* Right: Fact Carousel */}
        <div className="w-full lg:w-[450px]">
          <div className="h-full bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 flex flex-col">
            <h3 className="text-[#C0392B] text-sm font-bold tracking-widest uppercase mb-4 text-center">DID YOU KNOW?</h3>
            <div className="flex-1">
              <FactCarousel />
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer CTA Row */}
      <div className="w-full bg-[#2C3E50] rounded-[28px] p-6 lg:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">Be a Hero in Someone's Story</h2>
          <p className="text-blue-100 text-base max-w-2xl">
            Join our network of verified volunteers and get notified when an emergency occurs near you. Your quick response can make the ultimate difference.
          </p>
        </div>
        <div className="relative z-10 shrink-0 w-full sm:w-auto">
          <Button 
            onClick={() => navigate('/profile')} 
            className="w-full sm:w-auto h-12 px-6 rounded-full bg-white text-[#2C3E50] hover:bg-gray-100 font-bold"
          >
            Join as Volunteer
          </Button>
        </div>
      </div>

      {/* Bottom Section: Stats & Safety grid */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        {/* Live Stats */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-bold text-[#2C3E50]">Live Overview</h3>
            <Badge className="bg-green-100 text-green-800 border border-green-200">System Online</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-[20px] bg-white border border-gray-100 p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-red-50 text-red-600">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-500 line-clamp-1">Active Incidents</p>
              </div>
              <p className="text-3xl font-bold text-[#2C3E50]">{loadingStats ? "..." : stats.activeCount}</p>
            </Card>

            <Card className="rounded-[20px] bg-white border border-gray-100 p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-500 line-clamp-1">Active Volunteers</p>
              </div>
              <p className="text-3xl font-bold text-[#2C3E50]">{loadingStats ? "..." : stats.totalVolunteers}</p>
            </Card>

            <Card className="rounded-[20px] bg-white border border-gray-100 p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-green-50 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-500 line-clamp-1">Resolved Today</p>
              </div>
              <p className="text-3xl font-bold text-[#2C3E50]">{loadingStats ? "..." : stats.resolvedToday}</p>
            </Card>

            <Card className="rounded-[20px] bg-white border border-gray-100 p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-yellow-50 text-yellow-600">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-500 line-clamp-1">Avg. Response Time</p>
              </div>
              <p className="text-3xl font-bold text-[#2C3E50]">{loadingStats ? "..." : `${stats.avgResponseMinutes} min`}</p>
            </Card>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="w-full lg:w-80">
          <h3 className="text-xl font-bold text-[#2C3E50] mb-4 px-1">Safety Advice</h3>
          <Card className="rounded-[24px] bg-[#FFF5F5] border border-red-100 p-6 h-[calc(100%-44px)] shadow-sm">
            <h4 className="font-bold text-[#C0392B] mb-3">During an Emergency:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                <span className="text-sm text-red-900/80 leading-relaxed">Stay calm and ensure your own safety first before helping others.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                <span className="text-sm text-red-900/80 leading-relaxed">Do not move critically injured victims unless there is immediate hazard.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                <span className="text-sm text-red-900/80 leading-relaxed">Use PinResQ to instantly ping nearby verified responders.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

    </div>
  );
}
