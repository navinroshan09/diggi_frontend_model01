import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { registerUser } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, CheckCircle, AlertCircle, Camera, User, Upload } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    country: '',
    gender: '',
    date_of_birth: '',
    profile_pic: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChange('profile_pic', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (formData.password !== formData.confirm_password) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const { confirm_password, ...apiData } = formData;
      const response = await registerUser(apiData);
      if (response.status === 'success') {
        setMessage({ type: 'success', text: response.message });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 py-8 relative overflow-hidden">
      <div 
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/10 rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 text-center pt-8 pb-6">
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-[#8959c8] to-[#cc78b8] bg-clip-text text-transparent tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">Join Diggi for intelligent news verification</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload Sector */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center shadow-2xl shadow-purple-500/30 border-4 border-white overflow-hidden relative">
                  {formData.profile_pic ? (
                    <img src={formData.profile_pic} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-14 h-14 text-white" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[2.5rem] opacity-0 group-hover:opacity-100 cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 text-white mb-2" />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Choose Photo</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">Personalize your profile</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-wider">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  required
                  className="h-12 border-slate-200 focus:border-[#8959c8]/50 bg-white/50 rounded-xl px-4 font-medium"
                />
              </div>

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
                <Label htmlFor="phone" className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-wider">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 (234) 567-890"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  className="h-12 border-slate-200 focus:border-[#8959c8]/50 bg-white/50 rounded-xl px-4 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-wider">Country</Label>
                <Input
                  id="country"
                  placeholder="United States"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  required
                  className="h-12 border-slate-200 focus:border-[#8959c8]/50 bg-white/50 rounded-xl px-4 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-wider">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                  <SelectTrigger className="h-12 border-slate-200 focus:border-[#8959c8]/50 bg-white/50 rounded-xl px-4 font-medium">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-xl border-slate-100 shadow-xl rounded-xl">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-wider">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-slate-700 font-bold text-sm ml-1 uppercase tracking-wider">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirm_password}
                  onChange={(e) => handleChange('confirm_password', e.target.value)}
                  required
                  className="h-12 border-slate-200 focus:border-[#8959c8]/50 bg-white/50 rounded-xl px-4 font-medium"
                />
              </div>
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
              className="w-full h-14 bg-gradient-to-r from-[#8959c8] to-[#cc78b8] hover:from-[#9761cb] hover:to-[#df8fd0] text-white font-black text-xl rounded-2xl shadow-xl shadow-purple-500/25 mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <p className="text-center text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#8959c8] hover:text-[#cc78b8] font-bold underline decoration-purple-200 underline-offset-4">
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
