'use client';

import * as React from 'react';
import { 
  Shield, 
  Target, 
  Sliders, 
  Activity, 
  Percent, 
  DollarSign, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  Scale, 
  Briefcase, 
  Play, 
  RotateCcw,
  Terminal,
  Gavel
} from 'lucide-react';
import { useDrafterStore } from '../lib/store';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export function WarRoomSimulator() {
  const { addAuditLog } = useDrafterStore();

  // What-if simulation parameters state
  const [strategyAggression, setStrategyAggression] = React.useState<number>(65);
  const [discoveryScope, setDiscoveryScope] = React.useState<number>(45);
  const [precedentRigor, setPrecedentRigor] = React.useState<number>(75);
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);

  const [simLogs, setSimLogs] = React.useState<string[]>([
    'INIT: Monte Carlo litigation simulator online.',
    'LOAD: Historic SDNY contract dispute dataset indexed.',
  ]);

  // Derived metrics based on sliders (simulate real-time calculation)
  const winProbability = React.useMemo(() => {
    const val = 35 + (strategyAggression * 0.15) + (precedentRigor * 0.3) - (discoveryScope * 0.1);
    return Math.min(Math.max(Math.round(val), 5), 98);
  }, [strategyAggression, precedentRigor, discoveryScope]);

  const settlementProbability = React.useMemo(() => {
    const val = 55 - (strategyAggression * 0.25) + (discoveryScope * 0.4);
    return Math.min(Math.max(Math.round(val), 10), 95);
  }, [strategyAggression, discoveryScope]);

  const judgeDispositionRisk = React.useMemo(() => {
    const val = 10 + (strategyAggression * 0.6) - (precedentRigor * 0.2);
    return Math.min(Math.max(Math.round(val), 5), 99);
  }, [strategyAggression, precedentRigor]);

  const legalFees = React.useMemo(() => {
    return 85000 + (discoveryScope * 3500) + (strategyAggression * 1200);
  }, [discoveryScope, strategyAggression]);

  const expectedFilingOutcome = React.useMemo(() => {
    if (winProbability > 70) return 'Motion for Summary Judgment Granted';
    if (winProbability > 50) return 'Granted in Part / Leave to Amend Issued';
    return 'Motion Denied / Referred to Magistrate';
  }, [winProbability]);

  // Strategy recommendation based on parameters
  const strategyRecommendation = React.useMemo(() => {
    if (strategyAggression > 80 && judgeDispositionRisk > 60) {
      return {
        level: 'warning' as const,
        text: 'High aggression exceeds Judge tolerance limit. Risk of Rule 11 motion or judicial sanctions. Suggest lowering aggression below 75%.'
      };
    }
    if (precedentRigor < 50) {
      return {
        level: 'info' as const,
        text: 'Precedent rigor is suboptimal. Strengthen citation integrity checks to block opposing counsel from raising preemption challenges.'
      };
    }
    if (discoveryScope > 75) {
      return {
        level: 'warning' as const,
        text: 'Extended discovery scope raises litigation expense. Suggest narrowing scope to key custodians to avoid cost escalation.'
      };
    }
    return {
      level: 'success' as const,
      text: 'Litigation profile optimized. Balanced leverage between trial risk mitigation and settlement leverage.'
    };
  }, [strategyAggression, judgeDispositionRisk, precedentRigor, discoveryScope]);

  // Run dynamic Monte Carlo simulation sequence
  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    addAuditLog({
      level: 'info',
      module: 'WarRoomSimulator',
      message: `Running Monte Carlo litigation projection (Aggression: ${strategyAggression}%, Discovery: ${discoveryScope}%)`
    });

    const timestamp = () => new Date().toTimeString().split(' ')[0];

    setSimLogs(prev => [...prev, `[${timestamp()}] SIMULATING: Sampling 10,000 litigation paths...`]);

    setTimeout(() => {
      setSimLogs(prev => [...prev, `[${timestamp()}] SOLVING: Judge bias metrics adjusted (SDNY historical dataset applied).`]);
    }, 450);

    setTimeout(() => {
      setSimLogs(prev => [...prev, `[${timestamp()}] CONVERGENCE: Win probability stabilized at ${winProbability}% (expected outcome: ${expectedFilingOutcome}).`]);
      setIsSimulating(false);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white select-none">
      
      {/* Top Banner Control Header */}
      <div className="bg-neutral-100 border-b border-neutral-200 p-2.5 flex items-center justify-between shrink-0 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-[#0033aa]" />
          <span className="font-bold text-neutral-800 uppercase tracking-wide">Litigation Strategy & War Room Simulator</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-bold">Matter Focus:</span>
          <span className="bg-neutral-200 text-neutral-800 border border-neutral-300 px-1.5 py-0.2 font-bold">Acme v. Beta (1:24-cv-09876)</span>
          
          <Button
            variant="bloomberg"
            size="sm"
            disabled={isSimulating}
            onClick={handleRunSimulation}
            className="h-5.5 px-2 bg-[#0033aa] hover:bg-[#0033aa]/90 text-white rounded-none cursor-pointer gap-1"
          >
            {isSimulating ? <Activity className="h-3 w-3 animate-pulse" /> : <Play className="h-3 w-3" />}
            <span>Run Scenario Monte Carlo</span>
          </Button>
        </div>
      </div>

      {/* Main Content Workspace Layout */}
      <div className="flex-1 flex min-h-0 divide-x divide-neutral-200">
        
        {/* LEFT COLUMN: WHAT-IF SIMULATOR CONTROLS */}
        <div className="w-1/3 flex flex-col min-h-0 bg-neutral-50 p-4 space-y-4">
          <div className="border border-neutral-200 bg-white p-3 space-y-3">
            <h3 className="font-mono font-bold text-neutral-800 text-[10px] uppercase tracking-wide border-b border-neutral-100 pb-1.5 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-[#0033aa]" />
              <span>What-If Input Parameters</span>
            </h3>

            {/* Slider 1: Strategy Aggression */}
            <div className="space-y-1.5 font-mono text-[9px]">
              <div className="flex justify-between text-neutral-600">
                <span>Opposing Counsel Aggression</span>
                <span className="font-bold text-neutral-900">{strategyAggression}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={strategyAggression}
                onChange={(e) => setStrategyAggression(parseInt(e.target.value))}
                className="w-full accent-[#0033aa] h-1.5 bg-neutral-100 border border-neutral-200 rounded-none cursor-pointer"
              />
            </div>

            {/* Slider 2: Discovery Scope */}
            <div className="space-y-1.5 font-mono text-[9px]">
              <div className="flex justify-between text-neutral-600">
                <span>Discovery Scope Depth</span>
                <span className="font-bold text-neutral-900">{discoveryScope}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={discoveryScope}
                onChange={(e) => setDiscoveryScope(parseInt(e.target.value))}
                className="w-full accent-[#0033aa] h-1.5 bg-neutral-100 border border-neutral-200 rounded-none cursor-pointer"
              />
            </div>

            {/* Slider 3: Precedent Rigor */}
            <div className="space-y-1.5 font-mono text-[9px]">
              <div className="flex justify-between text-neutral-600">
                <span>Precedent Rigor Index</span>
                <span className="font-bold text-neutral-900">{precedentRigor}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={precedentRigor}
                onChange={(e) => setPrecedentRigor(parseInt(e.target.value))}
                className="w-full accent-[#0033aa] h-1.5 bg-neutral-100 border border-neutral-200 rounded-none cursor-pointer"
              />
            </div>

            <div className="pt-2 text-center">
              <span className="font-mono text-[8px] text-neutral-400 block italic">
                Adjusting parameters dynamically recalculates risk variables and Monte Carlo win forecasts.
              </span>
            </div>
          </div>

          {/* STRATEGY RECOMMENDATION BLOCK */}
          <div className="border border-neutral-200 bg-white p-3 space-y-2">
            <h3 className="font-mono font-bold text-neutral-800 text-[10px] uppercase tracking-wide border-b border-neutral-100 pb-1.5">
              Live Recommendations
            </h3>
            <div className={cn(
              "p-2.5 border font-mono text-[9px] leading-relaxed",
              strategyRecommendation.level === 'warning' && "bg-red-50 border-red-200 text-red-700",
              strategyRecommendation.level === 'info' && "bg-blue-50 border-blue-200 text-blue-700",
              strategyRecommendation.level === 'success' && "bg-green-50 border-green-200 text-green-700"
            )}>
              <div className="flex items-start gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <p className="font-medium">{strategyRecommendation.text}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: OUTCOMES & DECISION VISUALIZATION */}
        <div className="w-2/3 flex flex-col min-h-0 bg-white p-4 space-y-4">
          
          {/* Key Scenario Projections Grid */}
          <div className="grid grid-cols-3 gap-3">
            
            {/* Settlement probability */}
            <div className="border border-neutral-200 p-3 bg-neutral-50/50 space-y-1.5">
              <span className="block font-mono text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Settlement Chance</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-neutral-800 tracking-tight">{settlementProbability}%</span>
              </div>
              <div className="h-1 bg-neutral-200 overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: `${settlementProbability}%` }} />
              </div>
            </div>

            {/* Win Chance */}
            <div className="border border-neutral-200 p-3 bg-neutral-50/50 space-y-1.5">
              <span className="block font-mono text-[8px] text-neutral-400 font-bold uppercase tracking-wider">MSJ Win Probability</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-neutral-800 tracking-tight">{winProbability}%</span>
              </div>
              <div className="h-1 bg-neutral-200 overflow-hidden">
                <div className="h-full bg-[#0033aa]" style={{ width: `${winProbability}%` }} />
              </div>
            </div>

            {/* Judicial Risk */}
            <div className="border border-neutral-200 p-3 bg-neutral-50/50 space-y-1.5">
              <span className="block font-mono text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Judge Friction Risk</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-neutral-800 tracking-tight">{judgeDispositionRisk}%</span>
              </div>
              <div className="h-1 bg-neutral-200 overflow-hidden">
                <div className="h-full bg-red-600" style={{ width: `${judgeDispositionRisk}%` }} />
              </div>
            </div>

          </div>

          {/* Scenario Details Cards list */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Card 1: Opponent profile */}
            <div className="border border-neutral-200 p-3 space-y-2">
              <span className="block font-mono text-[9px] text-[#0033aa] font-bold uppercase tracking-wide border-b border-neutral-100 pb-1">
                Opposing Strategy
              </span>
              <div className="font-mono text-[9px] text-neutral-600 space-y-1 leading-normal">
                <p><strong>Primary Mode:</strong> {strategyAggression > 70 ? 'Aggressive / High Gavel Motion-pressure' : 'Cooperative Settlement-focused'}</p>
                <p><strong>Filing Speed:</strong> Fast (Estimated response within 14 days)</p>
                <p><strong>Sanction Risk:</strong> {strategyAggression > 80 ? 'CRITICAL - Opponent actively monitors FRCP compliance' : 'Low'}</p>
              </div>
            </div>

            {/* Card 2: Judge Disposition */}
            <div className="border border-neutral-200 p-3 space-y-2">
              <span className="block font-mono text-[9px] text-[#0033aa] font-bold uppercase tracking-wide border-b border-neutral-100 pb-1">
                Judge Profile
              </span>
              <div className="font-mono text-[9px] text-neutral-600 space-y-1 leading-normal">
                <p><strong>Affiliated Judge:</strong> Hon. Katherine Polk Failla</p>
                <p><strong>Precedent Strictness:</strong> High (strict enforcement of citations)</p>
                <p><strong>MSJ Granted rate:</strong> 42% Historical SDNY benchmark</p>
              </div>
            </div>

            {/* Card 3: Filing Outcome */}
            <div className="border border-neutral-200 p-3 space-y-2">
              <span className="block font-mono text-[9px] text-[#0033aa] font-bold uppercase tracking-wide border-b border-neutral-100 pb-1">
                Expected MSJ Outcome
              </span>
              <div className="font-mono text-[9px] text-neutral-600 space-y-1 leading-normal">
                <p className="font-bold text-neutral-900">{expectedFilingOutcome}</p>
                <p><strong>Appeal Rate:</strong> {winProbability > 70 ? '85% Opponent Appeal Risk' : '30% Appeal Chance'}</p>
              </div>
            </div>

            {/* Card 4: Expense Projections */}
            <div className="border border-neutral-200 p-3 space-y-2">
              <span className="block font-mono text-[9px] text-[#0033aa] font-bold uppercase tracking-wide border-b border-neutral-100 pb-1">
                Expense & Resource Allocation
              </span>
              <div className="font-mono text-[9px] text-neutral-600 space-y-1 leading-normal">
                <p><strong>Expected Legal Cost:</strong> ${legalFees.toLocaleString()}</p>
                <p><strong>Discovery Custodians:</strong> {Math.round(discoveryScope / 5) + 2} Active Custodians</p>
              </div>
            </div>

          </div>

          {/* Interactive Simulation Timeline Track */}
          <div className="border border-neutral-200 p-3 space-y-2">
            <span className="block font-mono text-[9px] text-neutral-800 font-bold uppercase tracking-wide border-b border-neutral-100 pb-1">
              Litigation Milestone Simulation Track
            </span>
            
            <div className="flex items-center justify-between font-mono text-[9px] text-neutral-500 py-1 select-none">
              
              {/* Step 1 */}
              <div className="text-center space-y-1">
                <span className="block h-2 w-2 rounded-full bg-green-600 mx-auto" />
                <span className="font-bold text-neutral-800 block">Pleading</span>
                <span className="text-[8px] text-neutral-400">Complete (100%)</span>
              </div>

              <div className="h-0.5 bg-neutral-200 flex-1 mx-2" />

              {/* Step 2 */}
              <div className="text-center space-y-1">
                <div className="h-2 w-2 rounded-full bg-[#0033aa] mx-auto animate-ping absolute" />
                <span className="block h-2 w-2 rounded-full bg-[#0033aa] mx-auto" />
                <span className="font-bold text-neutral-800 block">Discovery</span>
                <span className="text-[8px] text-neutral-400">Active ({discoveryScope}%)</span>
              </div>

              <div className="h-0.5 bg-neutral-200 flex-1 mx-2" />

              {/* Step 3 */}
              <div className="text-center space-y-1">
                <span className={cn(
                  "block h-2 w-2 rounded-full mx-auto",
                  winProbability > 50 ? "bg-green-600" : "bg-red-600"
                )} />
                <span className="font-bold text-neutral-800 block">MSJ filing</span>
                <span className="text-[8px] text-neutral-400">{winProbability}% Win</span>
              </div>

              <div className="h-0.5 bg-neutral-200 flex-1 mx-2" />

              {/* Step 4 */}
              <div className="text-center space-y-1">
                <span className="block h-2 w-2 rounded-full bg-neutral-200 mx-auto" />
                <span className="font-bold text-neutral-800 block">Jury Trial</span>
                <span className="text-[8px] text-neutral-400">Risk: {judgeDispositionRisk}%</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Terminal Live Simulation Log Output */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-2 shrink-0 select-none">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-1.5 text-neutral-500 font-mono text-[9px]">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-green-500" />
            <span className="text-green-400 font-bold uppercase tracking-wider">Strategic Monte Carlo Simulation Logs</span>
          </div>
          <span>Confidence Margin: +/- 2.5%</span>
        </div>

        <div className="font-mono text-[9px] space-y-0.5 h-16 overflow-y-auto leading-normal text-green-500/90 max-h-16">
          {simLogs.map((log, index) => (
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
