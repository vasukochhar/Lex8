'use client';

import * as React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Play, 
  ExternalLink,
  ChevronRight,
  Terminal,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { useDrafterStore } from '../lib/store';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export interface Detector {
  name: string;
  type: 'regex' | 'nlp_model' | 'knowledge_graph' | 'compliance_list';
  status: 'active' | 'suspended';
  patternCode?: string;
}

export interface Rule {
  id: string;
  category: 'Citation Integrity' | 'Jurisdiction Compliance' | 'Confidentiality' | 'Filing Standards' | 'Ethical Risk';
  code: string;
  title: string;
  status: 'pass' | 'fail' | 'warning';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  detectorCount: number;
  lastExecuted: string;
  description: string;
  detectors: Detector[];
}

export function ValidatorRules() {
  const { addAuditLog } = useDrafterStore();

  const [activeCategory, setActiveCategory] = React.useState<string>('ALL');
  const [selectedRuleId, setSelectedRuleId] = React.useState<string>('RULE-CIT-01');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [isScanning, setIsScanning] = React.useState<boolean>(false);
  const [tickerLogs, setTickerLogs] = React.useState<string[]>([
    'INIT: Validator rules engine initialized.',
    'SECURE: Compliance lists loaded from federal database.',
    'SYSTEM: Real-time scan engine listening on workspace port 3000.',
    'SUITE: 10 active rules checked - 1 error flag raised.'
  ]);

  const rules: Rule[] = React.useMemo(() => [
    {
      id: 'RULE-CIT-01',
      category: 'Citation Integrity',
      code: 'RULE-CIT-01',
      title: 'Precedent Verification Scan',
      status: 'fail',
      severity: 'CRITICAL',
      detectorCount: 3,
      lastExecuted: '2 mins ago',
      description: 'Cross-checks cited precedent cases with LexisNexis/Westlaw references, federal court dockets, and local case indices to eliminate hallucinated references.',
      detectors: [
        { name: 'Federal Citation Regex Parser', type: 'regex', status: 'active', patternCode: '/\\d+\\s+F\\.(?:2d|3d|d)?\\.\\s+\\d+/i' },
        { name: 'Hallucinated Citation Bi-Encoder', type: 'nlp_model', status: 'active', patternCode: 'transformer-legal-roberta-v4' },
        { name: 'Federal Opinions Graph Matcher', type: 'knowledge_graph', status: 'active' }
      ]
    },
    {
      id: 'RULE-CIT-02',
      category: 'Citation Integrity',
      code: 'RULE-CIT-02',
      title: 'Pinpoint Page Range Check',
      status: 'pass',
      severity: 'MEDIUM',
      detectorCount: 2,
      lastExecuted: '10 mins ago',
      description: 'Ensures that pinpoint page numbers referenced in the pleading exist within the official opinion record.',
      detectors: [
        { name: 'Page Limit Range Evaluator', type: 'regex', status: 'active', patternCode: '/\\b(?:at\\s+)?([\\d,]+)\\b/i' },
        { name: 'Reporter Volume Cross-Referencer', type: 'compliance_list', status: 'active' }
      ]
    },
    {
      id: 'RULE-JUR-01',
      category: 'Jurisdiction Compliance',
      code: 'RULE-JUR-01',
      title: 'Local Spacing & Margin Check',
      status: 'pass',
      severity: 'LOW',
      detectorCount: 2,
      lastExecuted: '1 min ago',
      description: 'Enforces local rules for styling, page margin spacing, paragraph indexing, and standard double-spaced layout line numbering.',
      detectors: [
        { name: 'Line Gutter Margin Scanner', type: 'regex', status: 'active' },
        { name: 'Font Size & Style Extractor', type: 'nlp_model', status: 'active' }
      ]
    },
    {
      id: 'RULE-JUR-02',
      category: 'Jurisdiction Compliance',
      code: 'RULE-JUR-02',
      title: 'Bar Admission Status Audit',
      status: 'warning',
      severity: 'HIGH',
      detectorCount: 1,
      lastExecuted: '5 mins ago',
      description: 'Verifies that all counsel listed in the signature block are currently admitted and in good standing with the local state/district bar.',
      detectors: [
        { name: 'District Court Roll Cross-Reference', type: 'compliance_list', status: 'active', patternCode: 'SDNY-Roll-Registry-Current' }
      ]
    },
    {
      id: 'RULE-CON-01',
      category: 'Confidentiality',
      code: 'RULE-CON-01',
      title: 'Sensitive PII Redaction Audit',
      status: 'pass',
      severity: 'CRITICAL',
      detectorCount: 4,
      lastExecuted: '2 mins ago',
      description: 'Scans for unmasked social security numbers, credit cards, bank account details, and private corporate names that violate privacy standards.',
      detectors: [
        { name: 'SSN Regex Matcher', type: 'regex', status: 'active', patternCode: '/\\d{3}-\\d{2}-\\d{4}/' },
        { name: 'Sensitive Entity NLP Extraction', type: 'nlp_model', status: 'active' },
        { name: 'Credit Card Luhn Scanner', type: 'regex', status: 'active' },
        { name: 'Address & Phone Extractor', type: 'regex', status: 'active' }
      ]
    },
    {
      id: 'RULE-CON-02',
      category: 'Confidentiality',
      code: 'RULE-CON-02',
      title: 'Sealed Record Citation Scan',
      status: 'pass',
      severity: 'HIGH',
      detectorCount: 2,
      lastExecuted: '12 mins ago',
      description: 'Identifies references to protective order documents, sealed exhibits, or confidential transcripts that must be filed under seal.',
      detectors: [
        { name: 'Sealing Label Scanner', type: 'regex', status: 'active', patternCode: '/(filed under seal|confidential transcript|protective order)/i' },
        { name: 'Exhibit Registry Graph Matcher', type: 'knowledge_graph', status: 'active' }
      ]
    },
    {
      id: 'RULE-FIL-01',
      category: 'Filing Standards',
      code: 'RULE-FIL-01',
      title: 'Proof of Service Attachment Check',
      status: 'warning',
      severity: 'MEDIUM',
      detectorCount: 1,
      lastExecuted: '8 mins ago',
      description: 'Verifies the draft includes the standard Federal Rule 5 Certificate of Service block containing service details.',
      detectors: [
        { name: 'Certificate Section Extractor', type: 'regex', status: 'active', patternCode: '/Certificate of Service/i' }
      ]
    },
    {
      id: 'RULE-FIL-02',
      category: 'Filing Standards',
      code: 'RULE-FIL-02',
      title: 'Federal Signature Block Audit',
      status: 'pass',
      severity: 'LOW',
      detectorCount: 2,
      lastExecuted: '4 mins ago',
      description: 'Ensures electronic filing signature syntax conforms to FRCP Rule 11 (e.g. s/ [Attorney Name], email, firm details).',
      detectors: [
        { name: 'Signature Block Regex Validator', type: 'regex', status: 'active', patternCode: '/s\\/\\s+[a-z\\s\\.]+/i' },
        { name: 'Contact Info Field Checker', type: 'compliance_list', status: 'active' }
      ]
    },
    {
      id: 'RULE-ETH-01',
      category: 'Ethical Risk',
      code: 'RULE-ETH-01',
      title: 'Conflict Adverse Party Check',
      status: 'pass',
      severity: 'CRITICAL',
      detectorCount: 3,
      lastExecuted: '2 mins ago',
      description: 'Cross-checks listed corporate entities and subsidiaries in the draft against the firm internal conflict list database.',
      detectors: [
        { name: 'Entity Named Entity Recognizer', type: 'nlp_model', status: 'active' },
        { name: 'Internal Client Conflict Database Lookup', type: 'compliance_list', status: 'active' },
        { name: 'Subsidiary Entity Matcher', type: 'knowledge_graph', status: 'active' }
      ]
    },
    {
      id: 'RULE-ETH-02',
      category: 'Ethical Risk',
      code: 'RULE-ETH-02',
      title: 'Hyperbolic Language Review',
      status: 'pass',
      severity: 'LOW',
      detectorCount: 1,
      lastExecuted: '15 mins ago',
      description: 'Flags excessively aggressive, emotionally loaded, or unprofessional language that deviates from court standards.',
      detectors: [
        { name: 'Professional Tone Classifier', type: 'nlp_model', status: 'active', patternCode: 'distilbert-legal-tone-classifier' }
      ]
    }
  ], []);

  // Filter logic
  const filteredRules = React.useMemo(() => {
    return rules.filter(rule => {
      const categoryMatch = activeCategory === 'ALL' || rule.category === activeCategory;
      const searchMatch = 
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [rules, activeCategory, searchTerm]);

  const selectedRule = React.useMemo<Rule>(() => {
    const found = rules.find(r => r.id === selectedRuleId);
    if (found) return found;
    return rules[0] as Rule;
  }, [rules, selectedRuleId]);

  // Handle Full Ruleset scan simulation
  const handleTriggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    addAuditLog({
      level: 'warning',
      module: 'ComplianceValidator',
      message: 'System-wide compliance re-scan triggered manually.'
    });

    const timestamp = () => new Date().toTimeString().split(' ')[0];

    // Stream console lines simulating scanning
    setTickerLogs(prev => [...prev, `[${timestamp()}] SCAN: Compliance scan requested.`]);

    setTimeout(() => {
      setTickerLogs(prev => [...prev, `[${timestamp()}] SCAN: Fetching latest docket rules from SDNY roll registry...`]);
    }, 400);

    setTimeout(() => {
      setTickerLogs(prev => [...prev, `[${timestamp()}] SCAN: Scanning Citation Integrity [RULE-CIT-01, RULE-CIT-02]...`]);
    }, 800);

    setTimeout(() => {
      setTickerLogs(prev => [...prev, `[${timestamp()}] ALERT: Henderson v. Continental Marine flagged as hallucinated precedent!`]);
    }, 1200);

    setTimeout(() => {
      setTickerLogs(prev => [...prev, `[${timestamp()}] SCAN: Finished scanning 10 rules. 1 critical exception found.`]);
      setIsScanning(false);
    }, 1600);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white select-none">
      
      {/* Top Banner Stats Block */}
      <div className="grid grid-cols-4 border-b border-neutral-200 bg-neutral-50 text-[10px] font-mono text-neutral-600 select-none divide-x divide-neutral-200 shrink-0">
        <div className="p-2">
          <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Suite Health</span>
          <span className="font-bold text-red-600 flex items-center gap-1 mt-0.5">
            <XCircle className="h-3 w-3" />
            <span>90% PASS RATE</span>
          </span>
        </div>
        <div className="p-2">
          <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Total Rules Loaded</span>
          <span className="font-bold text-neutral-800 mt-0.5 block">10 Compliance Rules</span>
        </div>
        <div className="p-2">
          <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Detectors Active</span>
          <span className="font-bold text-[#0033aa] mt-0.5 block flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            <span>24 Semantic Engines</span>
          </span>
        </div>
        <div className="p-2 flex items-center justify-between">
          <div>
            <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Last Sync</span>
            <span className="font-bold text-neutral-800 mt-0.5 block">Real-time Stream</span>
          </div>
          <Button
            variant="bloomberg"
            size="sm"
            disabled={isScanning}
            onClick={handleTriggerScan}
            className="h-5 px-1.5 text-[8px] bg-[#0033aa] hover:bg-[#0033aa]/90 text-white rounded-none cursor-pointer gap-1"
          >
            {isScanning ? <RefreshCw className="h-2 w-2 animate-spin" /> : <Play className="h-2.5 w-2.5" />}
            <span>Re-Scan</span>
          </Button>
        </div>
      </div>

      {/* Main Column Body */}
      <div className="flex-1 flex min-h-0 divide-x divide-neutral-200">
        
        {/* Left Rules List */}
        <div className="w-1/2 flex flex-col min-h-0">
          
          {/* Filters Area */}
          <div className="p-2 bg-neutral-100 border-b border-neutral-200 flex flex-col gap-1.5 shrink-0">
            <div className="relative">
              <Search className="absolute left-1.5 top-1.5 h-3 w-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Search rules, codes, titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-none pl-6 pr-2 py-0.5 font-mono text-[9px] text-neutral-800 focus:outline-hidden focus:border-neutral-500 h-5"
              />
            </div>
            
            <div className="flex flex-wrap gap-1">
              {['ALL', 'Citation Integrity', 'Jurisdiction Compliance', 'Confidentiality', 'Filing Standards', 'Ethical Risk'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-1.5 py-0.5 border text-[8px] font-mono uppercase tracking-wide transition-colors cursor-pointer",
                    activeCategory === cat 
                      ? "bg-neutral-800 text-white border-neutral-800 font-bold" 
                      : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                  )}
                >
                  {cat.replace('Jurisdiction ', 'Juris ').replace('Citation ', 'Cite ')}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List Scroll */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-neutral-200">
              {filteredRules.map((rule) => {
                const isSelected = rule.id === selectedRuleId;

                // Border matching severity
                let borderLeftClass = "border-l-2 border-l-neutral-300";
                if (rule.status === 'fail') {
                  borderLeftClass = "border-l-2 border-l-red-600";
                } else if (rule.status === 'warning') {
                  borderLeftClass = "border-l-2 border-l-amber-500";
                } else if (rule.status === 'pass') {
                  borderLeftClass = "border-l-2 border-l-green-600";
                }

                return (
                  <div
                    key={rule.id}
                    onClick={() => {
                      setSelectedRuleId(rule.id);
                      addAuditLog({
                        level: 'info',
                        module: 'ComplianceValidator',
                        message: `Rule inspection focused: ${rule.code}`
                      });
                    }}
                    className={cn(
                      "p-2.5 transition-colors cursor-pointer flex flex-col gap-1 select-none",
                      borderLeftClass,
                      isSelected ? "bg-[#0033aa]/5" : "hover:bg-neutral-50 bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[9px] text-[#0033aa] bg-neutral-100 border border-neutral-200 px-1 py-0.2">
                          {rule.code}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-900 font-mono truncate max-w-[150px]">
                          {rule.title}
                        </span>
                      </div>
                      
                      {/* Pass/Fail Icon Badges */}
                      <span className={cn(
                        "inline-flex items-center gap-0.5 px-1 py-0.2 border text-[8px] font-bold font-mono uppercase tracking-wider",
                        rule.status === 'pass' && "bg-green-50 border-green-200 text-green-700",
                        rule.status === 'warning' && "bg-amber-50 border-amber-200 text-amber-700",
                        rule.status === 'fail' && "bg-red-50 border-red-200 text-red-700"
                      )}>
                        {rule.status === 'pass' && <CheckCircle2 className="h-2 w-2" />}
                        {rule.status === 'warning' && <AlertTriangle className="h-2 w-2" />}
                        {rule.status === 'fail' && <XCircle className="h-2 w-2" />}
                        {rule.status}
                      </span>
                    </div>

                    <p className="text-[9px] text-neutral-500 font-mono leading-normal line-clamp-2">
                      {rule.description}
                    </p>

                    <div className="flex items-center justify-between mt-1 text-[8px] text-neutral-400 font-mono">
                      <div className="flex gap-2">
                        <span>SEVERITY: <strong className={cn(
                          rule.severity === 'CRITICAL' && "text-red-700",
                          rule.severity === 'HIGH' && "text-amber-700",
                          rule.severity === 'MEDIUM' && "text-neutral-700",
                          rule.severity === 'LOW' && "text-neutral-500"
                        )}>{rule.severity}</strong></span>
                        <span>•</span>
                        <span>{rule.detectorCount} DETECTORS</span>
                      </div>
                      <span>EXEC: {rule.lastExecuted}</span>
                    </div>
                  </div>
                );
              })}

              {filteredRules.length === 0 && (
                <div className="p-8 text-center text-neutral-400 font-mono text-[10px]">
                  <span>No rules match filters.</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Rules Inspection Expandable Panel */}
        <div className="w-1/2 flex flex-col bg-neutral-50 min-h-0 select-none">
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              
              {/* Card Meta Inspector Header */}
              <div className="border border-neutral-200 bg-white p-3 space-y-2.5">
                <div className="flex justify-between items-start border-b border-neutral-100 pb-2">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-neutral-400 uppercase font-bold tracking-wide">
                      {selectedRule.category}
                    </span>
                    <h2 className="font-mono font-bold text-neutral-800 text-[11px]">
                      {selectedRule.code}: {selectedRule.title}
                    </h2>
                  </div>
                  <span className={cn(
                    "px-1.5 py-0.5 border text-[9px] font-bold font-mono uppercase tracking-wider",
                    selectedRule.status === 'pass' && "bg-green-50 border-green-200 text-green-700",
                    selectedRule.status === 'warning' && "bg-amber-50 border-amber-200 text-amber-700",
                    selectedRule.status === 'fail' && "bg-red-50 border-red-200 text-red-700"
                  )}>
                    STATUS: {selectedRule.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-neutral-600 leading-normal">
                  <div className="border border-neutral-100 bg-neutral-50 p-1.5">
                    <span className="text-neutral-400 block text-[8px] font-bold">SEVERITY LEVEL</span>
                    <span className={cn(
                      "font-bold",
                      selectedRule.severity === 'CRITICAL' && "text-red-700",
                      selectedRule.severity === 'HIGH' && "text-amber-700",
                      selectedRule.severity === 'MEDIUM' && "text-neutral-700",
                      selectedRule.severity === 'LOW' && "text-neutral-500"
                    )}>{selectedRule.severity}</span>
                  </div>
                  <div className="border border-neutral-100 bg-neutral-50 p-1.5">
                    <span className="text-neutral-400 block text-[8px] font-bold">LAST SCAN TRIGGERED</span>
                    <span className="text-neutral-800 font-medium">{selectedRule.lastExecuted}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-neutral-400 uppercase font-bold tracking-wide block">
                    Scope of Audit
                  </span>
                  <p className="text-[10px] text-neutral-600 font-mono leading-relaxed">
                    {selectedRule.description}
                  </p>
                </div>
              </div>

              {/* Semantic Detectors Subpanel */}
              <div className="space-y-1.5">
                <span className="block text-[9px] font-mono uppercase text-neutral-400 font-bold tracking-wide px-0.5">
                  Semantic Detector Engines ({selectedRule.detectors.length})
                </span>

                <div className="space-y-2">
                  {selectedRule.detectors.map((det, index) => (
                    <div key={index} className="border border-neutral-200 bg-white p-2.5 space-y-1.5">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-1 text-[9px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <Cpu className="h-3 w-3 text-neutral-400" />
                          <span className="font-bold text-neutral-800">{det.name}</span>
                        </div>
                        <span className={cn(
                          "px-1 py-0.2 border text-[8px] font-bold uppercase",
                          det.status === 'active' ? "bg-green-50 border-green-100 text-green-700" : "bg-neutral-50 border-neutral-100 text-neutral-400"
                        )}>
                          {det.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8px] font-mono text-neutral-500">
                        <div>
                          <span>ENGINE TYPE: </span>
                          <strong className="text-neutral-600 uppercase">{det.type.replace('_', ' ')}</strong>
                        </div>
                        {det.patternCode && (
                          <div className="truncate">
                            <span>SIGNATURE: </span>
                            <code className="text-neutral-600 bg-neutral-100 px-1 py-0.2 rounded-xs select-all">{det.patternCode}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspector System Override Actions */}
              <div className="border border-neutral-200 bg-white p-3 space-y-2">
                <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold tracking-wide block">
                  Rule Administration Override
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-6 font-mono text-[9px] border-neutral-300 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => {
                      addAuditLog({
                        level: 'warning',
                        module: 'ComplianceValidator',
                        message: `Manual bypass configured for ${selectedRule.code}`
                      });
                    }}
                  >
                    Configure Bypass
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 font-mono text-[9px] border-neutral-300 hover:bg-neutral-50 cursor-pointer gap-1"
                  >
                    <span>View Logs</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </div>

            </div>
          </ScrollArea>
        </div>

      </div>

      {/* Subtle Terminal-style Validation Ticker Console */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-2 shrink-0 select-none">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-1.5 text-neutral-500 font-mono text-[9px]">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-green-500" />
            <span className="text-green-400 font-bold uppercase tracking-wider">Validator Console Output</span>
          </div>
          <span>WASM Sandbox: v0.92-b4</span>
        </div>

        <div className="font-mono text-[9px] space-y-0.5 h-16 overflow-y-auto select-all leading-normal text-green-500/90 max-h-16">
          {tickerLogs.map((log, index) => (
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
