import { create } from 'zustand';

export interface Matter {
  id: string;
  name: string;
  court: string;
  caseNumber: string;
  docketUrl?: string;
  description: string;
  status: 'active' | 'closed' | 'suspended' | 'adjudicating' | 'pending_appeal';
  assignedCounsel: string;
  tribunalRiskScore: number;
  lastActivity: string;
  client: string;
  practiceGroup: string;
}

export interface Citation {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: number;
  status: 'verified' | 'blocked' | 'pending';
  lane: number;
  rahsScore: number; // Risk Assessment of Hallucinated Citation (0-100)
  snippet: string;
  overruled?: boolean;
  pinpointCite?: string;
  checkedAt: string;
}

export interface ComplianceCheck {
  id: string;
  ruleId: string;
  title: string;
  category: 'FRCP' | 'Local SDNY' | 'Firm Playbook' | 'Ethical';
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export interface TribunalReview {
  id: string;
  actionId: string;
  citationId?: string;
  matterId: string;
  status: 'pending' | 'adjudicated' | 'breached';
  slaMinutesRemaining: number;
  votes: ('approve' | 'reject' | 'abstain')[];
  auditorComments: string[];
  reason: string;
  proposedCorrection?: string;
}

export interface AuditLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  module: string;
  message: string;
}

interface DrafterState {
  // Sidebar states
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Right panel states
  activeRightTab: 'anchor8' | 'validator' | 'tribunal' | 'telemetry';
  setActiveRightTab: (tab: 'anchor8' | 'validator' | 'tribunal' | 'telemetry') => void;
  
  // Matter states
  matters: Matter[];
  activeMatterId: string;
  setActiveMatterId: (id: string) => void;
  
  // Drafting states
  draftText: string;
  setDraftText: (text: string) => void;
  draftTitle: string;
  setDraftTitle: (title: string) => void;
  activeTemplateId: string;
  setActiveTemplateId: (templateId: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  
  // Citations (Anchor8)
  citations: Citation[];
  setCitations: (citations: Citation[]) => void;
  selectedCitationId: string | null;
  setSelectedCitationId: (id: string | null) => void;
  
  // Compliance Checks (Validator)
  complianceChecks: ComplianceCheck[];
  setComplianceChecks: (checks: ComplianceCheck[]) => void;
  
  // Tribunal Reviews (Lane 4)
  tribunalReviews: TribunalReview[];
  setTribunalReviews: (reviews: TribunalReview[]) => void;
  activeTribunalReviewId: string | null;
  setActiveTribunalReviewId: (id: string | null) => void;
  
  // Telemetry Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'timestamp'>) => void;
  clearAuditLogs: () => void;
  
  // Global States
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  streamPhase: string;
  setStreamPhase: (phase: string) => void;
  activeModule: 'drafter' | 'library' | 'validator' | 'tribunal' | 'telemetry' | 'warroom' | 'casesynth' | 'dashboard';
  setActiveModule: (module: 'drafter' | 'library' | 'validator' | 'tribunal' | 'telemetry' | 'warroom' | 'casesynth' | 'dashboard') => void;
}

export const useDrafterStore = create<DrafterState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  activeRightTab: 'anchor8',
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),
  
  matters: [
    {
      id: 'demo-acme-beta',
      name: 'Acme Corp v. Beta LLC',
      court: 'U.S. District Court, S.D.N.Y.',
      caseNumber: '1:24-cv-09876',
      description: 'Breach of joint venture agreement and theft of trade secrets concerning cloud-based ledger synchronization technology.',
      status: 'adjudicating',
      assignedCounsel: 'S. Vance (Lead Partner)',
      tribunalRiskScore: 92,
      lastActivity: '2026-05-20 15:45',
      client: 'Acme Corporate Holdings',
      practiceGroup: 'Commercial Litigation'
    },
    {
      id: 'matter-2',
      name: 'In re Sentinel Capital Group',
      court: 'U.S. Bankruptcy Court, D. Del.',
      caseNumber: '24-11002',
      description: 'Chapter 11 clawback actions against institutional lenders.',
      status: 'active',
      assignedCounsel: 'M. Ross (Associate)',
      tribunalRiskScore: 18,
      lastActivity: '2026-05-20 11:20',
      client: 'Sentinel Liquidation Trust',
      practiceGroup: 'Restructuring'
    },
    {
      id: 'matter-3',
      name: 'US v. Alvarez Logistics',
      court: 'U.S. District Court, D.N.J.',
      caseNumber: '2:25-cr-00124',
      description: 'Defending compliance program against federal export control violation charges.',
      status: 'active',
      assignedCounsel: 'H. Specter (Senior Partner)',
      tribunalRiskScore: 45,
      lastActivity: '2026-05-19 16:30',
      client: 'Alvarez Logistics Inc.',
      practiceGroup: 'White Collar & Gov Investigations'
    },
    {
      id: 'matter-4',
      name: 'FTC v. Horizon Telecom Inc.',
      court: 'U.S. District Court, D.D.C.',
      caseNumber: '1:25-cv-04021',
      description: 'Federal Trade Commission antitrust challenge to proposed telecom merger.',
      status: 'suspended',
      assignedCounsel: 'J. Pearson (Managing Partner)',
      tribunalRiskScore: 63,
      lastActivity: '2026-05-18 10:14',
      client: 'Horizon Telecom Group',
      practiceGroup: 'Antitrust'
    },
    {
      id: 'matter-5',
      name: 'State of New York v. Apex Pharma',
      court: 'New York Supreme Court, N.Y. Cty.',
      caseNumber: '450123/2025',
      description: 'State consumer protection fraud action targeting secondary marketing assertions.',
      status: 'pending_appeal',
      assignedCounsel: 'E. Darby (Partner)',
      tribunalRiskScore: 87,
      lastActivity: '2026-05-15 09:00',
      client: 'Apex Pharmaceuticals Corp.',
      practiceGroup: 'Healthcare Regulatory'
    },
    {
      id: 'matter-6',
      name: 'Lexington Ins. v. Chevron Refineries',
      court: 'U.S. District Court, S.D. Tex.',
      caseNumber: '4:24-cv-08891',
      description: 'Subrogation insurance recovery litigation from refining facility turbine malfunctions.',
      status: 'closed',
      assignedCounsel: 'R. Zane (Partner)',
      tribunalRiskScore: 4,
      lastActivity: '2026-05-12 14:02',
      client: 'Lexington Underwriters',
      practiceGroup: 'Insurance Coverage'
    },
    {
      id: 'matter-7',
      name: 'Vanderbilt Estates v. Town of Southampton',
      court: 'U.S. District Court, E.D.N.Y.',
      caseNumber: '2:25-cv-01254',
      description: 'Section 1983 civil rights and zoning dispute regarding beach access easements.',
      status: 'active',
      assignedCounsel: 'K. Weller (Associate)',
      tribunalRiskScore: 31,
      lastActivity: '2026-05-20 15:10',
      client: 'Vanderbilt Trust',
      practiceGroup: 'Real Estate & Land Use'
    },
    {
      id: 'matter-8',
      name: 'In re Halcyon Crypto Trading LLC',
      court: 'U.S. Bankruptcy Court, S.D.N.Y.',
      caseNumber: '25-10492',
      description: 'Chapter 11 asset recovery and unwinding of cross-margin digital assets.',
      status: 'adjudicating',
      assignedCounsel: 'L. Litt (Senior Partner)',
      tribunalRiskScore: 78,
      lastActivity: '2026-05-20 16:15',
      client: 'Halcyon Creditors Committee',
      practiceGroup: 'Restructuring'
    }
  ],
  activeMatterId: 'demo-acme-beta',
  setActiveMatterId: (id) => set({ activeMatterId: id }),
  
  draftText: `IN THE UNITED STATES DISTRICT COURT
FOR THE SOUTHERN DISTRICT OF NEW YORK

ACME CORP.,
    Plaintiff,
v.
BETA LLC,
    Defendant.

Case No. 1:24-cv-09876-JMF

PLAINTIFF ACME CORP.'S MEMORANDUM OF LAW IN SUPPORT OF
ITS MOTION FOR SUMMARY JUDGMENT ON LIABILITY

I. INTRODUCTION
This dispute arises out of Beta LLC's clear, unexcused breach of the Joint Venture Agreement signed on November 12, 2023. Under Section 8.4, the parties pledged absolute loyalty and commited to shared technology development. However, Defendant commingled ledgers and siphoned source code to its proprietary software suite.

II. ARGUMENT
A. Defendant Owed Plaintiff Fiduciary Duties under New York Law.
Under well-established New York law, a joint venture agreement creates fiduciary obligations between the co-venturers. See Meinhard v. Salmon, 249 N.Y. 458 (1928). In his landmark opinion, Chief Judge Cardozo noted that joint adventurers owe "the duty of the finest loyalty" and "a punctilio of an honor the most sensitive." Id. at 464.

[PENDING CITATION SLOT: Fiduciary duties survive the initial formal breakdown of the co-venturers' active project operations]

B. Defendant Breached Fiduciary Duties Through Commingling.
Defendant does not dispute it created a parallel ledger system. Commingling of joint venture assets is a per se breach of loyalty. See Henderson v. Continental Marine, 412 F.3d 891 (5th Cir. 2005).

[PENDING CITATION SLOT: Reverse-piercing corporate veil where subsidiary ledger accounts are fully commingled]
`,
  setDraftText: (text) => set({ draftText: text }),
  draftTitle: 'Acme v. Beta — Motion for Summary Judgment Brief',
  setDraftTitle: (title) => set({ draftTitle: title }),
  activeTemplateId: 'msj',
  setActiveTemplateId: (templateId) => set({ activeTemplateId: templateId }),
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  citations: [
    {
      id: 'cit-meinhard',
      caseName: 'Meinhard v. Salmon',
      citation: '249 N.Y. 458',
      court: 'New York Court of Appeals',
      year: 1928,
      status: 'verified',
      lane: 1,
      rahsScore: 0,
      snippet: 'Joint adventurers owe co-venturers the duty of the finest loyalty, a punctilio of an honor the most sensitive.',
      pinpointCite: '464',
      checkedAt: '12:04:15',
    },
    {
      id: 'cit-henderson',
      caseName: 'Henderson v. Continental Marine',
      citation: '412 F.3d 891',
      court: 'U.S. Court of Appeals, 5th Circuit',
      year: 2005,
      status: 'blocked',
      lane: 2,
      rahsScore: 92,
      snippet: 'A fabricated precedent. Upstream Lex8 validator detected no docket registry matches for "Henderson v. Continental Marine" at 412 F.3d 891.',
      overruled: true,
      checkedAt: '12:04:18',
    }
  ],
  setCitations: (citations) => set({ citations }),
  selectedCitationId: null,
  setSelectedCitationId: (id) => set({ selectedCitationId: id }),
  
  complianceChecks: [
    {
      id: 'check-1',
      ruleId: 'SDNY-11.2',
      title: 'Double-Spaced Line Formatting',
      category: 'Local SDNY',
      status: 'pass',
      message: 'Line spacing satisfies the Local Rule 11.2 formatting check.',
    },
    {
      id: 'check-2',
      ruleId: 'FRCP-11',
      title: 'Forensic Precedent Validation',
      category: 'FRCP',
      status: 'fail',
      message: 'Draft contains a citation flagged as non-existent or fabricated (Henderson v. Continental Marine). Verify manually under Rule 11 sanction threat.',
    },
    {
      id: 'check-3',
      ruleId: 'FIRM-09',
      title: 'Confidentiality Adjudication',
      category: 'Firm Playbook',
      status: 'warning',
      message: 'Draft mentions unredacted ledger accounts. Verify Vault Vision redactions before final PACER upload.',
    }
  ],
  setComplianceChecks: (checks) => set({ complianceChecks: checks }),
  
  tribunalReviews: [
    {
      id: 'rev-henderson',
      actionId: 'act-001',
      citationId: 'cit-henderson',
      matterId: 'demo-acme-beta',
      status: 'pending',
      slaMinutesRemaining: 14,
      votes: ['reject', 'reject'],
      auditorComments: ['Precedent cannot be found in SDNY or 5th Circuit. Suggesting Meinhard pinpoints or alternative real case.', 'Adjudication flow initiated.'],
      reason: 'Hallucinated Citation Henderson v. Continental Marine, 412 F.3d 891 (5th Cir. 2005) detected.',
      proposedCorrection: 'Meinhard v. Salmon, 249 N.Y. 458, 464 (1928)'
    }
  ],
  setTribunalReviews: (reviews) => set({ tribunalReviews: reviews }),
  activeTribunalReviewId: 'rev-henderson',
  setActiveTribunalReviewId: (id) => set({ activeTribunalReviewId: id }),
  
  auditLogs: [
    { timestamp: '12:00:01', level: 'info', module: 'WASM-Citator', message: 'WASM citator engine initialized successfully.' },
    { timestamp: '12:00:03', level: 'info', module: 'Gateway-API', message: 'Connected to Lex8 core gateway at http://localhost:8000.' },
    { timestamp: '12:04:15', level: 'info', module: 'Anchor8', message: 'Verified citation: Meinhard v. Salmon, 249 N.Y. 458 (1928). Status: VALID.' },
    { timestamp: '12:04:18', level: 'critical', module: 'Validator', message: 'CRITICAL ERROR: Detected hallucinated citation Henderson v. Continental Marine, 412 F.3d 891 (5th Cir. 2005).' },
    { timestamp: '12:04:19', level: 'warning', module: 'Lane-2-Intercept', message: 'Lane 2 Intercept engaged. Execution stream paused. Forwarded case review to Tribunal Adjudication queue.' }
  ],
  addAuditLog: (log) => set((state) => ({
    auditLogs: [...state.auditLogs, { ...log, timestamp: new Date().toTimeString().split(' ')[0] || new Date().toLocaleTimeString() }]
  })),
  clearAuditLogs: () => set({ auditLogs: [] }),
  
  isOfflineMode: false,
  setIsOfflineMode: (offline) => set({ isOfflineMode: offline }),
  isStreaming: false,
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  streamPhase: 'idle',
  setStreamPhase: (phase) => set({ streamPhase: phase }),
  activeModule: 'drafter',
  setActiveModule: (module) => set({ activeModule: module })
}));
