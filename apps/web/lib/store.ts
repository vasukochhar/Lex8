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





interface DrafterState {
  // Sidebar states
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  
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
  
  
  
  
  
  // Global States
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  streamPhase: string;
  setStreamPhase: (phase: string) => void;

  activeModule: 'drafter' | 'library' | 'casesynth' | 'dashboard';
  setActiveModule: (module: 'drafter' | 'library' | 'casesynth' | 'dashboard') => void;
  auditLogs: any[];
  addAuditLog: (entry: any) => void;
  clearAuditLogs: () => void;
}

export const useDrafterStore = create<DrafterState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  
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
  
  
  
  
  
  isStreaming: false,
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  streamPhase: 'idle',
  setStreamPhase: (phase) => set({ streamPhase: phase }),

  activeModule: 'drafter',
  setActiveModule: (module) => set({ activeModule: module }),
  auditLogs: [
    { timestamp: '09:12:44', level: 'info', module: 'Anchor8', message: 'WASM citator initialized. Matter library cassette loaded.' },
    { timestamp: '09:13:01', level: 'critical', module: 'Anchor8', message: 'RASH ALERT: Henderson v. Continental Marine flagged as unverifiable. Stream intercepted.' },
  ],
  addAuditLog: (entry) => set((state) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    return { auditLogs: [...state.auditLogs, { ...entry, timestamp }] };
  }),
  clearAuditLogs: () => set({ auditLogs: [] })
}));

