import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getSummary } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Search, Sparkles, AlertCircle, TrendingUp, Clock, FileText, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResponse, setSearchResponse] = useState<any>(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  useEffect(() => {
    if (location.state?.response && location.state?.query) {
      setSearchResponse(location.state.response);
      setCurrentSearchQuery(location.state.query);
      setQuery(location.state.query);
      // Clear state after reading to prevent re-triggering on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName') || userEmail?.split('@')[0] || 'User';

  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResponse(null);

    try {
      const data = await getSummary(queryToSearch);

      if (data.status === 'success' || (data && data.status !== 'vague' && data.status !== 'error')) {
        // Successful analysis -> Navigate to results page
        navigate('/results', { state: { response: data, query: queryToSearch } });
        setLoading(false);
      } else {
        // Vague or Error -> stay on dashboard
        setSearchResponse(data);
        setCurrentSearchQuery(queryToSearch);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch results. Please try again.');
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchResponse(null);
    setQuery('');
    setError(null);
  };

  const exampleQueries = [
    "Climate change impact on agriculture",
    "Latest developments in AI technology",
    "Economic policies and inflation rates",
    "Renewable energy adoption worldwide"
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <div 
        className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-[#8959c8] to-[#cc78b8] bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>
          <p className="text-lg text-slate-600">Start analyzing news with AI-powered insights</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Search Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Card */}
            <Card className="shadow-2xl shadow-purple-500/5 bg-white/70 backdrop-blur-xl border-white/40">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
                    <Search className="w-6 h-6 text-[#8959c8]" />
                    {searchResponse ? 'Query Analysis' : 'Search & Analyze'}
                  </CardTitle>
                  {searchResponse && (
                    <Button
                      variant="ghost"
                      onClick={resetSearch}
                      className="text-[#cc78b8] hover:bg-[#8959c8]/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Try New Search
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {searchResponse
                    ? `Results for: "${currentSearchQuery}"`
                    : 'Enter a news topic, claim, or question to get comprehensive analysis'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!searchResponse && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearch();
                    }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        placeholder="e.g., 'COVID-19 vaccine effectiveness' or 'Climate change policies'"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-12 h-14 text-lg border-slate-200 focus:border-[#8959c8]/50 bg-white/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !query.trim()}
                      className="w-full h-12 bg-gradient-to-r from-[#8959c8] to-[#cc78b8] hover:from-[#9761cb] hover:to-[#df8fd0] text-white text-lg shadow-lg shadow-purple-500/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          DIGG IT
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Example Queries - only show if no results yet */}
                {!searchResponse && !loading && (
                  <div className="pt-4 border-t border-[#8959c8]/20">
                    <p className="text-sm font-medium text-gray-500 mb-3">IF YOU DON'T HAVE A QUERY, TRY THESE EXAMPLES:</p>
                    <div className="flex flex-wrap gap-2">
                      {exampleQueries.map((exampleQuery, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuery(exampleQuery);
                            handleSearch(exampleQuery);
                          }}
                          className="border-[#8959c8]/30 text-[#cc78b8] hover:bg-[#8959c8]/10 text-xs"
                        >
                          {exampleQuery}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vague or Error Inline Area */}
            {searchResponse && (
              <div>
                {searchResponse.status === 'error' ? (
                  <Card className="border-red-200 bg-red-50/50 backdrop-blur-md shadow-xl shadow-red-500/5">
                    <CardContent className="p-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-3">Analysis Failed</h2>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">{searchResponse.message || "We encountered an error while generating your summary. Please try a different query."}</p>
                      <Button
                        onClick={resetSearch}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 rounded-xl transition-all shadow-lg shadow-slate-900/10"
                      >
                        Try Different Query
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-amber-200 bg-amber-50/50 backdrop-blur-md shadow-xl shadow-amber-500/5">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-5 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                          <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="pt-1">
                          <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Query Needs Refinement</h2>
                          <p className="text-slate-600 leading-relaxed font-medium">{searchResponse.message}</p>
                        </div>
                      </div>

                      {searchResponse.suggestions && searchResponse.suggestions.length > 0 && (
                        <div className="border-t border-amber-200 pt-8 mt-2">
                          <div className="flex items-center gap-2 mb-5">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <h3 className="text-xs font-black text-amber-900 uppercase tracking-widest">Suggested Specific Topics</h3>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {searchResponse.suggestions.map((suggestion: string, index: number) => (
                              <Button
                                key={index}
                                variant="ghost"
                                onClick={() => handleSearch(suggestion)}
                                className="text-left justify-start h-auto py-4 px-5 bg-white/60 hover:bg-white border border-amber-200/30 text-slate-700 hover:text-[#8959c8] rounded-2xl transition-all group shadow-sm hover:shadow-md"
                              >
                                <Search className="w-4 h-4 mr-4 text-amber-500/50 group-hover:text-[#8959c8] flex-shrink-0" />
                                <span className="line-clamp-2 text-[13.5px] font-bold leading-snug">{suggestion}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Info Banner - Hide if results are showing */}
            {!searchResponse && (
              <Card className="bg-gradient-to-r from-[#8959c8] to-[#cc78b8] border-0 text-white shadow-xl shadow-purple-500/30 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2">Smart AI Analysis</h3>
                      <p className="text-purple-50 text-sm leading-relaxed font-medium">
                        Our advanced engine analyzes multiple sources, verifies claims, and provides credibility scores
                        to help you make informed decisions in real-time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Features */}
            <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-900">Analysis Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#8959c8]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Multi-Source</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Compare across sources</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#8959c8]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Context</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Timeline analysis</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#8959c8]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Traceability</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Source verification</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-slate-900 border-none shadow-xl shadow-slate-900/10 p-5 rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8"></div>

              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-lg bg-white/10 border border-white/10 relative z-10">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span className="text-[10px] text-white font-black uppercase tracking-widest">Pro Tips</span>
              </div>

              <CardContent className="space-y-4 p-0 relative z-10">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                  <p className="text-slate-300 leading-snug">
                    <span className="text-white font-bold">Be Specific:</span> Include key details for better multi-source verification
                  </p>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 flex-shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                  <p className="text-slate-300 leading-snug">
                    <span className="text-white font-bold">Ask Questions:</span> Full questions work best for deep-dive analysis
                  </p>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-purple-400 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                  <p className="text-slate-300 leading-snug">
                    <span className="text-white font-bold">Try Suggestions:</span> Use recommendations if the initial query is too vague
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Visual Card */}
            <Card className="border-white/40 bg-white/70 backdrop-blur-xl overflow-hidden shadow-xl shadow-purple-500/5 group">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3NjIyMDMzOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Analytics"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent"></div>
              </div>
              <CardContent className="p-5 relative z-10">
                <h4 className="font-bold text-sm text-slate-900 mb-1">Detailed Reports</h4>
                <p className="text-xs text-slate-500 font-medium">Synthesized multi-source insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div >
  );
}
