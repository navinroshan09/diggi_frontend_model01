import { Link, useNavigate } from 'react-router';
import { LogOut, UserCircle } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#8959c8] to-[#cc78b8] bg-clip-text text-transparent">
              iggi
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6 mr-4">
              <Link to="/" className="text-sm font-bold text-slate-600 hover:text-[#8959c8] transition-colors">Home</Link>
              <a href="/#about" className="text-sm font-bold text-slate-600 hover:text-[#8959c8] transition-colors">About</a>
              <a href="/#working" className="text-sm font-bold text-slate-600 hover:text-[#8959c8] transition-colors">Working</a>
              <a href="/#contact" className="text-sm font-bold text-slate-600 hover:text-[#8959c8] transition-colors">Contact</a>
            </div>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-[#8959c8] transition-colors">
                  <UserCircle className="w-5 h-5 text-[#8959c8]" />
                  <span>{userEmail}</span>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#8959c8]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-[#8959c8] hover:bg-purple-50"
                >
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-[#8959c8] to-[#cc78b8] hover:from-[#9761cb] hover:to-[#df8fd0] text-white shadow-lg shadow-purple-500/25 border-none"
                >
                  <Link to="/register">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}