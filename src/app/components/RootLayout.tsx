import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle Mesh Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none brightness-100 contrast-150"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="py-8 bg-white/40 backdrop-blur-md border-t border-slate-100 text-slate-500 relative z-10">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
                <a href="mailto:support@diggi.ai" className="hover:text-[#8959c8] transition-colors">support@diggi.ai</a>
                <span className="text-slate-300 hidden sm:block">|</span>
                <span className="text-slate-500">Support: +1 (234) 567-890</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 Diggi. Designed with Precision.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}