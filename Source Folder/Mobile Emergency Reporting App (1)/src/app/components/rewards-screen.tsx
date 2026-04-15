import { 
  Award, 
  Trophy, 
  Star, 
  TrendingUp,
  Users,
  CheckCircle,
  Medal,
  Zap
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function RewardsScreen() {
  const stats = {
    totalPoints: 1250,
    verifiedReports: 8,
    rank: 42,
    totalUsers: 15420
  };

  const badges = [
    { 
      name: "First Responder", 
      icon: Award, 
      description: "Submitted first verified report",
      earned: true,
      color: "text-yellow-600 bg-yellow-100"
    },
    { 
      name: "Life Saver", 
      icon: Medal, 
      description: "5 verified reports",
      earned: true,
      color: "text-blue-600 bg-blue-100"
    },
    { 
      name: "Quick Reporter", 
      icon: Zap, 
      description: "Report within 2 minutes",
      earned: true,
      color: "text-purple-600 bg-purple-100"
    },
    { 
      name: "Community Hero", 
      icon: Trophy, 
      description: "10 verified reports",
      earned: false,
      color: "text-gray-400 bg-gray-100"
    },
    { 
      name: "Guardian Angel", 
      icon: Star, 
      description: "Help 25 people",
      earned: false,
      color: "text-gray-400 bg-gray-100"
    },
    { 
      name: "Elite Volunteer", 
      icon: Medal, 
      description: "50 verified reports",
      earned: false,
      color: "text-gray-400 bg-gray-100"
    }
  ];

  const recentActivity = [
    {
      action: "Verified Report",
      location: "NH-48, Mumbai-Delhi Highway",
      points: 150,
      time: "2 days ago",
      type: "success"
    },
    {
      action: "Volunteer Response",
      location: "Outer Ring Road, Bangalore",
      points: 200,
      time: "5 days ago",
      type: "success"
    },
    {
      action: "Verified Report",
      location: "NH-8, Jaipur Bypass",
      points: 150,
      time: "1 week ago",
      type: "success"
    }
  ];

  const leaderboard = [
    { name: "Priya S.", points: 3450, rank: 1 },
    { name: "Rahul K.", points: 2890, rank: 2 },
    { name: "Sneha M.", points: 2340, rank: 3 },
    { name: "You", points: stats.totalPoints, rank: stats.rank, isCurrentUser: true },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-purple-50 to-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-2xl mb-1">Rewards & Impact</h2>
        <p className="text-gray-600">Your contribution to community safety</p>
      </div>

      {/* Points Card */}
      <div className="px-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-purple-200 text-sm mb-1">Total Points</p>
              <div className="text-5xl font-medium mb-2">{stats.totalPoints}</div>
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <TrendingUp className="w-4 h-4" />
                <span>+150 this week</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Trophy className="w-8 h-8" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-purple-200">Next reward at 1,500 pts</span>
              <span className="font-medium">250 pts to go</span>
            </div>
            <Progress value={83} className="h-2 bg-white/20" />
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-medium">{stats.verifiedReports}</div>
            </div>
            <p className="text-sm text-gray-600">Verified Reports</p>
          </Card>
          
          <Card className="p-4 border-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-medium">#{stats.rank}</div>
            </div>
            <p className="text-sm text-gray-600">Community Rank</p>
          </Card>
        </div>
      </div>

      {/* Badges */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Achievements</h3>
          <Badge variant="outline">{badges.filter(b => b.earned).length}/{badges.length}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <Card
                key={index}
                className={`p-4 text-center ${
                  badge.earned 
                    ? "border-2 bg-gradient-to-br from-white to-gray-50" 
                    : "border-dashed border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${badge.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className={`text-xs font-medium mb-1 ${
                  badge.earned ? "text-gray-900" : "text-gray-400"
                }`}>
                  {badge.name}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  {badge.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mb-6">
        <h3 className="font-medium mb-3">Recent Activity</h3>
        <Card className="divide-y">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.location} • {activity.time}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+{activity.points}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Leaderboard */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Top Contributors</h3>
          <Badge variant="outline" className="text-xs">This Month</Badge>
        </div>
        <Card className="divide-y">
          {leaderboard.map((user, index) => (
            <div
              key={index}
              className={`p-4 flex items-center gap-3 ${
                user.isCurrentUser ? "bg-blue-50" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                user.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                user.rank === 2 ? "bg-gray-200 text-gray-700" :
                user.rank === 3 ? "bg-orange-100 text-orange-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {user.rank}
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${user.isCurrentUser ? "text-blue-700" : ""}`}>
                  {user.name}
                </p>
                <p className="text-xs text-gray-600">{user.points} points</p>
              </div>
              {user.rank <= 3 && (
                <Trophy className={`w-5 h-5 ${
                  user.rank === 1 ? "text-yellow-500" :
                  user.rank === 2 ? "text-gray-400" :
                  "text-orange-400"
                }`} />
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* Community Impact */}
      <div className="px-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium">Community Impact</h3>
              <p className="text-sm text-gray-600">Together we're making a difference</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-medium text-green-700 mb-1">3,247</div>
              <p className="text-xs text-gray-600">Lives Helped</p>
            </div>
            <div>
              <div className="text-3xl font-medium text-green-700 mb-1">12 min</div>
              <p className="text-xs text-gray-600">Avg. Response Time</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}