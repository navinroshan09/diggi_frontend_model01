import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  MessageCircle, 
  HelpCircle, 
  ChevronRight, 
  FileText, 
  ExternalLink,
  Users,
  Search,
  Quote,
  Zap
} from 'lucide-react';

interface SearchResultsProps {
  data: any;
  onSearch?: (query: string) => void;
}

// Recursive component to render complex data structures nicely (Fallback)
function ValueRenderer({ value, depth = 0 }: { value: any; depth?: number }) {
  if (value === null || value === undefined) return <span className="text-gray-500 italic">No data</span>;

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-500 italic">Empty list</span>;
      return (
        <ul className="space-y-2 mt-2">
          {value.map((item, index) => (
            <li key={index} className="flex gap-2">
              <ChevronRight className="w-4 h-4 text-[#8959c8] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <ValueRenderer value={item} depth={depth + 1} />
              </div>
            </li>
          ))}
        </ul>
      );
    }

    const entries = Object.entries(value);
    if (entries.length === 0) return <span className="text-gray-500 italic">Empty object</span>;

    return (
      <div className={`space-y-4 ${depth > 0 ? 'mt-2 ml-4 p-4 border-l-2 border-[#8959c8]/20 bg-[#f8fafc]/50 rounded-r-lg' : ''}`}>
        {entries.map(([key, val]) => (
          <div key={key} className="space-y-1">
            <h5 className="text-[11px] font-black text-[#8959c8] uppercase tracking-widest">
              {key.replace(/_/g, ' ')}
            </h5>
            <div className="text-slate-600 font-medium">
              <ValueRenderer value={val} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Primitive value
  return <p className="text-slate-700 leading-relaxed font-medium">{String(value)}</p>;
}

export function SearchResults({ data, onSearch }: SearchResultsProps) {
  const getConfidenceLevel = (level: string) => {
    const lowerLevel = level?.toLowerCase();
    if (lowerLevel === 'high') return 'high';
    if (lowerLevel === 'medium') return 'medium';
    if (lowerLevel === 'low') return 'low';
    return 'unknown';
  };

  const hasCategories = data.claim_level_focus || data.multi_source_comparison || data.evidence_traceability || 
                       data.credibility_signals || data.historical_context || data.perspectives || data.exploratory_questions;

  // Key Takeaway: Using first claim as a highlight if available
  const keyTakeaway = data.claim_level_focus?.claims?.[0]?.claim || "Analyzing core narrative shifts and stakeholder perspectives.";

  if (!hasCategories) {
    return (
      <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/5 overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-white/40">
          <CardTitle className="flex items-center gap-2 text-[#8959c8]">
            <FileText className="w-6 h-6" />
            Analysis Overview
          </CardTitle>
          <CardDescription className="text-slate-500 text-base font-medium">Comprehensive AI-generated analysis breakdown</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <ValueRenderer value={data} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* ── LEFT COLUMN (MAIN) ── */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Overall Summary */}
        <Card className="bg-[#8959c8] border-none shadow-2xl shadow-purple-500/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <CardContent className="p-8 relative z-10">
            <div className="text-[11px] font-black text-white/70 tracking-[0.2em] uppercase mb-4">Overall Summary</div>
            <p className="text-xl text-white leading-relaxed font-bold">
              {data.historical_context?.background || "Analysis shows a complex interplay of political and economic narratives..."}
            </p>
          </CardContent>
        </Card>

        {/* Claims In Focus */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/5 overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white/40">
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Claims In Focus</CardTitle>
            <CardDescription className="text-sm text-slate-500 font-medium">Core claims and the evidence cited for each one.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {data.claim_level_focus?.claims?.map((claim: any, i: number) => (
              <div key={i} className="bg-white/50 border border-slate-100 shadow-sm rounded-2xl overflow-hidden p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-5 leading-tight">{claim.claim}</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {claim.actors?.map((actor: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-purple-50 text-[#8959c8] border-purple-100 px-4 py-1.5 font-bold capitalize rounded-lg">
                      {actor}
                    </Badge>
                  ))}
                </div>
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#8959c8]/20"></div>
                  <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-3">Evidence Cited</div>
                  <p className="text-[14.5px] text-slate-700 leading-relaxed font-medium italic">"{claim.evidence || "Not mentioned"}"</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Multi-Source Comparison */}
        {data.multi_source_comparison && (
          <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/5 overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-white/40">
              <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Multi-Source Comparison</CardTitle>
              <CardDescription className="text-sm text-slate-500 font-medium">Where the reporting aligns and diverges across different sources.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Consensus / Alignment Section */}
              {(data.multi_source_comparison.consensus || data.multi_source_comparison.alignment || data.multi_source_comparison.similarities || data.multi_source_comparison.corroboration) && (
                <div className="bg-emerald-50/50 backdrop-blur-sm border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-emerald-700 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                     Areas of Consensus
                  </h3>
                  <ul className="space-y-4">
                    {(Array.isArray(data.multi_source_comparison.consensus || data.multi_source_comparison.alignment || data.multi_source_comparison.similarities || data.multi_source_comparison.corroboration) 
                      ? (data.multi_source_comparison.consensus || data.multi_source_comparison.alignment || data.multi_source_comparison.similarities || data.multi_source_comparison.corroboration)
                      : [data.multi_source_comparison.consensus || data.multi_source_comparison.alignment || data.multi_source_comparison.similarities || data.multi_source_comparison.corroboration]
                    ).slice(0, 3).map((item: string, i: number) => (
                      <li key={i} className="text-[14px] text-slate-700 leading-relaxed pl-5 relative">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60"></span>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disagreement / Divergence Section */}
              {(data.multi_source_comparison.disagreement || data.multi_source_comparison.divergence || data.multi_source_comparison.differences || data.multi_source_comparison.conflicts) && (
                <div className="bg-orange-50/50 backdrop-blur-sm border border-orange-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-orange-700 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                     Areas of Disagreement
                  </h3>
                  <ul className="space-y-4">
                    {(Array.isArray(data.multi_source_comparison.disagreement || data.multi_source_comparison.divergence || data.multi_source_comparison.differences || data.multi_source_comparison.conflicts)
                      ? (data.multi_source_comparison.disagreement || data.multi_source_comparison.divergence || data.multi_source_comparison.differences || data.multi_source_comparison.conflicts)
                      : [data.multi_source_comparison.disagreement || data.multi_source_comparison.divergence || data.multi_source_comparison.differences || data.multi_source_comparison.conflicts]
                    ).slice(0, 3).map((item: string, i: number) => (
                      <li key={i} className="text-[14px] text-slate-700 leading-relaxed pl-5 relative">
                         <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-orange-400 opacity-60"></span>
                         <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Evidence Traceability */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/5 overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white/40">
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Evidence Traceability</CardTitle>
            <CardDescription className="text-sm text-slate-500 font-medium">Verify claims by tracing statements back to cited passages.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {data.evidence_traceability?.evidence?.map((ev: any, i: number) => (
              <div key={i} className="bg-white/50 border border-slate-100 shadow-sm rounded-2xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 uppercase tracking-widest text-[10px] px-4 py-1.5 font-black rounded-lg">{ev.source}</Badge>
                  {ev.link && (
                    <a href={ev.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#8959c8] hover:underline flex items-center gap-1">
                      Source Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-5 leading-relaxed">"{ev.statement}"</h4>
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 relative">
                  <Quote className="absolute top-4 right-4 w-12 h-12 text-slate-200 opacity-20" />
                  <p className="text-[14px] text-slate-600 italic leading-relaxed font-medium relative z-10">"{ev.supporting_passage || "..."}"</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stakeholder Perspectives */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/5 overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white/40">
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Stakeholder Perspectives</CardTitle>
            <CardDescription className="text-sm text-slate-500 font-medium">Understanding different interpretations and viewpoints.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {data.perspectives?.perspectives?.map((p: any, i: number) => {
              const borderColors = ['border-emerald-500', 'border-amber-500', 'border-blue-500'];
              const bgColors = ['bg-emerald-50/50', 'bg-amber-50/50', 'bg-blue-50/50'];
              const textColors = ['text-emerald-700', 'text-amber-700', 'text-blue-700'];
              const idx = i % 3;
              return (
                <div key={i} className="bg-white/60 border border-slate-100 rounded-2xl p-8">
                  <div className={`text-xs font-black ${textColors[idx]} mb-3 uppercase tracking-[0.2em]`}>{p.stakeholder}</div>
                  <p className="text-lg font-bold text-slate-900 leading-snug mb-6">{p.viewpoint}</p>
                  <div className={`border-l-4 ${borderColors[idx]} ${bgColors[idx]} p-6 rounded-r-2xl shadow-inner`}>
                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Analysis Hub</div>
                    <p className="text-[14px] text-slate-700 italic leading-relaxed font-medium">{p.reasoning}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ── RIGHT COLUMN (SIDEBAR) ── */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Key Takeaway */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-500/5 border-l-4 border-l-emerald-500">
          <CardContent className="p-8">
             <div className="text-[10px] font-black text-emerald-600 tracking-[0.2em] uppercase mb-4">Key Insight</div>
             <p className="text-lg font-bold text-slate-900 leading-relaxed">{keyTakeaway}</p>
          </CardContent>
        </Card>

        {/* Credibility Signals */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5 overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white/40 pb-6">
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Credibility Signals</CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">Confidence, reliability, and open uncertainty indicators.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              <Badge className="w-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-5 py-3 text-[11px] font-black uppercase rounded-xl justify-start shadow-sm">
                Source Reliability: {data.credibility_signals?.source_reliability || "High"}
              </Badge>
              <Badge className="w-full bg-blue-50 text-blue-700 border border-blue-100 px-5 py-3 text-[11px] font-black uppercase rounded-xl justify-start shadow-sm">
                Confidence: {data.credibility_signals?.confidence_level || "Medium"}
              </Badge>
            </div>

            {data.credibility_signals?.verified_facts?.length > 0 && (
              <div className="space-y-5">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-3">Verified Facts</div>
                <div className="space-y-4">
                  {data.credibility_signals.verified_facts.map((fact: string, i: number) => (
                    <div key={i} className="flex gap-4 text-[13.5px] text-slate-700 leading-snug items-start font-medium italic">
                      <span className="text-emerald-500 font-black mt-0.5">•</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.credibility_signals?.uncertain_claims?.length > 0 && (
              <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-6 space-y-4 shadow-inner">
                <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Open Uncertainty</div>
                <div className="space-y-4">
                  {data.credibility_signals.uncertain_claims.map((claim: string, i: number) => (
                    <div key={i} className="flex gap-4 text-[13.5px] text-amber-900/80 leading-snug items-start font-bold">
                      <span className="text-amber-500 font-black mt-0.5">/</span>
                      <span>{claim}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historical Context */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5 overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white/40">
             <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Historical Context</CardTitle>
             <CardDescription className="text-xs text-slate-500 font-medium">Timeline and background mapping the story's evolution.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <p className="text-[14.5px] text-slate-700 leading-relaxed font-medium">
               {data.historical_context?.background || "Background analysis pending..."}
            </p>

            {data.historical_context?.timeline?.length > 0 && (
              <div className="relative border-l-2 border-slate-100 ml-2 pl-8 space-y-10">
                {data.historical_context.timeline.map((item: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[2.1rem] top-1 w-4 h-4 rounded-full bg-white border-4 border-[#8959c8] shadow-sm"></div>
                    <div className="text-[11px] font-black text-[#8959c8] mb-1 uppercase tracking-widest">{item.date}</div>
                    <p className="text-[14px] text-slate-800 font-bold leading-snug">{item.event}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Explore Further */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl shadow-purple-500/5 overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white/40">
             <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Explore Further</CardTitle>
             <CardDescription className="text-xs text-slate-500 font-medium">Suggested follow-up angles and related topics to dig into next.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {data.exploratory_questions?.questions?.length > 0 && (
              <ul className="space-y-5">
                {data.exploratory_questions.questions.map((q: string, i: number) => (
                  <li 
                    key={i} 
                    onClick={() => onSearch && onSearch(q)}
                    className="flex gap-4 text-[14.5px] text-slate-700 cursor-pointer"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-200 mt-2 flex-shrink-0"></div>
                    <span className="leading-snug font-bold underline-offset-4 decoration-purple-200 underline">{q}</span>
                  </li>
                ))}
              </ul>
            )}

            {data.exploratory_questions?.related_topics?.length > 0 && (
              <div className="flex flex-wrap gap-2.5 pt-4">
                {data.exploratory_questions.related_topics.map((tag: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => onSearch && onSearch(tag)}
                    className="bg-purple-50 text-[#8959c8] text-xs font-black px-4 py-2 rounded-xl border border-purple-100 uppercase tracking-tighter"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
