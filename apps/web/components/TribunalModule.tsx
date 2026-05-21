'use client';

import * as React from 'react';
import { 
  Scale, 
  UserCheck, 
  MessageSquare, 
  Vote, 
  Percent, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Play,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Activity
} from 'lucide-react';
import { useDrafterStore } from '../lib/store';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export interface JurorMessage {
  id: string;
  sender: 'Alpha' | 'Beta';
  timestamp: string;
  role: 'argument' | 'rebuttal' | 'verdict';
  text: string;
}

export interface AdjudicationCase {
  id: string;
  caseName: string;
  citationIssue: string;
  status: 'Pending' | 'Split Decision' | 'Approved' | 'Rejected';
  slaTimeLeft: string;
  currentStep: number; // 1 to 4
  jurorAlpha: {
    name: string;
    model: string;
    vote: 'APPROVE' | 'REJECT' | 'PENDING';
    confidence: number;
    messages: JurorMessage[];
  };
  jurorBeta: {
    name: string;
    model: string;
    vote: 'APPROVE' | 'REJECT' | 'PENDING';
    confidence: number;
    messages: JurorMessage[];
  };
  summary: string;
  suggestedAction: string;
}

export function TribunalModule() {
  const { addAuditLog, setActiveModule, setDraftText } = useDrafterStore();

  const cases: AdjudicationCase[] = React.useMemo(() => [
    {
      id: 'tribunal-case-1',
      caseName: 'Acme Corp v. Beta LLC',
      citationIssue: 'Henderson v. Continental Marine, 412 F.3d 89 (2d Cir. 2004)',
      status: 'Rejected',
      slaTimeLeft: '02:45 remaining',
      currentStep: 4,
      jurorAlpha: {
        name: 'Juror Model Alpha',
        model: 'Llama-3-Legal-Instruct (70B)',
        vote: 'REJECT',
        confidence: 98,
        messages: [
          {
            id: 'm1',
            sender: 'Alpha',
            timestamp: '16:44:02',
            role: 'argument',
            text: 'I have cross-referenced the Second Circuit reporter database for the year 2004. Volume 412 F.3d starts at page 1 and lists no case matching Henderson v. Continental Marine. The actual case at page 89 is United States v. Ramirez. The citation is a complete hallucination generated during drafting sequence Lane 2.'
          },
          {
            id: 'm2',
            sender: 'Alpha',
            timestamp: '16:44:20',
            role: 'rebuttal',
            text: 'Juror Beta claims the citation could refer to a state court appeal, but the reporter format F.3d explicitly denotes a Federal Appellate reporter. State appeals would not reside in the Federal Reporter Series. This is a severe compliance violation.'
          }
        ]
      },
      jurorBeta: {
        name: 'Juror Model Beta',
        model: 'Claude-3-Sonnet-Judicial (v2)',
        vote: 'REJECT',
        confidence: 94,
        messages: [
          {
            id: 'm3',
            sender: 'Beta',
            timestamp: '16:44:11',
            role: 'argument',
            text: 'Agreed. I searched the Lexis precedents and did not locate any federal maritime contract precedent titled Henderson in the Second Circuit under this citation. Continental Marine was involved in a 1999 case (305 F.3d 112) but this is unrelated.'
          },
          {
            id: 'm4',
            sender: 'Beta',
            timestamp: '16:44:31',
            role: 'rebuttal',
            text: 'We must flag this immediately and halt the stream to prevent filing standard sanctions under Rule 11. I recommend modifying the text to substitute with the valid precedent Continental Marine Corp v. Henderson, 299 F.2d 45 (2d Cir. 1962).'
          }
        ]
      },
      summary: 'The citation to Henderson v. Continental Marine is confirmed as a hallucination. The volume 412 F.3d page 89 resolves to United States v. Ramirez, which relates to a criminal drug appeal, not maritime contract disputes.',
      suggestedAction: 'Substitute with valid precedent Continental Marine Corp v. Henderson, 299 F.2d 45 (2d Cir. 1962).'
    },
    {
      id: 'tribunal-case-2',
      caseName: 'FTC v. Horizon Telecom',
      citationIssue: 'State Blue Sky Law Preemption of SEC Rules',
      status: 'Split Decision',
      slaTimeLeft: '05:12 remaining',
      currentStep: 3,
      jurorAlpha: {
        name: 'Juror Model Alpha',
        model: 'Llama-3-Legal-Instruct (70B)',
        vote: 'APPROVE',
        confidence: 82,
        messages: [
          {
            id: 'c2-m1',
            sender: 'Alpha',
            timestamp: '16:45:00',
            role: 'argument',
            text: 'Federal preemption is clear under the National Securities Markets Improvement Act of 1996 (NSMIA). State courts have repeatedly deferred to federal authority on national mutual fund registrations.'
          }
        ]
      },
      jurorBeta: {
        name: 'Juror Model Beta',
        model: 'Claude-3-Sonnet-Judicial (v2)',
        vote: 'REJECT',
        confidence: 76,
        messages: [
          {
            id: 'c2-m2',
            sender: 'Beta',
            timestamp: '16:45:12',
            role: 'argument',
            text: 'Incorrect. The state blue sky law contains an explicit fraud savings clause that permits local enforcement. Refer to local ruleset SDNY playbook Section 4.'
          }
        ]
      },
      summary: 'Adjudication remains in split state. Juror Alpha advocates federal preemption under NSMIA while Juror Beta flags localized fraud exemptions.',
      suggestedAction: 'Human intervention is required to resolve the jurisdictional boundary dispute.'
    },
    {
      id: 'tribunal-case-3',
      caseName: 'In re Sentinel Capital Group',
      citationIssue: 'Redacted Patent Licensing Exhibit C Reference',
      status: 'Approved',
      slaTimeLeft: '08:44 remaining',
      currentStep: 4,
      jurorAlpha: {
        name: 'Juror Model Alpha',
        model: 'Llama-3-Legal-Instruct (70B)',
        vote: 'APPROVE',
        confidence: 95,
        messages: [
          {
            id: 'c3-m1',
            sender: 'Alpha',
            timestamp: '16:43:10',
            role: 'argument',
            text: 'The reference to Exhibit C has been cross-referenced with the docket filing. The sealing order of May 14th protects this disclosure from un-redacted filing.'
          }
        ]
      },
      jurorBeta: {
        name: 'Juror Model Beta',
        model: 'Claude-3-Sonnet-Judicial (v2)',
        vote: 'APPROVE',
        confidence: 91,
        messages: [
          {
            id: 'c3-m2',
            sender: 'Beta',
            timestamp: '16:43:25',
            role: 'argument',
            text: 'Confirmed. The redacted text matches the local SDNY security classification requirements.'
          }
        ]
      },
      summary: 'Approved. Reference is in full compliance with protective order restrictions.',
      suggestedAction: 'Signed off. Ready for filing export.'
    }
  ], []);

  const [activeCaseId, setActiveCaseId] = React.useState<string>('tribunal-case-1');
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = React.useState<string[]>([
    'INIT: Tribunal core loaded.',
    'LISTEN: Awaiting stream intercept triggers...',
  ]);

  const activeCase = React.useMemo<AdjudicationCase>(() => {
    const found = cases.find(c => c.id === activeCaseId);
    if (found) return found;
    return cases[0] as AdjudicationCase;
  }, [cases, activeCaseId]);

  const handleSimulateDeliberation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    addAuditLog({
      level: 'info',
      module: 'TribunalAdjudicator',
      message: `Deliberation simulation requested for ${activeCase.caseName}`
    });

    const timestamp = () => new Date().toTimeString().split(' ')[0];

    setSimulationLogs(prev => [...prev, `[${timestamp()}] START: Parallel juror consensus requested.`]);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, `[${timestamp()}] COMPILING: Running Juror Alpha legal analysis...`]);
    }, 400);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, `[${timestamp()}] COMPILING: Running Juror Beta precedent scans...`]);
    }, 800);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, `[${timestamp()}] CONSENSUS: Juror Alpha voted: ${activeCase.jurorAlpha.vote} (Conf: ${activeCase.jurorAlpha.confidence}%)`]);
    }, 1200);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, `[${timestamp()}] CONSENSUS: Juror Beta voted: ${activeCase.jurorBeta.vote} (Conf: ${activeCase.jurorBeta.confidence}%)`]);
      setIsSimulating(false);
    }, 1600);
  };

  // Perform quick resolution flow
  const handleApplyResolution = () => {
    if (activeCase.id === 'tribunal-case-1') {
      // Substitute with real precedent mock in workspace
      setDraftText(
        "AND NOW, comes the plaintiff Acme Corp., and submits this Motion for Summary Judgment. " +
        "The Defendant's contention that maritime contract law permits unilateral modifications is contradicted by " +
        "established precedent. See Continental Marine Corp v. Henderson, 299 F.2d 45 (2d Cir. 1962) (holding that " +
        "mutual assent is required for maritime alterations)."
      );
      addAuditLog({
        level: 'info',
        module: 'DrafterWorkspace',
        message: 'Corrected precedent (Continental Marine Corp v. Henderson) applied to Draft text.'
      });
      setActiveModule('drafter');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white select-none">
      
      {/* Top Banner Control and Case Selector */}
      <div className="bg-neutral-100 border-b border-neutral-200 p-2.5 flex items-center justify-between shrink-0 font-mono text-[10px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Scale className="h-4 w-4 text-[#0033aa]" />
            <span className="font-bold text-neutral-800 uppercase tracking-wide">Tribunal Command Console</span>
          </div>

          <select
            value={activeCaseId}
            onChange={(e) => {
              setActiveCaseId(e.target.value);
              addAuditLog({
                level: 'info',
                module: 'TribunalAdjudicator',
                message: `Active tribunal matter swapped to ${e.target.value}`
              });
            }}
            className="bg-white border border-neutral-300 rounded-none px-2 py-0.5 text-[9px] text-neutral-700 focus:outline-hidden h-5.5 cursor-pointer font-bold"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>{c.caseName} — {c.status}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-bold">SLA timer:</span>
          <span className="bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 font-bold">{activeCase.slaTimeLeft}</span>
          
          <Button
            variant="bloomberg"
            size="sm"
            disabled={isSimulating}
            onClick={handleSimulateDeliberation}
            className="h-5.5 px-2 bg-[#0033aa] hover:bg-[#0033aa]/90 text-white rounded-none cursor-pointer gap-1"
          >
            {isSimulating ? <Activity className="h-3 w-3 animate-pulse" /> : <Play className="h-3 w-3" />}
            <span>Re-run Debate</span>
          </Button>
        </div>
      </div>

      {/* Governance Timeline Stepper */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-3 py-2 flex items-center justify-between shrink-0 font-mono text-[9px] text-neutral-400 select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-bold text-neutral-700">Governance Timeline:</span>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-center max-w-lg mx-auto">
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center font-bold text-[8px]",
              activeCase.currentStep >= 1 ? "bg-[#0033aa] text-white" : "bg-neutral-200 text-neutral-500"
            )}>1</span>
            <span className={cn("font-medium", activeCase.currentStep >= 1 ? "text-neutral-800 font-bold" : "text-neutral-400")}>Intercept</span>
          </div>
          <ArrowRight className="h-3 w-3 text-neutral-300" />
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center font-bold text-[8px]",
              activeCase.currentStep >= 2 ? "bg-[#0033aa] text-white" : "bg-neutral-200 text-neutral-500"
            )}>2</span>
            <span className={cn("font-medium", activeCase.currentStep >= 2 ? "text-neutral-800 font-bold" : "text-neutral-400")}>Model Debate</span>
          </div>
          <ArrowRight className="h-3 w-3 text-neutral-300" />
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center font-bold text-[8px]",
              activeCase.currentStep >= 3 ? "bg-[#0033aa] text-white" : "bg-neutral-200 text-neutral-500"
            )}>3</span>
            <span className={cn("font-medium", activeCase.currentStep >= 3 ? "text-neutral-800 font-bold" : "text-neutral-400")}>Consensus Vote</span>
          </div>
          <ArrowRight className="h-3 w-3 text-neutral-300" />
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center font-bold text-[8px]",
              activeCase.currentStep >= 4 ? "bg-[#0033aa] text-white" : "bg-neutral-200 text-neutral-500"
            )}>4</span>
            <span className={cn("font-medium", activeCase.currentStep >= 4 ? "text-neutral-800 font-bold" : "text-neutral-400")}>Adjudicated</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="font-bold text-neutral-500">Verdict:</span>
          <span className={cn(
            "px-1.5 py-0.2 border text-[8px] font-bold uppercase tracking-wider",
            activeCase.status === 'Approved' && "bg-green-50 border-green-200 text-green-700",
            activeCase.status === 'Rejected' && "bg-red-50 border-red-200 text-red-700",
            activeCase.status === 'Split Decision' && "bg-amber-50 border-amber-200 text-amber-700",
            activeCase.status === 'Pending' && "bg-neutral-50 border-neutral-200 text-neutral-500"
          )}>
            {activeCase.status}
          </span>
        </div>
      </div>

      {/* Main Debate Grid View */}
      <div className="flex-1 flex min-h-0 divide-x divide-neutral-200">
        
        {/* JUROR ALPHA COLUMN */}
        <div className="w-1/2 flex flex-col min-h-0 bg-white">
          <div className="bg-neutral-50 p-2.5 border-b border-neutral-200 flex items-center justify-between shrink-0 font-mono text-[9px]">
            <div className="space-y-0.5">
              <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-wide block">JUROR ALPHA</span>
              <span className="font-bold text-neutral-800">{activeCase.jurorAlpha.model}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[8px] text-neutral-400 block font-bold">CONFIDENCE</span>
                <span className="font-bold text-[#0033aa]">{activeCase.jurorAlpha.confidence}%</span>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <span className={cn(
                "px-1.5 py-1 border text-[9px] font-bold uppercase",
                activeCase.jurorAlpha.vote === 'APPROVE' && "bg-green-50 border-green-200 text-green-700",
                activeCase.jurorAlpha.vote === 'REJECT' && "bg-red-50 border-red-200 text-red-700",
                activeCase.jurorAlpha.vote === 'PENDING' && "bg-neutral-50 border-neutral-200 text-neutral-500"
              )}>
                {activeCase.jurorAlpha.vote}
              </span>
            </div>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {activeCase.jurorAlpha.messages.map((m) => (
                <div key={m.id} className="border border-neutral-200 p-2.5 space-y-1.5 bg-neutral-50/50">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-1 text-[8px] font-mono text-neutral-400">
                    <span className="font-bold uppercase text-[#0033aa]">{m.role} phase</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="font-mono text-[9px] text-neutral-700 leading-relaxed font-medium">
                    {m.text}
                  </p>
                </div>
              ))}

              {isSimulating && (
                <div className="border border-neutral-200 border-dashed p-3 text-center bg-neutral-50">
                  <Activity className="h-4 w-4 animate-pulse text-[#0033aa] mx-auto mb-1.5" />
                  <span className="font-mono text-[9px] text-neutral-400">Juror Alpha streaming reasoning log...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* JUROR BETA COLUMN */}
        <div className="w-1/2 flex flex-col min-h-0 bg-white">
          <div className="bg-neutral-50 p-2.5 border-b border-neutral-200 flex items-center justify-between shrink-0 font-mono text-[9px]">
            <div className="space-y-0.5">
              <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-wide block">JUROR BETA</span>
              <span className="font-bold text-neutral-800">{activeCase.jurorBeta.model}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[8px] text-neutral-400 block font-bold">CONFIDENCE</span>
                <span className="font-bold text-[#0033aa]">{activeCase.jurorBeta.confidence}%</span>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <span className={cn(
                "px-1.5 py-1 border text-[9px] font-bold uppercase",
                activeCase.jurorBeta.vote === 'APPROVE' && "bg-green-50 border-green-200 text-green-700",
                activeCase.jurorBeta.vote === 'REJECT' && "bg-red-50 border-red-200 text-red-700",
                activeCase.jurorBeta.vote === 'PENDING' && "bg-neutral-50 border-neutral-200 text-neutral-500"
              )}>
                {activeCase.jurorBeta.vote}
              </span>
            </div>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {activeCase.jurorBeta.messages.map((m) => (
                <div key={m.id} className="border border-neutral-200 p-2.5 space-y-1.5 bg-neutral-50/50">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-1 text-[8px] font-mono text-neutral-400">
                    <span className="font-bold uppercase text-[#0033aa]">{m.role} phase</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="font-mono text-[9px] text-neutral-700 leading-relaxed font-medium">
                    {m.text}
                  </p>
                </div>
              ))}

              {isSimulating && (
                <div className="border border-neutral-200 border-dashed p-3 text-center bg-neutral-50">
                  <Activity className="h-4 w-4 animate-pulse text-[#0033aa] mx-auto mb-1.5" />
                  <span className="font-mono text-[9px] text-neutral-400">Juror Beta streaming reasoning log...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

      </div>

      {/* Decision Summary & Accept Resolutions Panel */}
      <div className="bg-neutral-50 border-t border-neutral-200 p-3 select-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shrink-0">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-neutral-800 uppercase tracking-wide">
              Tribunal Final Opinion:
            </span>
            <span className="font-mono text-[9px] text-neutral-400 max-w-sm truncate">
              {activeCase.citationIssue}
            </span>
          </div>
          <p className="font-mono text-[9px] text-neutral-600 leading-normal">
            {activeCase.summary}
          </p>
          <p className="font-mono text-[9px] text-neutral-800 leading-normal pt-1">
            <strong className="text-red-700">Corrective Action:</strong> {activeCase.suggestedAction}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-[10px] font-mono rounded-none border-neutral-300 hover:bg-neutral-100 cursor-pointer"
            onClick={() => {
              addAuditLog({
                level: 'warning',
                module: 'TribunalAdjudicator',
                message: `Tribunal ruling for ${activeCase.caseName} appealed to Human Lead.`
              });
            }}
          >
            Appeal Ruling
          </Button>

          <Button
            variant="bloomberg"
            size="sm"
            onClick={handleApplyResolution}
            disabled={activeCase.status !== 'Rejected' && activeCase.id === 'tribunal-case-1'}
            className="h-7 px-3.5 text-[10px] font-mono rounded-none bg-[#0033aa] hover:bg-[#0033aa]/90 text-white cursor-pointer gap-1 font-bold"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Apply Corrective Precedent</span>
          </Button>
        </div>
      </div>

      {/* Bottom Deliberation Console Logs */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-2 shrink-0 select-none">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-1.5 text-neutral-500 font-mono text-[9px]">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-green-500" />
            <span className="text-green-400 font-bold uppercase tracking-wider">Adjudication Engine Audit Stream</span>
          </div>
          <span>Consensus Engine: v2.1</span>
        </div>

        <div className="font-mono text-[9px] space-y-0.5 h-12 overflow-y-auto leading-normal text-green-500/90 max-h-12">
          {simulationLogs.map((log, index) => (
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
