import { useState, useEffect } from 'react';
import { getAllReports, updateReportStatus } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPanel() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await getAllReports();
      setReports(res.data);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5000); // Polling every 5s for live updates
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateReportStatus(id, status);
      toast.success(`Report status updated to ${status}`);
      fetchReports();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED': return 'bg-blue-100 text-blue-700';
      case 'VERIFIED': return 'bg-yellow-100 text-yellow-700';
      case 'DISPATCHED': return 'bg-purple-100 text-purple-700';
      case 'EN_ROUTE': return 'bg-orange-100 text-orange-700';
      case 'ON_SCENE': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Truck className="w-8 h-8 text-red-600" />
              Ambulance Dispatch Panel
            </h1>
            <p className="text-slate-500 mt-1">Real-time emergency management and response</p>
          </div>
          <Badge variant="outline" className="px-4 py-1 text-sm bg-white border-slate-200">
            System Online
          </Badge>
        </header>

        {loading ? (
          <div className="text-center py-20">Loading reports...</div>
        ) : (
          <div className="grid gap-4">
            {reports.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="py-12 text-center text-slate-400">
                  No active emergency reports
                </CardContent>
              </Card>
            ) : (
              reports.map((report) => (
                <Card key={report.id} className="overflow-hidden border-slate-200 hover:border-slate-300 transition-colors">
                  <div className={`h-1 w-full ${getStatusColor(report.status).split(' ')[0]}`} />
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <span className="text-xs text-slate-400 font-mono">ID: #{report.id}</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className={`w-5 h-5 mt-0.5 ${report.severity === 'Severe' ? 'text-red-500' : 'text-amber-500'}`} />
                            <div>
                              <p className="text-xs uppercase text-slate-400 font-bold">Severity</p>
                              <p className="font-semibold text-slate-900">{report.severity || 'Unknown'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 mt-0.5 text-slate-400" />
                            <div>
                              <p className="text-xs uppercase text-slate-400 font-bold">Time</p>
                              <p className="font-semibold text-slate-900">
                                {new Date(report.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 md:flex-1 bg-white">
                        <div className="flex items-start gap-3 mb-4">
                          <MapPin className="w-5 h-5 mt-1 text-slate-400" />
                          <div>
                            <p className="text-xs uppercase text-slate-400 font-bold">Location</p>
                            <p className="text-slate-900">{report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                          <div className="bg-slate-50 p-2 rounded">
                            <p className="text-slate-400 text-[10px] uppercase font-bold">Vehicles</p>
                            <p className="font-semibold">{report.vehiclesInvolved || 0}</p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded">
                            <p className="text-slate-400 text-[10px] uppercase font-bold">Fire/Smoke</p>
                            <p className="font-semibold">{report.fireSmokePresent ? 'YES' : 'NO'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 md:w-1/4 bg-slate-50 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100">
                        {report.status === 'RECEIVED' || report.status === 'VERIFIED' ? (
                          <Button 
                            className="w-full bg-slate-900 hover:bg-slate-800"
                            onClick={() => handleStatusUpdate(report.id, 'DISPATCHED')}
                          >
                            <Truck className="w-4 h-4 mr-2" /> Dispatch
                          </Button>
                        ) : null}
                        
                        {report.status === 'DISPATCHED' ? (
                          <Button 
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            onClick={() => handleStatusUpdate(report.id, 'EN_ROUTE')}
                          >
                            <Navigation className="w-4 h-4 mr-2" /> Mark En Route
                          </Button>
                        ) : null}

                        {report.status === 'EN_ROUTE' ? (
                          <Button 
                            className="w-full bg-red-600 hover:bg-red-700"
                            onClick={() => handleStatusUpdate(report.id, 'ON_SCENE')}
                          >
                            <MapPin className="w-4 h-4 mr-2" /> Arrived on Scene
                          </Button>
                        ) : null}

                        {report.status === 'ON_SCENE' ? (
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusUpdate(report.id, 'COMPLETED')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Close Incident
                          </Button>
                        ) : null}
                        
                        <Button variant="outline" className="w-full" onClick={() => window.open(`https://www.google.com/maps?q=${report.latitude},${report.longitude}`, '_blank')}>
                          View on Map
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
