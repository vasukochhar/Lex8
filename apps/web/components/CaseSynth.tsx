'use client';

import * as React from 'react';
import { 
  BookOpen, 
  Layers, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  Scale, 
  Activity, 
  Search, 
  RefreshCw, 
  Clock, 
  CornerDownRight,
  Terminal,
  Grid,
  Link2,
  GitCommit
} from 'lucide-react';
import { useDrafterStore } from '../lib/store';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export interface SynthDocument {
  id: string;
  name: string;
  type: 'Pleading' | 'Contract' | 'Deposition' | 'Email';
  date: string;
  characterCount: number;
}

export function CaseSynth() {
  const { addAuditLog } = useDrafterStore();

  const [activeDocId, setActiveDocId] = React.useState<string>('doc-1');
  const [isSynthesizing, setIsSynthesizing] = React.useState<boolean>(false);
  const [synthLogs, setSynthLogs] = React.useState<string[]>([
    'INIT: Document semantic analysis pipeline online.',
    'INDEX: 18 matter exhibits mapped to factual timeline.',
  ]);

  const docs: SynthDocument[] = React.useMemo(() => [
    { id: 'doc-1', name: 'Verified Complaint.pdf', type: 'Pleading', date: '2025-01-12', characterCount: 24500 },
    { id: 'doc-2', name: 'Defendant Answer & Counterclaims.pdf', type: 'Pleading', date: '2025-02-04', characterCount: 18900 },
    { id: 'doc-3', name: 'Master Services Agreement Ex A.pdf', type: 'Contract', date: '2024-03-15', characterCount: 42000 },
    { id: 'doc-4', name: 'Deposition transcript - John Smith.pdf', type: 'Deposition', date: '2025-04-20', characterCount: 95000 },
    { id: 'doc-5', name: 'Email archive - May 2025 updates.msg', type: 'Email', date: '2025-05-14', characterCount: 8200 }
  ], []);

  // Factual Timeline events
  const timelineEvents = [
    { date: 'March 15, 2024', event: 'MSA signed by Acme and Beta', status: 'verified', doc: 'Ex A.pdf' },
    { date: 'May 12, 2025', event: 'John Smith sends termination email', status: 'conflict', doc: 'Email archive.msg' },
    { date: 'May 14, 2025', event: 'Plaintiff alleges breach occurred', status: 'disputed', doc: 'Complaint.pdf' }
  ];

  // Precedent citations inside the active documents
  const precedents = [
    { citation: 'Continental Marine Corp v. Henderson, 299 F.2d 45 (2d Cir. 1962)', confidence: 98, status: 'Active binding precedent' },
    { citation: 'West v. Securities Corp, 312 F.3d 104 (2d Cir. 2001)', confidence: 74, status: 'Distinguishable fact pattern' },
    { citation: 'Henderson v. Continental Marine, 412 F.3d 89 (2d Cir. 2004)', confidence: 12, status: 'HALLUCINATED PRECEDENT' }
  ];

  const activeDoc = React.useMemo(() => {
    return docs.find(d => d.id === activeDocId) || {
      id: 'doc-1',
      name: 'Verified Complaint.pdf',
      type: 'Pleading' as const,
      date: '2025-01-12',
      characterCount: 24500
    };
  }, [docs, activeDocId]);

  const handleRunSynthesis = () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    addAuditLog({
      level: 'info',
      module: 'CaseSynthesis',
      message: `Running case synthesis pipeline for document set (Active: ${activeDoc.name})`
    });

    const timestamp = () => new Date().toTimeString().split(' ')[0];

    setSynthLogs(prev => [...prev, `[${timestamp()}] STREAMING: Parsing semantic embeddings...`]);

    setTimeout(() => {
      setSynthLogs(prev => [...prev, `[${timestamp()}] CONFLICT: Contradiction identified between Email msg (May 12) and Pleading Complaint (May 14).`]);
    }, 450);

    setTimeout(() => {
      setSynthLogs(prev => [...prev, `[${timestamp()}] SUCCESS: Synthesis complete. 3 timeline anomalies flagged.`]);
      setIsSynthesizing(false);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white select-none">
      
      {/* Top Banner Control Header */}
      <div className="bg-neutral-100 border-b border-neutral-200 p-2.5 flex items-center justify-between shrink-0 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#0033aa]" />
          <span className="font-bold text-neutral-800 uppercase tracking-wide">Case Synthesis & Legal Intelligence Workspace</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-bold">Workspace:</span>
          <span className="bg-neutral-200 text-neutral-800 border border-neutral-300 px-1.5 py-0.2 font-bold">Acme Litigation File</span>
          
          <Button
            variant="bloomberg"
            size="sm"
            disabled={isSynthesizing}
            onClick={handleRunSynthesis}
            className="h-5.5 px-2 bg-[#0033aa] hover:bg-[#0033aa]/90 text-white rounded-none cursor-pointer gap-1"
          >
            {isSynthesizing ? <Activity className="h-3 w-3 animate-pulse" /> : <RefreshCw className="h-3 w-3" />}
            <span>Run Factual Synthesis</span>
          </Button>
        </div>
      </div>

      {/* Main Workspace Panels Layout */}
      <div className="flex-1 flex min-h-0 divide-x divide-neutral-200">
        
        {/* LEFT COLUMN: MULTI-DOCUMENT LIST & EVIDENCE CLUSTERING */}
        <div className="w-1/4 flex flex-col min-h-0 bg-neutral-50 p-3 space-y-3 shrink-0">
          
          {/* Document list */}
          <div className="border border-neutral-200 bg-white p-2.5 space-y-2">
            <h3 className="font-mono font-bold text-neutral-800 text-[10px] uppercase tracking-wide border-b border-neutral-100 pb-1 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#0033aa]" />
              <span>Evidence Documents</span>
            </h3>

            <div className="space-y-1">
              {docs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setActiveDocId(d.id);
                    addAuditLog({
                      level: 'info',
                      module: 'CaseSynthesis',
                      message: `Synthesis viewport focused to ${d.name}`
                    });
                  }}
                  className={cn(
                    "w-full text-left font-mono text-[9px] px-2 py-1.5 border transition-all flex flex-col gap-0.5 rounded-none cursor-pointer",
                    activeDocId === d.id
                      ? "bg-white border-[#0033aa] text-neutral-900 shadow-xs font-semibold"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                  )}
                >
                  <span className="truncate">{d.name}</span>
                  <div className="flex justify-between text-[7px] text-neutral-400 font-normal">
                    <span>{d.type}</span>
                    <span>{d.date}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Evidence clustering visualization */}
          <div className="border border-neutral-200 bg-white p-2.5 space-y-2">
            <h3 className="font-mono font-bold text-neutral-800 text-[10px] uppercase tracking-wide border-b border-neutral-100 pb-1 flex items-center gap-1.5">
              <Grid className="h-3.5 w-3.5 text-[#0033aa]" />
              <span>Evidence Clusters</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
              
              {/* Cluster 1 */}
              <div className="border border-neutral-100 bg-neutral-50 p-1.5 space-y-1 relative">
                <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-bold text-neutral-800 block text-[8px]">CONTRACTS</span>
                <span className="text-neutral-400 text-[7px]">3 documents</span>
              </div>

              {/* Cluster 2 */}
              <div className="border border-neutral-100 bg-neutral-50 p-1.5 space-y-1 relative">
                <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#0033aa] animate-pulse" />
                <span className="font-bold text-neutral-800 block text-[8px]">COMMS / MAIL</span>
                <span className="text-neutral-400 text-[7px]">12 documents</span>
              </div>

              {/* Cluster 3 */}
              <div className="border border-neutral-100 bg-neutral-50 p-1.5 space-y-1 relative">
                <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="font-bold text-neutral-800 block text-[8px]">DEPOSITIONS</span>
                <span className="text-neutral-400 text-[7px]">2 documents</span>
              </div>

              {/* Cluster 4 */}
              <div className="border border-neutral-100 bg-neutral-50 p-1.5 space-y-1 relative">
                <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span className="font-bold text-neutral-800 block text-[8px]">EXHIBITS</span>
                <span className="text-neutral-400 text-[7px]">8 documents</span>
              </div>

            </div>
          </div>

        </div>

        {/* CENTER COLUMN: CASE SUMMARY, ARGUMENTS & PRECEDENT LINK GRAPH */}
        <div className="w-1/2 flex flex-col min-h-0 bg-white p-3 space-y-3">
          
          {/* AI Case Summary */}
          <div className="border border-neutral-200 p-3 bg-neutral-50/50 space-y-1.5">
            <span className="block font-mono text-[8px] text-neutral-400 font-bold uppercase tracking-wider">AI-Generated Case Summary ({activeDoc.name})</span>
            <p className="font-mono text-[9px] text-neutral-700 leading-relaxed">
              This matter concerns a breach of contract claim relating to Master Services Agreement Ex A.pdf. 
              The plaintiff asserts breach due to unilateral modifications on May 14th. The defense raises 
              lack of mutual assent and points to previous termination notices sent via email on May 12th.
            </p>
          </div>

          {/* Key Argument Extractions & Conflicts */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Arguments Card */}
            <div className="border border-neutral-200 p-2.5 space-y-2">
              <span className="block font-mono text-[9px] text-[#0033aa] font-bold uppercase tracking-wide border-b border-neutral-100 pb-1 flex items-center gap-1">
                <FileText className="h-3 w-3 text-[#0033aa]" />
                <span>Argument Extractions</span>
              </span>
              <div className="font-mono text-[8px] text-neutral-600 space-y-1.5 leading-normal">
                <div>
                  <strong className="text-neutral-800 block">Mutual Assent Gap:</strong>
                  <span>Breach asserts unilateral changes. Ex A requires written mutual changes.</span>
                </div>
                <div>
                  <strong className="text-neutral-800 block">Timely Notice:</strong>
                  <span>Defendant alleges termination was dispatched prior to modification date.</span>
                </div>
              </div>
            </div>

            {/* Contradiction card */}
            <div className="border border-red-200 p-2.5 bg-red-50/20 space-y-2">
              <span className="block font-mono text-[9px] text-red-700 font-bold uppercase tracking-wide border-b border-red-200 pb-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <span>Conflict Detected</span>
              </span>
              <div className="font-mono text-[8px] text-neutral-600 space-y-1.5 leading-normal">
                <div>
                  <strong className="text-red-700 block">Pleading contradiction:</strong>
                  <span>Complaint alleges breach on May 14. Defendant exhibits show termination notices sent May 12.</span>
                </div>
                <div>
                  <strong className="text-red-700 block">Custodian Conflict:</strong>
                  <span>Deposition Smith claims no oral changes; Email thread indicates verbal alignment.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Precedent Relationship Graph Mock */}
          <div className="border border-neutral-200 p-2.5 flex-1 flex flex-col min-h-0 space-y-2">
            <span className="block font-mono text-[9px] text-neutral-800 font-bold uppercase tracking-wide border-b border-neutral-100 pb-1 flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-[#0033aa]" />
              <span>Precedent Citation Citation Mapping</span>
            </span>

            <div className="flex-1 border border-neutral-100 bg-neutral-50/50 p-2 flex flex-col justify-center space-y-2 font-mono text-[9px] select-none">
              
              {precedents.map((prec, i) => (
                <div key={i} className="flex items-center justify-between border border-neutral-200 bg-white p-1.5 relative">
                  <div className="space-y-0.5">
                    <span className="font-bold text-neutral-800 block truncate max-w-[280px]">{prec.citation}</span>
                    <span className="text-[7px] text-neutral-400 block">{prec.status}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[7px] text-neutral-400 block font-bold">CONFIDENCE</span>
                      <span className={cn(
                        "font-bold text-[8px]",
                        prec.confidence > 80 && "text-green-700",
                        prec.confidence > 50 && prec.confidence <= 80 && "text-amber-600",
                        prec.confidence <= 50 && "text-red-700"
                      )}>{prec.confidence}%</span>
                    </div>
                    
                    <div className="h-6 w-px bg-neutral-200" />
                    
                    <span className={cn(
                      "px-1 py-0.2 border text-[7px] font-bold uppercase",
                      prec.confidence > 80 && "bg-green-50 border-green-200 text-green-700",
                      prec.confidence > 50 && prec.confidence <= 80 && "bg-amber-50 border-amber-200 text-amber-700",
                      prec.confidence <= 50 && "bg-red-50 border-red-200 text-red-700"
                    )}>
                      {prec.confidence > 50 ? 'VALID' : 'REJECT'}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: FACTUAL TIMELINE & STRATEGY REC */}
        <div className="w-1/4 flex flex-col min-h-0 bg-neutral-50 p-3 space-y-3 shrink-0">
          
          {/* Timeline View */}
          <div className="border border-neutral-200 bg-white p-2.5 space-y-2">
            <h3 className="font-mono font-bold text-neutral-800 text-[10px] uppercase tracking-wide border-b border-neutral-100 pb-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#0033aa]" />
              <span>Factual Timeline</span>
            </h3>

            <div className="relative pl-3 border-l border-neutral-200 space-y-3 font-mono text-[8px] text-neutral-600 select-none">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative">
                  <div className={cn(
                    "absolute -left-[15.5px] top-0.5 h-1.5 w-1.5 rounded-full border border-neutral-200",
                    ev.status === 'verified' && "bg-green-500",
                    ev.status === 'conflict' && "bg-red-500 animate-pulse",
                    ev.status === 'disputed' && "bg-amber-500"
                  )} />
                  <span className="text-neutral-400 block font-bold">{ev.date}</span>
                  <span className="text-neutral-800 font-bold block">{ev.event}</span>
                  <span className="text-[7px] text-neutral-400 block font-medium">Source: {ev.doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Recommendation */}
          <div className="border border-neutral-200 bg-white p-2.5 space-y-2 flex-1 flex flex-col min-h-0">
            <h3 className="font-mono font-bold text-neutral-800 text-[10px] uppercase tracking-wide border-b border-neutral-100 pb-1.5 flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-[#0033aa]" />
              <span>Strategy Sidebar</span>
            </h3>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1 font-mono text-[9px] leading-relaxed text-neutral-600">
              <div className="p-2 border border-neutral-200 bg-neutral-50/50">
                <span className="font-bold text-neutral-800 block text-[8px] uppercase">DISCOVERY RECOMMENDATION</span>
                <span>Issue requests for production regarding May 12th server message logs to resolve the oral assent conflict.</span>
              </div>
              <div className="p-2 border border-neutral-200 bg-neutral-50/50">
                <span className="font-bold text-neutral-800 block text-[8px] uppercase">PRECEDENT ACTION</span>
                <span>Substituted Henderson citation with Continental Marine precedent (98% confidence rate matched).</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Terminal Live Observability Logs */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-2 shrink-0 select-none">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-1.5 text-neutral-500 font-mono text-[9px]">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-green-500" />
            <span className="text-green-400 font-bold uppercase tracking-wider">Semantic Analysis pipeline audit log</span>
          </div>
          <span>Processor: BERT-Legal v4</span>
        </div>

        <div className="font-mono text-[9px] space-y-0.5 h-16 overflow-y-auto leading-normal text-green-500/90 max-h-16">
          {synthLogs.map((log, index) => (
            <div key={index} className="truncate">
              <span className="text-green-700 pr-1">{'>'}</span>
              {log}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
