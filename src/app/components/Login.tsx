import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { loginUser } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await loginUser(formData);
      if (response.status === 'success') {
        setMessage({ type: 'success', text: response.message });
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        // Store full name if returned by backend, else use a placeholder or email prefix
        const fullName = response.data?.full_name || formData.email.split('@')[0];
        localStorage.setItem('userName', fullName);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Login failed. Please check your credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 py-8 relative overflow-hidden">

      <div 
        className="w-full max-w-md relative z-10"
      >
        <Card className="w-full max-w-md bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/10 rounded-2xl overflow-hidden">
        <CardHeader className="space-y-1 text-center pb-6 pt-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-3xl">D</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-black bg-gradient-to-r from-[#8959c8] to-[#cc78b8] bg-clip-text text-transparent tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">Continue your news analysis journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-wider">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="h-12 border-slate-200 focus:border-[#8959c8]/50 bg-white/50 rounded-xl px-4 font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-wider">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                className="h-12 border-slate-200 focus:border-[#8959c8]/50 bg-white/50 rounded-xl px-4 font-medium"
              />
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#8959c8] to-[#cc78b8] hover:from-[#9761cb] hover:to-[#df8fd0] text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>

            <p className="text-center text-sm text-slate-500 font-medium pt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#8959c8] hover:text-[#cc78b8] font-bold underline decoration-purple-200 underline-offset-4">
                Register here
              </Link>
            </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}