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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-red-600 to-red-400 absolute top-0 left-0" />
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1">
            Join the PinResQ network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2 border border-green-200">
                <AlertCircle className="w-4 h-4" />
                {success}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Full Name</Label>
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
              <Label htmlFor="email" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Email</Label>
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
              <Label htmlFor="phone" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Phone</Label>
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
              <Label htmlFor="password" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="h-11 bg-gray-50"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl text-md font-bold mt-4 transition-all shadow-lg shadow-red-600/30"
            >
              {loading ? 'Creating...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 hover:underline font-semibold">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
