import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { SearchResults } from './SearchResults';
import { ArrowLeft, Search, AlertCircle, Sparkles } from 'lucide-react';
import { getSummary } from '../services/api';

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { response: initialResponse, query: initialQuery } = location.state || {};
  
  const [response, setResponse] = useState(initialResponse);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  
  // If no data, redirect to dashboard
    if (!response || !currentQuery) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <Card className="max-w-md text-center bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/10">
          <CardContent className="p-10">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertCircle className="w-8 h-8 text-[#8959c8]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Results Found</h2>
            <p className="text-slate-600 mb-8 font-medium">Please start a search from the dashboard to view analysis.</p>
            <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-[#8959c8] to-[#cc78b8] hover:from-[#9761cb] hover:to-[#df8fd0] text-white h-12 rounded-xl shadow-lg shadow-purple-500/20"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await getSummary(query);
      if (data.status === 'vague' || data.status === 'error') {
        // If it's vague, we go back to dashboard to show refinement
        navigate('/dashboard', { state: { response: data, query } });
      } else {
        setResponse(data);
        setCurrentQuery(query);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">

      <div 
        className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10"
      >
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-[#8959c8] hover:bg-white/50 backdrop-blur-sm px-0 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-bold">Back to Search</span>
          </Button>
          
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-purple-500/5 border border-white/40 p-8">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8959c8] to-[#cc78b8] flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                <Search className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">Analysis Report</h1>
                <p className="text-slate-600 flex items-center gap-2 text-lg">
                  <span className="font-bold text-[#8959c8]">Query:</span>
                  <span className="italic font-medium">"{currentQuery}"</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Display */}
        <div className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-[#8959c8] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {response.status === 'success' || (response && response.status !== 'vague' && response.status !== 'error') ? (
              <div className="space-y-16">
                {Array.isArray(response?.status === 'success' ? response.data : response) 
                  ? (response?.status === 'success' ? response.data : response).map((item: any, idx: number) => (
                      <div key={idx} className="relative">
                        {idx > 0 && <div className="absolute -top-8 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-purple-300/30 to-transparent"></div>}
                        <SearchResults data={item} onSearch={handleSearch} />
                      </div>
                    ))
                  : <SearchResults 
                      data={response?.status === 'success' ? response.data : response} 
                      onSearch={handleSearch}
                    />
                }
              </div>
            ) : (
                <div className="text-center p-12 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl shadow-amber-500/5">
                    <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Query Needs Refinement</h2>
                    <p className="text-slate-600 mb-8 font-medium">{response.message || "Please return to the dashboard to refine your search."}</p>
                    <Button 
                      onClick={() => navigate('/dashboard', { state: { response, query: currentQuery } })}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-amber-500/20"
                    >
                        Refine on Dashboard
                    </Button>
                </div>
            )}
        </div>

        {/* Action Footer */}
        <div className="mt-12 flex justify-center">
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white h-14 px-10 rounded-2xl shadow-xl shadow-slate-900/10 font-bold group"
            >
              <Search className="w-5 h-5 mr-3" />
              Analyze Another Topic
            </Button>
        </div>
      </div>
    </div>
  );
}
