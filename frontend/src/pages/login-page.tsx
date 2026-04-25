import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, ShieldAlert, Smartphone, Truck } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { user } = res.data;
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userPhone', user.phone || '');
      localStorage.setItem('volunteerMode', user.volunteerMode);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const devBypass = () => {
    localStorage.setItem('userId', '1');
    localStorage.setItem('userName', 'Jay Jaiswal');
    localStorage.setItem('userEmail', 'jay@pinresq.dev');
    localStorage.setItem('userPhone', '+91 98765 43210');
    localStorage.setItem('volunteerMode', 'false');
    localStorage.setItem('points', '30');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_38%,_#fff1f2_100%)] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_minmax(0,460px)]">
        <section className="hidden lg:block">
          <div className="max-w-xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">PinResQ Control Center</p>
            <h1 className="text-5xl font-semibold leading-tight text-slate-950">
              One emergency reporting UI for desktop monitors and mobile screens.
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              Sign in from your PC for monitoring, then add the same app to your phone home screen in Chrome for fast field access.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-lg shadow-blue-950/5 backdrop-blur">
                <ShieldAlert className="h-8 w-8 text-red-600" />
                <h2 className="mt-4 text-lg font-semibold text-slate-900">Responsive Operations</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Dashboards, reporting, maps, and alerts scale cleanly between phone and desktop layouts.
                </p>
              </div>
              <div className="rounded-[28px] border border-blue-50 bg-blue-50/50 p-5 shadow-sm">
                <Smartphone className="h-8 w-8 text-blue-600" />
                <h2 className="mt-4 text-lg font-semibold text-slate-900">Chrome Home Screen</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Mobile users can add the web app icon to their home screen and launch it directly through Chrome.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Card className="relative w-full overflow-hidden border-0 shadow-2xl shadow-slate-900/10">
          <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-red-600 to-red-400" />
          <CardHeader className="pb-4 pt-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">PinResQ</CardTitle>
            <CardDescription className="mt-2 text-md text-gray-500">
              Geo-Verified Emergency Response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="h-12 bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="h-12 bg-gray-50"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-xl bg-red-600 text-md font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-700"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Register here
              </Link>
            </div>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-yellow-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 font-bold uppercase tracking-widest text-yellow-600">Dev Mode</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={devBypass}
              className="mt-6 h-12 w-full rounded-xl border-yellow-300 bg-yellow-50 font-bold text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
            >
              Quick Dev Access
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
              className="mt-3 flex h-12 w-full items-center justify-center gap-3 rounded-xl border-slate-300 bg-slate-900 font-bold text-white hover:bg-slate-800"
            >
              <Truck className="h-5 w-5" /> Ambulance Panel
            </Button>
            <p className="mt-3 text-center text-xs text-gray-400">Logs in as Jay Jaiswal · No backend required</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
