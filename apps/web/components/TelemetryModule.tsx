'use client';

import * as React from 'react';
import { 
  Terminal, 
  Cpu, 
  Activity, 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Percent, 
  DollarSign, 
  Play, 
  RefreshCcw, 
  Layers, 
  Search,
  BookOpen
} from 'lucide-react';
import { useDrafterStore } from '../lib/store';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export interface TelemetryLog {
  timestamp: string;
  type: 'API_CALL' | 'CACHE_HIT' | 'INTERCEPT' | 'TRB_DECISION' | 'DB_WRITE';
  module: string;
  details: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED' | 'WARNING';
}

export function TelemetryModule() {
  const { auditLogs, addAuditLog } = useDrafterStore();

  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedType, setSelectedType] = React.useState<string>('ALL');
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);
  
  // Real-time ticker logs state
  const [liveTicker, setLiveTicker] = React.useState<string[]>([
    'CONN: Secure websocket established with consensus server.',
    'MONITOR: System reporting nominal operational memory limits.',
    'WASM: Precedent indexing cache warm (98.4% hit rate).',
    'METRIC: Outbound pipeline latency stable at 18ms.'
  ]);

  const telemetryLogs: TelemetryLog[] = React.useMemo(() => [
    {
      timestamp: '16:51:02',
      type: 'CACHE_HIT',
      module: 'CitationEngine',
      details: 'Retrieved Federal Opinion Westlaw reporter key 412_F3d_89 from local cache.',
      status: 'SUCCESS'
    },
    {
      timestamp: '16:50:45',
      type: 'DB_WRITE',
      module: 'MatterLibrary',
      details: 'Swapped active matter context to Acme Corp v. Beta LLC (Docket 1:24-cv-09876).',
      status: 'SUCCESS'
    },
    {
      timestamp: '16:49:12',
      type: 'API_CALL',
      module: 'LocalRulesetSDNY',
      details: 'Scanned margins, font constraints, and line gutters on active draft document.',
      status: 'SUCCESS'
    },
    {
      timestamp: '16:44:31',
      type: 'TRB_DECISION',
      module: 'TribunalAdjudicator',
      details: 'Consensus decision REJECTED citation Henderson v. Continental Marine. 2 Model Juror votes recorded.',
      status: 'BLOCKED'
    },
    {
      timestamp: '16:44:02',
      type: 'INTERCEPT',
      module: 'Lane2Intercept',
      details: 'Hallucination alert triggered on Henderson precedent. Streaming process halted at tokens 840-845.',
      status: 'FLAGGED'
    },
    {
      timestamp: '16:40:15',
      type: 'API_CALL',
      module: 'CompletionRouter',
      details: 'Initialized streaming pipeline using Llama-3-Legal-Instruct model.',
      status: 'SUCCESS'
    },
    {
      timestamp: '16:38:22',
      type: 'CACHE_HIT',
      module: 'ConfidentialityScanner',
      details: 'Internal client adverse parties registry queried. Zero conflicts found.',
      status: 'SUCCESS'
    },
    {
      timestamp: '16:35:10',
      type: 'DB_WRITE',
      module: 'DrafterWorkspace',
      details: 'Saved draft check-point signature 0x1A2B3C9F to disk.',
      status: 'WARNING'
    }
  ], []);

  // Filter logs
  const filteredTelemetry = React.useMemo(() => {
    return telemetryLogs.filter(log => {
      const typeMatch = selectedType === 'ALL' || log.type === selectedType;
      const searchMatch = 
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [telemetryLogs, selectedType, searchTerm]);

  // Handle manual ticker simulation
  const handleTriggerTelemetryCheck = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    addAuditLog({
      level: 'info',
      module: 'TelemetryObservability',
      message: 'Observability refresh triggered manually.'
    });

    const timestamp = () => new Date().toTimeString().split(' ')[0];

    setLiveTicker(prev => [...prev, `[${timestamp()}] TELEMETRY: Requesting active pipeline socket refresh...`]);

    setTimeout(() => {
      setLiveTicker(prev => [...prev, `[${timestamp()}] REFRESH: Model metrics verified (Llama-3-Legal avg response time 1.2s).`]);
    }, 400);

    setTimeout(() => {
      setLiveTicker(prev => [...prev, `[${timestamp()}] REFRESH: System load average: 0.14 | Memory usage 1.24 GB.`]);
    }, 800);

    setTimeout(() => {
      setLiveTicker(prev => [...prev, `[${timestamp()}] COMPLETE: Observability metrics refresh finished successfully.`]);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white select-none">
      
      {/* Real-time System Metrics Header Grid */}
      <div className="grid grid-cols-4 border-b border-neutral-200 bg-neutral-50 font-mono text-[10px] text-neutral-600 divide-x divide-neutral-200 shrink-0">
        
        {/* Metric 1 */}
        <div className="p-2.5">
          <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Pipeline Throughput</span>
          <span className="font-bold text-neutral-800 mt-1 block flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-green-600 animate-pulse shrink-0" />
            <span>142 tokens/sec</span>
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-2.5">
          <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Consensus Engine Latency</span>
          <span className="font-bold text-neutral-800 mt-1 block flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#0033aa] shrink-0" />
            <span>18 ms (LAN)</span>
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-2.5">
          <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Memory Allocation</span>
          <span className="font-bold text-neutral-800 mt-1 block flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
            <span>1.24 GB / 4.00 GB</span>
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-2.5 flex items-center justify-between">
          <div>
            <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">API Health</span>
            <span className="font-bold text-green-700 mt-1 block flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>99.98% ONLINE</span>
            </span>
          </div>
          <Button
            variant="bloomberg"
            size="sm"
            disabled={isSimulating}
            onClick={handleTriggerTelemetryCheck}
            className="h-5 px-1.5 text-[8px] font-mono bg-[#0033aa] hover:bg-[#0033aa]/90 text-white rounded-none cursor-pointer gap-1"
          >
            <RefreshCcw className={cn("h-2.5 w-2.5", isSimulating && "animate-spin")} />
            <span>Refresh</span>
          </Button>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0 divide-x divide-neutral-200">
        
        {/* Left Side: Real-time Event Feed & Forensic Logs */}
        <div className="w-2/3 flex flex-col min-h-0">
          
          {/* Controls Bar */}
          <div className="p-2 bg-neutral-100 border-b border-neutral-200 flex items-center gap-2 shrink-0 font-mono text-[9px]">
            <div className="relative flex-1">
              <Search className="absolute left-1.5 top-1.5 h-3 w-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Filter logs by module or detail payloads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-none pl-6 pr-2 py-0.5 text-neutral-800 focus:outline-hidden focus:border-neutral-500 h-5"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 font-bold">TYPE:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white border border-neutral-300 rounded-none px-1.5 py-0.5 text-neutral-700 focus:outline-hidden h-5 cursor-pointer font-bold"
              >
                <option value="ALL">ALL TYPES</option>
                <option value="API_CALL">API_CALL</option>
                <option value="CACHE_HIT">CACHE_HIT</option>
                <option value="INTERCEPT">INTERCEPT</option>
                <option value="TRB_DECISION">TRB_DECISION</option>
                <option value="DB_WRITE">DB_WRITE</option>
              </select>
            </div>
          </div>

          {/* Forensic table view */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <table className="w-full border-collapse text-left select-text">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 font-mono text-[8px] text-neutral-400 font-bold tracking-wider select-none sticky top-0 bg-neutral-50 z-10">
                    <th className="py-2 px-3 w-16">TIME</th>
                    <th className="py-2 px-2 w-24">TYPE</th>
                    <th className="py-2 px-2 w-32">MODULE</th>
                    <th className="py-2 px-2">DETAIL TRANSACTION PAYLOAD</th>
                    <th className="py-2 px-3 w-20 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono text-[9px] text-neutral-700 leading-normal">
                  {filteredTelemetry.map((log, index) => (
                    <tr key={index} className="hover:bg-neutral-50 bg-white">
                      <td className="py-2 px-3 text-neutral-400 tabular-nums">{log.timestamp}</td>
                      <td className="py-2 px-2">
                        <span className="font-bold text-neutral-500 bg-neutral-100 px-1 py-0.2">
                          {log.type}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-semibold text-neutral-900 truncate max-w-[120px]" title={log.module}>
                        {log.module}
                      </td>
                      <td className="py-2 px-2 break-all text-neutral-600 font-mono leading-tight">
                        {log.details}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className={cn(
                          "inline-flex items-center px-1.5 py-0.2 border text-[8px] font-bold uppercase tracking-wider",
                          log.status === 'SUCCESS' && "bg-green-50 border-green-200 text-green-700",
                          log.status === 'BLOCKED' && "bg-red-50 border-red-200 text-red-700 animate-pulse",
                          log.status === 'FLAGGED' && "bg-amber-50 border-amber-200 text-amber-700",
                          log.status === 'WARNING' && "bg-purple-50 border-purple-200 text-purple-700"
                        )}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredTelemetry.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-400 font-mono text-[10px]">
                        No matching transactions found in database cache.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>

        </div>

        {/* Right Side: Observability Panels, Latency Bars & Governance Timeline */}
        <div className="w-1/3 flex flex-col min-h-0 bg-neutral-50">
          
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              
              {/* Token Throughput & Cost metrics */}
              <div className="border border-neutral-200 bg-white p-3 space-y-2.5">
                <h3 className="font-mono font-bold text-neutral-800 text-[10px] uppercase tracking-wide border-b border-neutral-100 pb-1.5">
                  LLM Token Accounting
                </h3>

                <div className="grid grid-cols-2 gap-2 font-mono text-[9px] text-neutral-600">
                  <div className="bg-neutral-50 p-1.5 border border-neutral-100">
                    <span className="text-neutral-400 block text-[8px] font-bold">INPUT TOKENS</span>
                    <span className="text-neutral-800 font-bold">342,912 tok</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 border border-neutral-100">
                    <span className="text-neutral-400 block text-[8px] font-bold">OUTPUT TOKENS</span>
                    <span className="text-neutral-800 font-bold">892,102 tok</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono pt-1 text-neutral-500">
                  <div className="flex items-center gap-1 text-neutral-700 font-bold">
                    <DollarSign className="h-3 w-3 text-green-600 shrink-0" />
                    <span>Estimated Session cost:</span>
                  </div>
                  <span className="font-bold text-neutral-800">$1.84 USD</span>
                </div>
              </div>

              {/* Model Latency Bars */}
              <div className="border border-neutral-200 bg-white p-3 space-y-2.5">
                <h3 className="font-mono font-bold text-neutral-800 text-[10px] uppercase tracking-wide border-b border-neutral-100 pb-1.5">
                  Model Latency Profiles
                </h3>

                <div className="space-y-2 font-mono text-[9px]">
                  
                  {/* Model 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-neutral-600">
                      <span>Llama-3-Legal-Instruct</span>
                      <span className="font-semibold text-neutral-800">1.2s</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 border border-neutral-200 overflow-hidden flex">
                      <div className="h-full bg-green-600" style={{ width: '40%' }} />
                    </div>
                  </div>

                  {/* Model 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-neutral-600">
                      <span>GPT-4o (Completer)</span>
                      <span className="font-semibold text-neutral-800">1.8s</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 border border-neutral-200 overflow-hidden flex">
                      <div className="h-full bg-amber-500" style={{ width: '60%' }} />
                    </div>
                  </div>

                  {/* Model 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-neutral-600">
                      <span>Claude-3-Sonnet (Jury)</span>
                      <span className="font-semibold text-neutral-800">2.4s</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 border border-neutral-200 overflow-hidden flex">
                      <div className="h-full bg-[#0033aa]" style={{ width: '80%' }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Governance Timeline Stepper */}
              <div className="border border-neutral-200 bg-white p-3 space-y-2.5">
                <h3 className="font-mono font-bold text-neutral-800 text-[10px] uppercase tracking-wide border-b border-neutral-100 pb-1.5">
                  Governance Event Stream
                </h3>

                <div className="relative pl-4 border-l border-neutral-200 space-y-3 font-mono text-[9px] text-neutral-600 leading-normal select-none">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[20.5px] top-0.5 h-2 w-2 rounded-full border border-neutral-200 bg-green-500" />
                    <span className="text-neutral-400 block text-[8px] font-bold">16:51:02</span>
                    <span className="text-neutral-800 font-bold block">Precedent cache hit</span>
                    <span>Citation volume 412 page 89 retrieved.</span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[20.5px] top-0.5 h-2 w-2 rounded-full border border-neutral-200 bg-[#0033aa]" />
                    <span className="text-neutral-400 block text-[8px] font-bold">16:44:31</span>
                    <span className="text-neutral-800 font-bold block">Consensus achieved</span>
                    <span>Juror Alpha & Beta rejected precedent.</span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[20.5px] top-0.5 h-2 w-2 rounded-full border border-neutral-200 bg-red-500 animate-ping" />
                    <div className="absolute -left-[20.5px] top-0.5 h-2 w-2 rounded-full border border-neutral-200 bg-red-500" />
                    <span className="text-neutral-400 block text-[8px] font-bold">16:44:02</span>
                    <span className="text-red-700 font-bold block">Lane 2 Intercept active</span>
                    <span>Halted stream on hallucinated citation.</span>
                  </div>

                </div>
              </div>

            </div>
          </ScrollArea>

        </div>

      </div>

      {/* Terminal Live Ticker Updates */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-2 shrink-0 select-none">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-1.5 text-neutral-500 font-mono text-[9px]">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-green-500" />
            <span className="text-green-400 font-bold uppercase tracking-wider">Live Socket Telemetry Stream</span>
          </div>
          <span>Baud Rate: 115200</span>
        </div>

        <div className="font-mono text-[9px] space-y-0.5 h-16 overflow-y-auto leading-normal text-green-500/90 max-h-16">
          {liveTicker.map((log, index) => (
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
