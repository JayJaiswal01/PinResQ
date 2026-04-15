import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, ShieldAlert } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-red-600 to-red-400 absolute top-0 left-0" />
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">PinResQ</CardTitle>
          <CardDescription className="text-md text-gray-500 mt-2">
            Geo-Verified Emergency Response
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Email</Label>
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
              <Label htmlFor="password" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="h-12 bg-gray-50"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl text-md font-bold mt-2 transition-all shadow-lg shadow-red-600/30"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-semibold">
              Register here
            </Link>
          </div>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-yellow-200 border-dashed" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-yellow-600 font-bold tracking-widest uppercase">Dev Mode</span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={devBypass}
            className="w-full mt-6 h-12 border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 font-bold rounded-xl"
          >
            ⚡ Quick Dev Access
          </Button>
          <p className="text-center text-xs text-gray-400 mt-3">Logs in as Jay Jaiswal · No backend required</p>
        </CardContent>
      </Card>
    </div>
  );
}
