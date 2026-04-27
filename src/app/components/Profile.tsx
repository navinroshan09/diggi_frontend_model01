import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUserProfile, updateUserProfile } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, CheckCircle, AlertCircle, Edit2, X, Save, Camera, User } from 'lucide-react';

const COUNTRIES = [
  "United States", "India", "United Kingdom", "Canada", "Australia", 
  "Germany", "France", "Japan", "Brazil", "South Africa", "Mexico",
  "Italy", "Spain", "Netherlands", "Singapore", "New Zealand",
  "United Arab Emirates", "Saudi Arabia", "China", "Other"
];

const DIAL_CODES = [
  { code: "+1", label: "+1 (US/CA)" },
  { code: "+91", label: "+91 (IN)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+61", label: "+61 (AU)" },
  { code: "+49", label: "+49 (DE)" },
  { code: "+33", label: "+33 (FR)" },
  { code: "+81", label: "+81 (JP)" },
  { code: "+55", label: "+55 (BR)" },
  { code: "+27", label: "+27 (ZA)" },
  { code: "+52", label: "+52 (MX)" },
  { code: "+65", label: "+65 (SG)" },
  { code: "+64", label: "+64 (NZ)" },
  { code: "+971", label: "+971 (UAE)" },
];

export function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [phoneCode, setPhoneCode] = useState('+1');
  const [phoneNum, setPhoneNum] = useState('');

  const [formData, setFormData] = useState({
    email: localStorage.getItem('userEmail') || '',
    full_name: '',
    country: '',
    gender: '',
    date_of_birth: '',
    profile_pic: '',
  });

  useEffect(() => {
    // If not logged in, should be handled by ProtectedRoute
    if (!formData.email) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      const email = formData.email.trim();
      if (!email) return;

      try {
        const response = await getUserProfile(email);
        console.log('Profile response:', response);

        // Handle both { status: 'success', data: {...} } and direct {...} formats
        const profileData = response.status === 'success' ? response.data : 
                           (response.email || response.full_name ? response : null);

        if (profileData) {
          setFormData(prev => ({
            ...prev,
            email: profileData.email || prev.email,
            full_name: profileData.full_name || '',
            country: profileData.country || '',
            gender: profileData.gender || '',
            date_of_birth: profileData.date_of_birth || '',
            profile_pic: profileData.profile_pic || '',
          }));

          // Parse phone number
          const fullPhone = profileData.phone || '';
          let matchedCode = '+1';
          let extractedNum = fullPhone;
          
          for (const dc of DIAL_CODES) {
            if (fullPhone.startsWith(dc.code)) {
              matchedCode = dc.code;
              extractedNum = fullPhone.slice(dc.code.length).trim();
              break;
            }
          }
          setPhoneCode(matchedCode);
          setPhoneNum(extractedNum);
        } else {
          console.warn('Profile data not found in response');
          // Optional: set an error message if data is truly missing
          if (response.status === 'error') {
            setMessage({ type: 'error', text: response.message || 'User profile not found.' });
          }
        }
      } catch (error: any) {
        console.error('Failed to load profile:', error);
        const errorMsg = error.response?.data?.message || 'Could not fetch profile details.';
        setMessage({ type: 'error', text: errorMsg });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [formData.email, navigate]);

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
    setSaving(true);
    setMessage(null);

    const mergedPhone = `${phoneCode}${phoneNum}`;

    try {
      const response = await updateUserProfile({
        email: formData.email,
        full_name: formData.full_name,
        country: formData.country,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        phone: mergedPhone,
        profile_pic: formData.profile_pic,
      });
      
      if (response.status === 'success') {
        setMessage({ type: 'success', text: response.message || 'Profile updated successfully!' });
        localStorage.setItem('userName', formData.full_name);
        setIsEditing(false);
      } else {
         setMessage({ type: 'success', text: 'Profile updated successfully!' });
         localStorage.setItem('userName', formData.full_name);
         setIsEditing(false);
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Update failed. Please try again later.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#8959c8]" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 py-16">
      <Card className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="space-y-1 text-center relative pt-12 pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center shadow-2xl shadow-purple-500/30 border-4 border-white overflow-hidden relative group">
              {formData.profile_pic ? (
                <img src={formData.profile_pic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer z-10">
                  <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 text-white mb-2" />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest leading-none">Choose Photo</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>
              )}
            </div>
          </div>
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-[#8959c8] to-[#cc78b8] bg-clip-text text-transparent tracking-tight">
            Your Profile
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">Manage your Diggi account details</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex justify-end mb-2">
               {!isEditing ? (
                 <Button 
                   type="button" 
                   variant="outline" 
                   size="sm" 
                   onClick={() => setIsEditing(true)}
                   className="text-[#8959c8] border-[#8959c8]/30 hover:bg-[#8959c8]/5 font-bold rounded-lg"
                 >
                   <Edit2 className="w-4 h-4 mr-2" />
                   Edit Profile
                 </Button>
               ) : (
                 <Button 
                   type="button" 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setIsEditing(false)}
                   className="text-slate-400 hover:text-slate-600 font-bold"
                 >
                   <X className="w-4 h-4 mr-2" />
                   Cancel
                 </Button>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className={`ml-1 text-[11px] font-black uppercase tracking-widest ${isEditing ? 'text-slate-300' : 'text-slate-400'}`}>Email Address (Identicon)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="h-12 border-slate-100 bg-slate-50/50 text-slate-400 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name" className={`ml-1 text-[11px] font-black uppercase tracking-widest ${isEditing ? 'text-[#8959c8]' : 'text-slate-500'}`}>Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="Your Name"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  disabled={!isEditing}
                  required
                  className={`h-12 rounded-xl px-4 font-bold ${isEditing ? 'border-slate-200 bg-white/80 focus:border-[#8959c8]/50' : 'bg-slate-50/50 border-slate-100'}`}
                />
              </div>

              <div className="space-y-2">
                <Label className={`ml-1 text-[11px] font-black uppercase tracking-widest ${isEditing ? 'text-[#8959c8]' : 'text-slate-500'}`}>Phone Number</Label>
                <div className="flex gap-3">
                  <Select value={phoneCode} onValueChange={setPhoneCode} disabled={!isEditing}>
                    <SelectTrigger className={`h-12 w-[130px] rounded-xl px-4 font-bold ${isEditing ? 'border-slate-200 bg-white/80 focus:border-[#8959c8]/50' : 'bg-slate-50/50 border-slate-100'}`}>
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-slate-100 shadow-xl rounded-xl">
                      {DIAL_CODES.map(dc => (
                        <SelectItem key={dc.code} value={dc.code}>{dc.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="1234567890"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    disabled={!isEditing}
                    required
                    className={`h-12 flex-1 rounded-xl px-4 font-bold ${isEditing ? 'border-slate-200 bg-white/80 focus:border-[#8959c8]/50' : 'bg-slate-50/50 border-slate-100'}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className={`ml-1 text-[11px] font-black uppercase tracking-widest ${isEditing ? 'text-[#8959c8]' : 'text-slate-500'}`}>Country</Label>
                <Select value={formData.country} onValueChange={(val) => handleChange('country', val)} disabled={!isEditing}>
                  <SelectTrigger id="country" className={`h-12 rounded-xl px-4 font-bold ${isEditing ? 'border-slate-200 bg-white/80 focus:border-[#8959c8]/50' : 'bg-slate-50/50 border-slate-100'}`}>
                     <SelectValue placeholder="Select a Country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-xl border-slate-100 shadow-xl rounded-xl">
                    {COUNTRIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className={`ml-1 text-[11px] font-black uppercase tracking-widest ${isEditing ? 'text-[#8959c8]' : 'text-slate-500'}`}>Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)} disabled={!isEditing}>
                  <SelectTrigger className={`h-12 rounded-xl px-4 font-bold ${isEditing ? 'border-slate-200 bg-white/80 focus:border-[#8959c8]/50' : 'bg-slate-50/50 border-slate-100'}`}>
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
                <Label htmlFor="date_of_birth" className={`ml-1 text-[11px] font-black uppercase tracking-widest ${isEditing ? 'text-[#8959c8]' : 'text-slate-500'}`}>Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  disabled={!isEditing}
                  required
                  className={`h-12 rounded-xl px-4 font-bold ${isEditing ? 'border-slate-200 bg-white/80 focus:border-[#8959c8]/50' : 'bg-slate-50/50 border-slate-100'}`}
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
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {isEditing && (
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-[#8959c8] to-[#cc78b8] hover:from-[#9761cb] hover:to-[#df8fd0] text-white font-black text-xl rounded-2xl shadow-xl shadow-purple-500/25 mt-4"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Syncing Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3" />
                    Update Profile
                  </>
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
