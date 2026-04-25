import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await registerUser(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#eef2ff_0%,_#f8fafc_42%,_#fff7ed_100%)] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_minmax(0,460px)]">
        <section className="hidden lg:block">
          <div className="max-w-xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">Join The Network</p>
            <h1 className="text-5xl font-semibold leading-tight text-slate-950">
              Create one account and use PinResQ from mobile, tablet, and desktop.
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              Registration stays simple, while the app experience adapts automatically once the user signs in on any screen size.
            </p>
          </div>
        </section>

        <Card className="relative w-full overflow-hidden border-0 shadow-2xl">
          <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-red-600 to-red-400" />
          <CardHeader className="pb-4 pt-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">
              Join the PinResQ network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  <AlertCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Jay Jaiswal"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="h-11 bg-gray-50"
                />
              </div>

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
                  className="h-11 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-11 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="h-11 bg-gray-50"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-4 h-12 w-full rounded-xl bg-red-600 text-md font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-700"
              >
                {loading ? 'Creating...' : 'Register'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/" className="font-semibold text-blue-600 hover:underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
