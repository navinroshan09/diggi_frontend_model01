import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Sparkles, 
  Shield, 
  BarChart3, 
  Clock, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Search,
  TrendingUp
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Delay slightly to ensure component is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">

      <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16">
        <div className="absolute inset-0 bg-white/20 pointer-events-none z-0"></div>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/50 backdrop-blur-md rounded-full border border-purple-200/50 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#8959c8]" />
                <span className="text-sm font-bold text-[#8959c8]">
                  AI-Powered News Verification
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-slate-900 tracking-tight">
                A Deep-Dive into <br/> 
                <span className="bg-gradient-to-r from-[#8959c8] to-[#cc78b8] bg-clip-text text-transparent">
                  News
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-xl">
                Navigate the complex world of news with confidence. Get multi-source verification, 
                credibility analysis and contextual insight.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-[#8959c8] to-[#cc78b8] hover:from-[#9761cb] hover:to-[#df8fd0] text-white px-8 h-14 text-lg"
                >
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline"
                  className="border-[#8959c8]/30 text-[#cc78b8] hover:bg-[#8959c8]/10 px-8 h-14 text-lg"
                >
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
              

            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#8959c8] to-[#cc78b8] rounded-2xl blur-2xl opacity-20"></div>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1767455471230-c0957aba5034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwYW5hbHlzaXMlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NjI0MDE2MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="News Analysis Dashboard"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="pt-8 pb-12 relative scroll-mt-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight">
              Why <span className="text-[#8959c8]">Diggi</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Leverage advanced AI technology to verify and compare sources to better understand what’s happening in the news.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5 group rounded-2xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Multi-Source Analysis</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Cross-reference information from multiple trusted sources to get a comprehensive view of any news story.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5 group rounded-2xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Credibility Scoring</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Get real-time credibility signals with confidence levels to assess the reliability of information.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5 group rounded-2xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Historical Context</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Understand the full picture with timeline analysis and background information on evolving stories.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5 group rounded-2xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Evidence Tracking</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Trace claims back to their original sources with transparent evidence traceability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5 group rounded-2xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Multiple Perspectives</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Explore different viewpoints and angles to understand the complete narrative.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5 group rounded-2xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Smart Insights</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Receive intelligent suggestions and exploratory questions to deepen your understanding.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="working" className="py-12 relative overflow-hidden scroll-mt-20">
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-xl text-slate-600 font-medium">Clear, fast and reliable news analysis in no time.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-purple-500/10 flex items-center justify-center mx-auto mb-8 text-3xl font-black text-[#8959c8]">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Enter Query</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Type in the news topic, claim, or question you want to verify.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-purple-500/10 flex items-center justify-center mx-auto mb-8 text-3xl font-black text-[#8959c8]">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Analyze</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Our AI will cross-check multiple sources and evaluate credibility signals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-purple-500/10 flex items-center justify-center mx-auto mb-8 text-3xl font-black text-[#8959c8]">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Get Insights</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Receive a detailed report with scores, evidence, and historical context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-12 bg-transparent relative overflow-hidden scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Card className="bg-gradient-to-br from-[#8959c8] to-[#cc78b8] border-none shadow-2xl shadow-purple-500/40 p-8 md:p-12 rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
                Ready to Start?
              </h2>
              <p className="text-xl text-purple-50 mb-12 font-medium">
                Join thousands of people who trust Diggi for accurate, contextual news analysis.
              </p>
              <Button 
                asChild
                size="lg" 
                className="bg-white text-[#8959c8] hover:bg-slate-50 px-12 h-16 text-xl font-black rounded-2xl shadow-xl shadow-black/10"
              >
                <Link to="/register">
                  Create Free Account
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="py-12 bg-transparent text-center border-t border-slate-200/50 mt-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">D</span>
            </span>
            <span className="text-xl font-bold text-slate-800">Diggi</span>
          </div>
          <p className="text-slate-600 font-medium mt-4">
            <a href="mailto:Support@diggi.ai" className="hover:text-[#8959c8] transition-colors">Support@diggi.ai</a>
            <span className="mx-4 text-slate-300">|</span>
            <span>Support: +1 (555) 123-4567</span>
          </p>
        </div>
      </footer>

      </div>
    </div>
  );
}