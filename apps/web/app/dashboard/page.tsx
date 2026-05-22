'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Shield,
  FileText,
  Search,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Database,
  Terminal,
  Layers,
  BookOpen,
  UserCheck,
  RefreshCw,
  FolderOpen,
  Clock,
  Play,
  Save,
  Check,
  X,
  AlertCircle,
  Activity,
  Target
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCompletion } from 'ai/react';

import { cn } from '../../lib/utils';
import { lex8Api } from '../../lib/api';
import { useDrafterStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../../components/ui/dropdown-menu';
import { MatterLibrary } from '../../components/MatterLibrary';
import { MatterDashboard } from '../../components/MatterDashboard';
import { ValidatorRules } from '../../components/ValidatorRules';
import { TribunalModule } from '../../components/TribunalModule';
import { TelemetryModule } from '../../components/TelemetryModule';
import { WarRoomSimulator } from '../../components/WarRoomSimulator';
import { CaseSynth } from '../../components/CaseSynth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../../components/ui/tooltip';

// Helper functions to map raw plaintext newlines to TipTap-friendly HTML paragraphs
const textToHtml = (text: string) => {
  if (!text) return '<p></p>';
  return text
    .split('\n')
    .map(line => `<p>${line || ''}</p>`)
    .join('');
};

const htmlToText = (html: string) => {
  if (typeof document === 'undefined') return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Replace <p> tags with text followed by newline
  const paragraphs = tempDiv.querySelectorAll('p');
  if (paragraphs.length > 0) {
    const lines: string[] = [];
    paragraphs.forEach((p) => {
      lines.push(p.innerText || p.textContent || '');
    });
    return lines.join('\n');
  }
  
  return tempDiv.innerText || tempDiv.textContent || '';
};

export default function Lex8Drafter() {
  
  // Zustand Store values
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    activeRightTab,
    setActiveRightTab,
    matters,
    activeMatterId,
    setActiveMatterId,
    draftText,
    setDraftText,
    draftTitle,
    setDraftTitle,
    activeTemplateId,
    setActiveTemplateId,
    isGenerating,
    setIsGenerating,
    citations,
    setCitations,
    selectedCitationId,
    setSelectedCitationId,
    complianceChecks,
    setComplianceChecks,
    tribunalReviews,
    setTribunalReviews,
    setActiveTribunalReviewId,
    auditLogs,
    addAuditLog,
    clearAuditLogs,
    isOfflineMode,
    setIsOfflineMode,
    setIsStreaming,
    streamPhase,
    setStreamPhase,
    activeModule,
    setActiveModule,
  } = useDrafterStore();

  // Local React States
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);
  const [adminOverrideCode, setAdminOverrideCode] = React.useState<string>('');
  const [showOverrideDialog, setShowOverrideDialog] = React.useState(false);
  const [tokensPerSecond, setTokensPerSecond] = React.useState(0);

  // TipTap Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: textToHtml(draftText),
    onUpdate: ({ editor }) => {
      const plainText = htmlToText(editor.getHTML());
      if (plainText !== useDrafterStore.getState().draftText) {
        setDraftText(plainText);
      }
    },
    editorProps: {
      attributes: {
        class: 'font-serif text-[11px] leading-6 bg-white text-neutral-800 p-4 h-full outline-hidden focus:outline-hidden min-h-[500px] overflow-y-auto [&_p]:my-0 [&_p]:min-h-[24px] [&_.ProseMirror]:outline-hidden',
      },
    },
  });

  // Lane 2 Intercept Handler
  const handleLane2Intercept = (partialCompletion: string) => {
    // 1. Halt stream immediately
    stop();

    // 2. Set generating & streaming states
    setIsStreaming(false);
    setStreamPhase('intercepted');
    setIsGenerating(false);
    
    // Set draftText to the truncated text
    setDraftText(partialCompletion);

    // 3. Switch active right tab to Tribunal side panel
    setActiveRightTab('tribunal');

    // 4. Mark Henderson citation as blocked (red warning status)
    const updatedCitations = useDrafterStore.getState().citations.map((c) => {
      if (c.id === 'cit-henderson') {
        return {
          ...c,
          status: 'blocked' as const,
          rahsScore: 92,
          snippet: 'Anchor8 citation lookup failed: "Henderson v. Continental Marine" is non-existent precedent.',
        };
      }
      return c;
    });
    setCitations(updatedCitations);

    // 5. Update compliance check to fail
    const updatedCompliance = useDrafterStore.getState().complianceChecks.map((check) => {
      if (check.ruleId === 'FRCP-11') {
        return {
          ...check,
          status: 'fail' as const,
          message: 'CRITICAL WARNING: Hallucinated precedent Henderson v. Continental Marine detected.',
        };
      }
      return check;
    });
    setComplianceChecks(updatedCompliance);

    // 6. Update tribunal review status to pending
    const updatedReviews = useDrafterStore.getState().tribunalReviews.map((r) => {
      if (r.id === 'rev-henderson') {
        return {
          ...r,
          status: 'pending' as const,
        };
      }
      return r;
    });
    setTribunalReviews(updatedReviews);

    // 7. Write to audit logs
    addAuditLog({
      level: 'critical',
      module: 'Lane-2-Intercept',
      message: 'LANE 2 INTERCEPT ENGAGED: Hallucinated authority "Henderson v. Continental Marine" detected in real-time stream. Halting stream.',
    });
    addAuditLog({
      level: 'info',
      module: 'Drafter',
      message: 'Drafting execution stream paused. Forwarded case review to Tribunal Adjudication queue.',
    });

    triggerToast('Lane 2 Intercept Engaged: Out-of-Distribution Precedent Blocked');
  };

  // Vercel AI SDK Stream Hook
  const { completion, complete, stop, isLoading } = useCompletion({
    api: '/api/completion',
    onResponse: () => {
      setIsStreaming(true);
      setStreamPhase('streaming');
      addAuditLog({
        level: 'info',
        module: 'Drafter',
        message: 'Initiated legal drafting sequence. Streaming draft...',
      });
    },
    onFinish: (prompt, completionValue) => {
      setIsStreaming(false);
      setStreamPhase('idle');
      setIsGenerating(false);
      
      // Update store text so other panels can inspect
      setDraftText(completionValue);
      
      addAuditLog({
        level: 'info',
        module: 'Drafter',
        message: 'Legal drafting stream complete.',
      });
    },
    onError: (err) => {
      setIsStreaming(false);
      setStreamPhase('error');
      setIsGenerating(false);
      addAuditLog({
        level: 'error',
        module: 'Drafter',
        message: `Drafting stream encountered an error: ${err.message}`,
      });
      triggerToast('Drafting stream failed');
    }
  });

  // Sync streaming completion with the TipTap editor
  React.useEffect(() => {
    if (completion && editor && isLoading) {
      // Look for the hallucinated citation
      if (completion.includes('See Henderson v. Continental Marine')) {
        const targetStr = 'See Henderson v. Continental Marine';
        const truncated = completion.slice(0, completion.indexOf(targetStr) + targetStr.length) + ', 412 F.3d 891 (5th Cir. 2005). [LANE 2 INTERCEPT ENGAGED]';
        
        editor.commands.setContent(textToHtml(truncated), false);
        handleLane2Intercept(truncated);
        return;
      }

      editor.commands.setContent(textToHtml(completion), false);
      
      // Auto scroll the editor element
      const viewport = editor.options.element?.closest('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [completion, editor, isLoading]);

  // Sync draftText updates from store (e.g. template changes, corrections) to TipTap editor
  React.useEffect(() => {
    if (editor && !isLoading) {
      const currentEditorContent = htmlToText(editor.getHTML());
      if (currentEditorContent !== draftText) {
        editor.commands.setContent(textToHtml(draftText), false);
      }
    }
  }, [draftText, editor, isLoading]);

  // Ticker animation
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const messages = [
        'PARSING CITATION SLOTS...',
        'CONNECTING TO ANCHOR8 VAULT...',
        'STREAMING MOTION DECREE PARAGRAPH 1...',
        'EVALUATING FIDUCIARY DUTY PRECEDENTS...',
        'COMPILING LAW BRIEF DOCUMENT STRUCTURE...',
        'RUNNING INLINE VEIL PIERCING SANITY CHECKS...',
      ];
      let idx = 0;
      setTokensPerSecond(Math.floor(Math.random() * 25) + 120); // 120-145 tk/s
      
      interval = setInterval(() => {
        setTickerMessage(`SYS: ${messages[idx % messages.length]}`);
        setTokensPerSecond(Math.floor(Math.random() * 20) + 130);
        idx++;
      }, 800);
    } else {
      setTickerMessage('SYS: IDLE. Ready for compile/verify sequence.');
      setTokensPerSecond(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Query for backend health
  const { isLoading: healthLoading } = useQuery({
    queryKey: ['moduleHealth'],
    queryFn: lex8Api.moduleHealth,
    refetchInterval: 30000,
  });

  // Query for templates
  useQuery({
    queryKey: ['drafterTemplates'],
    queryFn: lex8Api.drafterTemplates,
  });

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Get active matter details
  const activeMatter = matters.find((m) => m.id === activeMatterId) || matters[0] || {
    id: 'demo-acme-beta',
    name: 'Acme Corp v. Beta LLC',
    court: 'U.S. District Court, S.D.N.Y.',
    caseNumber: '1:24-cv-09876',
    description: '',
  };

  // Sync templates content when a user selects a template
  const handleSelectTemplate = (id: string, name: string) => {
    setActiveTemplateId(id);
    setDraftTitle(`${activeMatter.name} — ${name}`);
    
    let defaultContent = '';
    if (id === 'msj') {
      defaultContent = `IN THE UNITED STATES DISTRICT COURT\nFOR THE SOUTHERN DISTRICT OF NEW YORK\n\nACME CORP.,\n    Plaintiff,\nv.\nBETA LLC,\n    Defendant.\n\nCase No. 1:24-cv-09876-JMF\n\nPLAINTIFF ACME CORP.'S MEMORANDUM OF LAW IN SUPPORT OF\nITS MOTION FOR SUMMARY JUDGMENT ON LIABILITY\n\nI. INTRODUCTION\nThis dispute arises out of Beta LLC's clear, unexcused breach of the Joint Venture Agreement signed on November 12, 2023. Under Section 8.4, the co-venturers pledged absolute loyalty. However, Defendant commingled ledgers and siphoned source code.\n\nII. ARGUMENT\nA. Defendant Owed Plaintiff Fiduciary Duties under New York Law.\nUnder New York law, a joint venture agreement creates fiduciary obligations between the co-venturers. See Meinhard v. Salmon, 249 N.Y. 458 (1928). In his landmark opinion, Chief Judge Cardozo noted co-venturers owe "the duty of the finest loyalty" and "a punctilio of an honor the most sensitive." Id. at 464.\n\n[PENDING CITATION SLOT: Fiduciary duties survive the initial formal breakdown of the co-venturers' active project operations]\n\nB. Defendant Breached Fiduciary Duties Through Commingling.\nDefendant does not dispute it created a parallel ledger system. Commingling of joint venture assets is a per se breach of loyalty. See Henderson v. Continental Marine, 412 F.3d 891 (5th Cir. 2005).\n\n[PENDING CITATION SLOT: Reverse-piercing corporate veil where subsidiary ledger accounts are fully commingled]`;
    } else if (id === 'mtd') {
      defaultContent = `IN THE UNITED STATES DISTRICT COURT\nFOR THE SOUTHERN DISTRICT OF NEW YORK\n\nACME CORP.,\n    Plaintiff,\nv.\nBETA LLC,\n    Defendant.\n\nCase No. 1:24-cv-09876-JMF\n\nDEFENDANT BETA LLC'S MEMORANDUM OF LAW IN SUPPORT OF ITS\nMOTION TO DISMISS THE COMPLAINT UNDER RULE 12(B)(6)\n\nI. INTRODUCTION\nPlaintiff's Complaint fails to state a plausible claim for breach of fiduciary duty. Under New York law, simple arms-length commercial transactions do not elevate a contractual relationship into a joint venture or fiduciary partnership.\n\nII. ARGUMENT\nA. The Complaint Fails to Plead the Essential Elements of a Joint Venture.\nTo plead a joint venture under New York law, a plaintiff must allege mutual control, sharing of losses, and joint property. Plaintiff fails to allege any loss-sharing agreement.\n\n[PENDING CITATION SLOT: Under New York pleading standards, absence of loss-sharing agreement fatal to joint venture claim]\n`;
    } else {
      defaultContent = `MEMORANDUM OF PRIVILEGED WORK PRODUCT\n\nTO: Senior Litigation Committee\nFROM: Lead Counsel, Lex8 Drafter\nDATE: May 20, 2026\nRE: Acme Corp. v. Beta LLC - Defensibility Analysis\n\nSUMMARY\nThis memorandum outlines our litigation exposure and the risk of hallucinated authorities in current motions.\n`;
    }
    
    setDraftText(defaultContent);
    editor?.commands.setContent(textToHtml(defaultContent));
    addAuditLog({
      level: 'info',
      module: 'Drafter',
      message: `Template changed to ${name}. Text editor re-scaffolded.`,
    });
    triggerToast(`Template switched to ${name}`);
    setShowTemplateDialog(false);
  };

  // Run the full Lex8 Gatekeeper/Anchor8 Demo validation sequence
  const executeDemoSequence = async () => {
    if (isLoading || isGenerating) return;
    setIsGenerating(true);
    setIsStreaming(true);
    setStreamPhase('initiating');
    addAuditLog({
      level: 'info',
      module: 'Drafter',
      message: 'Querying upstream matter library and initiating text generation stream...',
    });
    
    // Call Vercel AI SDK complete
    complete(activeTemplateId);
  };

  // Handle Tribunal Administrative Code Override
  const handleOverrideAdjudication = () => {
    if (adminOverrideCode.trim() === 'OVERRIDE_ADMIN') {
      // Update citation state to verified
      const updatedCitations = citations.map((c) => {
        if (c.id === 'cit-henderson') {
          return {
            ...c,
            status: 'verified' as const,
            rahsScore: 0,
            snippet: 'Precedent manually validated by tribunal under Administrative Code OVERRIDE_ADMIN. Citation approved.',
          };
        }
        return c;
      });
      setCitations(updatedCitations);

      // Update tribunal review state
      const updatedReviews = tribunalReviews.map((r) => {
        if (r.id === 'rev-henderson') {
          return {
            ...r,
            status: 'adjudicated' as const,
            auditorComments: [...r.auditorComments, 'Tribunal Admin Override applied successfully by Lead Auditor.'],
          };
        }
        return r;
      });
      setTribunalReviews(updatedReviews);

      // Add audit log
      addAuditLog({
        level: 'info',
        module: 'Tribunal',
        message: 'Lead Auditor applied Administrative Code OVERRIDE_ADMIN. Unblocked drafting operations.',
      });

      // Clear warning state in compliance checks
      const updatedCompliance = complianceChecks.map((check) => {
        if (check.ruleId === 'FRCP-11') {
          return {
            ...check,
            status: 'pass' as const,
            message: 'Manual override engaged. Citation is authorized for court inclusion.',
          };
        }
        return check;
      });
      setComplianceChecks(updatedCompliance);

      // Remove intercept suffix if present and set streamPhase back to idle
      const cleaned = draftText.replace(' [LANE 2 INTERCEPT ENGAGED]', '');
      setDraftText(cleaned);
      setStreamPhase('idle');

      triggerToast('Tribunal override successful. Citation authorized.');
      setShowOverrideDialog(false);
      setAdminOverrideCode('');
    } else {
      triggerToast('Invalid administrative code.');
    }
  };

  // Keyboard shortcut simulator for Cassette Mode (Ctrl+Shift+O)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsOfflineMode(!isOfflineMode);
        addAuditLog({
          level: 'info',
          module: 'Global',
          message: isOfflineMode ? 'Online API Mode engaged.' : 'Offline Cassette replay system engaged.',
        });
        triggerToast(isOfflineMode ? 'Online Mode Active' : 'Offline Cassette Mode Active');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOfflineMode, setIsOfflineMode]);

  // Simulated Autosave effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('lex8_autosave_content', draftText);
    }, 5000);
    return () => clearInterval(interval);
  }, [draftText]);

  // Generate line numbers for the pleading paper layout (1 to 28)
  const lineNumbers = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-neutral-50 text-neutral-900 font-sans antialiased text-xs">
        
        {/* ========================================================================================= */}
        {/* LEFT COLUMN: COLLAPSIBLE SIDEBAR                                                          */}
        {/* ========================================================================================= */}
        <aside
          className={cn(
            'flex flex-col border-r border-neutral-200 bg-neutral-100 transition-all duration-150 relative select-none z-20',
            sidebarCollapsed ? 'w-10' : 'w-52'
          )}
        >
          {/* Top Logo Panel */}
          <div className="flex h-9 items-center justify-between border-b border-neutral-200 px-3 bg-neutral-200">
            {!sidebarCollapsed && (
              <Link href="/" className="flex items-center gap-1.5 font-mono font-bold tracking-tight text-neutral-800 no-underline hover:text-[#0033aa] transition-colors">
                <Shield className="h-4 w-4 text-[#0033aa]" />
                <span>LEX8 // DRAFTER</span>
              </Link>
            )}
            {sidebarCollapsed && (
              <Link href="/" className="mx-auto flex items-center no-underline">
                <Shield className="h-4 w-4 text-[#0033aa]" />
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-3 top-2.5 h-5 w-5 bg-white border border-neutral-200 rounded-none shadow-xs z-30 hover:bg-neutral-100 cursor-pointer"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>
          </div>

          {/* Matter Selector Dropdown */}
          {!sidebarCollapsed && (
            <div className="p-2 border-b border-neutral-200 bg-neutral-50">
              <span className="block text-[9px] font-mono uppercase text-neutral-400 font-semibold mb-1">
                Active Matter Context
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-mono text-[10px] text-left truncate rounded-none px-2 h-7">
                    <span className="truncate">{activeMatter.name}</span>
                    <FolderOpen className="h-3 w-3 shrink-0 ml-1 text-neutral-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Matter</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {matters.map((matter) => (
                    <DropdownMenuItem
                      key={matter.id}
                      onClick={() => {
                        setActiveMatterId(matter.id);
                        setDraftTitle(`${matter.name} — MSJ Brief`);
                        addAuditLog({
                          level: 'info',
                          module: 'MatterContext',
                          message: `Active matter context set to ${matter.name}.`,
                        });
                        triggerToast(`Switched context to ${matter.name}`);
                      }}
                      className={cn(
                        'text-[10px] font-mono justify-between',
                        matter.id === activeMatterId && 'bg-neutral-100 font-bold'
                      )}
                    >
                      <div className="flex flex-col truncate">
                        <span className="truncate font-semibold">{matter.name}</span>
                        <span className="text-[8px] text-neutral-400">{matter.court} • {matter.caseNumber}</span>
                      </div>
                      {matter.id === activeMatterId && <Check className="h-3.5 w-3.5 ml-1 text-neutral-800" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Module Navigation List */}
          <ScrollArea className="flex-1 py-2">
            <div className="space-y-1 px-1">
              {!sidebarCollapsed && (
                <span className="block px-2 text-[9px] font-mono uppercase text-neutral-400 font-semibold mb-1">
                  Matter Modules
                </span>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setActiveModule('dashboard');
                      addAuditLog({ level: 'info', module: 'Navigation', message: 'Switched module focus to Matter Dashboard.' });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 w-full text-left font-mono transition-colors cursor-pointer",
                      activeModule === 'dashboard'
                        ? "bg-white text-neutral-900 border-l-2 border-[#0033aa] font-semibold"
                        : "text-neutral-500 hover:bg-neutral-200"
                    )}
                  >
                    <Layers className={cn("h-3.5 w-3.5", activeModule === 'dashboard' ? "text-[#0033aa]" : "text-neutral-500")} />
                    {!sidebarCollapsed && <span>Matter Dashboard</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">Matter Dashboard</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setActiveModule('drafter');
                      addAuditLog({ level: 'info', module: 'Navigation', message: 'Switched module focus to Drafter Workspace.' });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 w-full text-left font-mono transition-colors cursor-pointer",
                      activeModule === 'drafter'
                        ? "bg-white text-neutral-900 border-l-2 border-[#0033aa] font-semibold"
                        : "text-neutral-500 hover:bg-neutral-200"
                    )}
                  >
                    <FileText className={cn("h-3.5 w-3.5", activeModule === 'drafter' ? "text-[#0033aa]" : "text-neutral-500")} />
                    {!sidebarCollapsed && <span>Drafter Workspace</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">Drafter Workspace</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setActiveModule('library');
                      addAuditLog({ level: 'info', module: 'Navigation', message: 'Switched module focus to Matter Library.' });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 w-full text-left font-mono transition-colors cursor-pointer",
                      activeModule === 'library'
                        ? "bg-white text-neutral-900 border-l-2 border-[#0033aa] font-semibold"
                        : "text-neutral-500 hover:bg-neutral-200"
                    )}
                  >
                    <Search className={cn("h-3.5 w-3.5", activeModule === 'library' ? "text-[#0033aa]" : "text-neutral-500")} />
                    {!sidebarCollapsed && <span>Matter Library</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">Matter Library</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setActiveModule('validator');
                      addAuditLog({ level: 'info', module: 'Navigation', message: 'Switched module focus to Validator Rules.' });
                    }}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 w-full text-left font-mono transition-colors cursor-pointer",
                      activeModule === 'validator'
                        ? "bg-white text-neutral-900 border-l-2 border-[#0033aa] font-semibold"
                        : "text-neutral-500 hover:bg-neutral-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={cn("h-3.5 w-3.5", activeModule === 'validator' ? "text-[#0033aa]" : "text-neutral-500")} />
                      {!sidebarCollapsed && <span>Validator Rules</span>}
                    </div>
                    {!sidebarCollapsed && complianceChecks.some((c) => c.status === 'fail') && (
                      <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    )}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">Validator Rules</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setActiveModule('tribunal');
                      addAuditLog({ level: 'info', module: 'Navigation', message: 'Switched module focus to Tribunal Adjudicator.' });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 w-full text-left font-mono transition-colors cursor-pointer",
                      activeModule === 'tribunal'
                        ? "bg-white text-neutral-900 border-l-2 border-[#0033aa] font-semibold"
                        : "text-neutral-500 hover:bg-neutral-200"
                    )}
                  >
                    <Scale className={cn("h-3.5 w-3.5", activeModule === 'tribunal' ? "text-[#0033aa]" : "text-neutral-500")} />
                    {!sidebarCollapsed && <span>Tribunal Adjudicator</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">Tribunal Adjudicator</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setActiveModule('warroom');
                      addAuditLog({ level: 'info', module: 'Navigation', message: 'Switched module focus to War Room Strategy Simulator.' });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 w-full text-left font-mono transition-colors cursor-pointer",
                      activeModule === 'warroom'
                        ? "bg-white text-neutral-900 border-l-2 border-[#0033aa] font-semibold"
                        : "text-neutral-500 hover:bg-neutral-200"
                    )}
                  >
                    <Target className={cn("h-3.5 w-3.5", activeModule === 'warroom' ? "text-[#0033aa]" : "text-neutral-500")} />
                    {!sidebarCollapsed && <span>War Room Simulator</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">War Room Simulator</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setActiveModule('telemetry');
                      addAuditLog({ level: 'info', module: 'Navigation', message: 'Switched module focus to Telemetry Observability.' });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 w-full text-left font-mono transition-colors cursor-pointer",
                      activeModule === 'telemetry'
                        ? "bg-white text-neutral-900 border-l-2 border-[#0033aa] font-semibold"
                        : "text-neutral-500 hover:bg-neutral-200"
                    )}
                  >
                    <Activity className={cn("h-3.5 w-3.5", activeModule === 'telemetry' ? "text-[#0033aa]" : "text-neutral-500")} />
                    {!sidebarCollapsed && <span>System Telemetry</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">System Telemetry</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setActiveModule('casesynth');
                      addAuditLog({ level: 'info', module: 'Navigation', message: 'Switched module focus to Case Synth Legal Intelligence.' });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 w-full text-left font-mono transition-colors cursor-pointer",
                      activeModule === 'casesynth'
                        ? "bg-white text-neutral-900 border-l-2 border-[#0033aa] font-semibold"
                        : "text-neutral-500 hover:bg-neutral-200"
                    )}
                  >
                    <BookOpen className={cn("h-3.5 w-3.5", activeModule === 'casesynth' ? "text-[#0033aa]" : "text-neutral-500")} />
                    {!sidebarCollapsed && <span>Case Synth</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">Case Synth</TooltipContent>}
              </Tooltip>
            </div>

            {/* Template Drawer (Quick Switcher) */}
            {!sidebarCollapsed && (
              <div className="mt-4 pt-4 border-t border-neutral-200 px-3">
                <span className="block text-[9px] font-mono uppercase text-neutral-400 font-semibold mb-2">
                  Drafting Templates
                </span>
                <div className="space-y-1">
                  <Button
                    variant={activeTemplateId === 'msj' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start font-mono text-[10px] text-left truncate"
                    onClick={() => handleSelectTemplate('msj', 'Motion for Summary Judgment')}
                  >
                    Motion Summary Judgment
                  </Button>
                  <Button
                    variant={activeTemplateId === 'mtd' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start font-mono text-[10px] text-left truncate"
                    onClick={() => handleSelectTemplate('mtd', 'Motion to Dismiss')}
                  >
                    Motion to Dismiss
                  </Button>
                  <Button
                    variant={activeTemplateId === 'memo' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start font-mono text-[10px] text-left truncate"
                    onClick={() => handleSelectTemplate('memo', 'Internal Memorandum')}
                  >
                    Privileged Memo
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* User Avatar + Dropdown */}
          <div className="border-t border-neutral-200 px-2 py-1.5 bg-neutral-50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex items-center gap-2 w-full rounded-none hover:bg-neutral-200 transition-colors px-1 py-1 cursor-pointer',
                    sidebarCollapsed ? 'justify-center' : 'justify-start'
                  )}
                >
                  {/* Avatar circle */}
                  <div className="h-6 w-6 rounded-full bg-[#0033aa] flex items-center justify-center shrink-0">
                    <span className="text-white font-mono font-bold text-[10px] leading-none">N</span>
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex flex-col items-start leading-tight overflow-hidden">
                      <span className="font-mono font-semibold text-[10px] text-neutral-800 truncate">Nimish Mittal</span>
                      <span className="font-mono text-[8px] text-neutral-400 truncate">Lead Auditor</span>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-44 font-mono text-[10px]"
              >
                <DropdownMenuLabel className="text-[9px] uppercase text-neutral-400 font-semibold tracking-wide pb-0">Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer no-underline text-neutral-700">
                    <UserCheck className="h-3 w-3" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer no-underline text-neutral-700">
                    <Terminal className="h-3 w-3" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center gap-2 cursor-pointer no-underline text-red-600 hover:text-red-700">
                    <X className="h-3 w-3" />
                    Sign Out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bottom Cassette/Status Toggles */}
          <div className="border-t border-neutral-200 p-2 bg-neutral-50 space-y-1">
            {!sidebarCollapsed && (
              <>
                <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 pb-1">
                  <span>Backend Gatekeeper</span>
                  <span className={cn(
                    'inline-block px-1 rounded-[1px] font-bold text-[8px]',
                    healthData?.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {healthLoading ? 'CONNECTING' : healthData?.status === 'ok' ? 'ACTIVE' : 'DEGRADED'}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'w-full font-mono text-[9px] h-6 justify-between select-none cursor-pointer',
                    isOfflineMode ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white'
                  )}
                  onClick={() => {
                    setIsOfflineMode(!isOfflineMode);
                    addAuditLog({
                      level: 'info',
                      module: 'Global',
                      message: `Mode toggled to: ${!isOfflineMode ? 'Offline Cassette Replay' : 'Live Gateway REST API'}.`,
                    });
                    triggerToast(!isOfflineMode ? 'Cassette Mode Engaged' : 'Online Mode Restored');
                  }}
                >
                  <div className="flex items-center gap-1">
                    <Database className="h-2.5 w-2.5" />
                    <span>{isOfflineMode ? 'Cassette Mode' : 'REST Gateway'}</span>
                  </div>
                  <div className={cn('h-1.5 w-1.5 rounded-full', isOfflineMode ? 'bg-amber-500 animate-pulse' : 'bg-green-500')} />
                </Button>
              </>
            )}
            
            {sidebarCollapsed && (
              <div className="flex justify-center py-1">
                <div className={cn('h-2 w-2 rounded-full', isOfflineMode ? 'bg-amber-500' : 'bg-green-500')} />
              </div>
            )}
          </div>
        </aside>

        {/* ========================================================================================= */}
        {/* CENTER COLUMN: DRAFTING WORKSPACE                                                         */}
        {/* ========================================================================================= */}
        <main className="flex-1 flex flex-col min-w-0 bg-white border-r border-neutral-200 z-10">
          {activeModule === 'dashboard' ? (
            <>
              {/* Matter Dashboard Header */}
              <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-3 bg-neutral-50 select-none shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[#0033aa] font-bold">MODULE:</span>
                  <span className="font-mono font-bold text-neutral-800 text-xs px-1">Matter Strategy Dashboard</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-400">
                  <span>Engine: Active</span>
                </div>
              </header>
              
              <MatterDashboard />
            </>
          ) : activeModule === 'library' ? (
            <>
              {/* Matter Library Header */}
              <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-3 bg-neutral-50 select-none shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-neutral-400 font-bold">MODULE:</span>
                  <span className="font-mono font-bold text-neutral-800 text-xs px-1">Matter Intel Library</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-400">
                  <span>Total Matters: {matters.length}</span>
                </div>
              </header>
              
              <MatterLibrary />
            </>
          ) : activeModule === 'validator' ? (
            <>
              {/* Validator Rules Header */}
              <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-3 bg-neutral-50 select-none shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-neutral-400 font-bold">MODULE:</span>
                  <span className="font-mono font-bold text-neutral-800 text-xs px-1">Validator Rulesets & Governance</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-400">
                  <span>Status: Operational</span>
                </div>
              </header>
              
              <ValidatorRules />
            </>
          ) : activeModule === 'tribunal' ? (
            <>
              {/* Tribunal Module Header */}
              <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-3 bg-neutral-50 select-none shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[#0033aa] font-bold">MODULE:</span>
                  <span className="font-mono font-bold text-neutral-800 text-xs px-1">Tribunal Consensus & Debate</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-400">
                  <span>Quorum: 2 Juror Models Active</span>
                </div>
              </header>
              
              <TribunalModule />
            </>
          ) : activeModule === 'telemetry' ? (
            <>
              {/* Telemetry Module Header */}
              <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-3 bg-neutral-50 select-none shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[#0033aa] font-bold">MODULE:</span>
                  <span className="font-mono font-bold text-neutral-800 text-xs px-1">Telemetry & Observability Console</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-400">
                  <span>Stream: Connected</span>
                </div>
              </header>
              
              <TelemetryModule />
            </>
          ) : activeModule === 'warroom' ? (
            <>
              {/* War Room Simulator Header */}
              <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-3 bg-neutral-50 select-none shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[#0033aa] font-bold">MODULE:</span>
                  <span className="font-mono font-bold text-neutral-800 text-xs px-1">War Room Litigation Simulator</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-400">
                  <span>Engine: Active (Monte Carlo)</span>
                </div>
              </header>
              
              <WarRoomSimulator />
            </>
          ) : activeModule === 'casesynth' ? (
            <>
              {/* Case Synth Module Header */}
              <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-3 bg-neutral-50 select-none shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[#0033aa] font-bold">MODULE:</span>
                  <span className="font-mono font-bold text-neutral-800 text-xs px-1">Case Synthesis & Legal Intelligence</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-400">
                  <span>Engine: Active (BERT-Legal)</span>
                </div>
              </header>
              
              <CaseSynth />
            </>
          ) : (
            <>
              {/* Page/Draft Context Header */}
              <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-3 bg-neutral-50 select-none">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-neutral-400 font-bold">DRAFT:</span>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="bg-transparent border-0 hover:bg-neutral-100 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-300 font-mono font-bold text-neutral-800 px-1 py-0.5 max-w-sm truncate text-xs"
                  />
                </div>
                
                <div className="flex items-center gap-1.5">
                  {/* Tokenized verified indicator */}
                  {citations.every((c) => c.status === 'verified') && (
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 font-mono text-[9px] font-semibold">
                      <Check className="h-3 w-3" />
                      <span>ANCHOR8 PASSED</span>
                    </div>
                  )}
                  {citations.some((c) => c.status === 'blocked') && (
                    <div className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 font-mono text-[9px] font-semibold animate-pulse">
                      <AlertCircle className="h-3 w-3" />
                      <span>ANCHOR8 BLOCKED</span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-none h-6 font-mono text-[10px] cursor-pointer"
                    onClick={() => {
                      localStorage.setItem('lex8_autosave_content', draftText);
                      addAuditLog({
                        level: 'info',
                        module: 'Drafter',
                        message: 'Draft manual save invoked to localStorage DB.',
                      });
                      triggerToast('Draft saved to storage');
                    }}
                  >
                    <Save className="h-3 w-3" />
                    <span>Save</span>
                  </Button>

                  <Button
                    variant={streamPhase === 'intercepted' ? 'destructive' : 'bloomberg'}
                    size="sm"
                    className={cn('gap-1 rounded-none h-6 text-[10px] cursor-pointer', (isLoading || isGenerating) && 'opacity-70 pointer-events-none')}
                    onClick={executeDemoSequence}
                  >
                    {streamPhase === 'intercepted' ? (
                      <>
                        <AlertCircle className="h-3 w-3 animate-pulse" />
                        <span>Intercept Engaged</span>
                      </>
                    ) : (isLoading || isGenerating) ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Streaming...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        <span>Compile & Verify</span>
                      </>
                    )}
                  </Button>
                </div>
              </header>

              {/* Matter Subtitle metadata */}
              <div className="flex items-center justify-between bg-neutral-100 px-3 py-1 border-b border-neutral-200 text-[10px] font-mono text-neutral-500 select-none">
                <div className="flex gap-4">
                  <span><strong>Docket:</strong> {activeMatter.caseNumber}</span>
                  <span><strong>Jurisdiction:</strong> {activeMatter.court}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  <span>Autosave: Idle</span>
                </div>
              </div>

              {/* Subtle Terminal-style Activity Ticker */}
              <div className="bg-neutral-900 text-neutral-400 border-b border-neutral-800 px-3 py-1 font-mono text-[9px] flex items-center justify-between select-none">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", isLoading ? "bg-green-500 animate-pulse" : "bg-neutral-600")} />
                  <span className="text-neutral-500 uppercase tracking-wider shrink-0">WASM-Citator:</span>
                  <span className={cn("truncate font-semibold", isLoading ? "text-green-400" : "text-neutral-400")}>{tickerMessage}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-neutral-500">
                  <span>RATE: {tokensPerSecond} tk/s</span>
                  <span>PHASE: {streamPhase.toUpperCase()}</span>
                </div>
              </div>

              {/* Lane 2 Intercept Warnings */}
              {streamPhase === 'intercepted' && (
                <div className="bg-red-50 border-b border-red-200 px-3 py-2 flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] font-bold text-red-800 uppercase tracking-wide">
                        Lane 2 Intercept Engaged — Generation Stream Suspended
                      </span>
                      <span className="text-[9px] text-red-600 font-mono leading-tight">
                        CRITICAL WARNING: Hallucinated precedent [Henderson v. Continental Marine] intercepted in real-time output.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-5 text-[9px] border-red-300 text-red-800 hover:bg-red-100 font-mono rounded-none px-2 cursor-pointer"
                      onClick={() => {
                        setActiveRightTab('tribunal');
                        triggerToast('Redirected to Tribunal Adjudication panel.');
                      }}
                    >
                      Resolve via Tribunal
                    </Button>
                  </div>
                </div>
              )}

              {/* Professional Pleading Paper Layout */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left margin line numbers for court pleading paper feel */}
                <div className={cn(
                  "w-9 border-r flex flex-col items-center pt-3 font-mono text-[10px] select-none leading-6 text-right pr-2 transition-colors duration-200",
                  streamPhase === 'intercepted'
                    ? "border-red-300 bg-red-50/50 text-red-300"
                    : "border-neutral-300 bg-neutral-50 text-neutral-300"
                )}>
                  {lineNumbers.map((num) => (
                    <div key={num} className="h-6">
                      {num}
                    </div>
                  ))}
                </div>

                {/* Main Draft Area */}
                <div className={cn(
                  "flex-1 flex flex-col relative h-full transition-colors duration-200",
                  streamPhase === 'intercepted' ? "bg-red-50/5" : "bg-white"
                )}>
                  <ScrollArea className="flex-1 w-full bg-white">
                    <EditorContent editor={editor} className="outline-hidden" />
                  </ScrollArea>

                  {/* Dynamic Interactive Citations Banner inside Center Workspace */}
                  <div className="absolute bottom-2 left-2 right-2 border border-neutral-200 bg-neutral-50 shadow-xs p-2 select-none z-10">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-1 mb-1 font-mono text-[10px] text-neutral-500">
                      <span className="font-bold flex items-center gap-1">
                        <Database className="h-3 w-3 text-[#0033aa]" />
                        <span>Inline Citations (Parsed from Draft)</span>
                      </span>
                      <span>Click a chip to audit</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {citations.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCitationId(c.id);
                            setActiveRightTab('anchor8');
                            addAuditLog({
                              level: 'info',
                              module: 'Anchor8',
                              message: `Focused citation audit: ${c.caseName}.`,
                            });
                          }}
                          className={cn(
                            'flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[9px] font-semibold transition-colors cursor-pointer',
                            c.id === selectedCitationId && 'ring-1 ring-[#0033aa]',
                            c.status === 'verified' && 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
                            c.status === 'blocked' && 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 animate-pulse',
                            c.status === 'pending' && 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                          )}
                        >
                          <div className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            c.status === 'verified' && 'bg-green-600',
                            c.status === 'blocked' && 'bg-red-600',
                            c.status === 'pending' && 'bg-amber-500'
                          )} />
                          <span>{c.citation} ({c.year})</span>
                        </button>
                      ))}
                      
                      {citations.length === 0 && (
                        <span className="text-[10px] text-neutral-400 font-mono italic">No legal citations found in draft.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <footer className="h-6 border-t border-neutral-200 bg-neutral-100 flex items-center justify-between px-3 font-mono text-[10px] text-neutral-500 select-none">
                <div className="flex gap-4">
                  <span><strong>Words:</strong> {draftText.split(/\s+/).filter(Boolean).length}</span>
                  <span><strong>Chars:</strong> {draftText.length}</span>
                  <span><strong>Tokens (est):</strong> {Math.ceil(draftText.length / 4)}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="flex items-center gap-1 text-green-700">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span>WASM Engine Status: OK</span>
                  </span>
                  <span>|</span>
                  <span>SDK: v1.8.0</span>
                </div>
              </footer>
            </>
          )}
        </main>

        {/* ========================================================================================= */}
        {/* RIGHT COLUMN: GOVERNANCE PANEL                                                            */}
        {/* ========================================================================================= */}
        <aside className="w-80 flex flex-col bg-neutral-100 select-none z-10">
          
          {/* Tab Navigation header */}
          <Tabs value={activeRightTab} onValueChange={(v) => setActiveRightTab(v as any)} className="w-full flex-1 flex flex-col">
            
            <TabsList className="grid grid-cols-4 h-9 bg-neutral-200 border-b border-neutral-300">
              <TabsTrigger value="anchor8" className="text-[10px]">Anchor8</TabsTrigger>
              <TabsTrigger value="validator" className="text-[10px]">Validator</TabsTrigger>
              <TabsTrigger value="tribunal" className="text-[10px]">Tribunal</TabsTrigger>
              <TabsTrigger value="telemetry" className="text-[10px]">Telemetry</TabsTrigger>
            </TabsList>

            {/* TAB CONTENT: ANCHOR8 VERIFICATION DETAILS */}
            <TabsContent value="anchor8" className="flex-1 flex flex-col m-0 p-0 overflow-hidden">
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  <div className="border border-neutral-200 bg-white p-2">
                    <h3 className="font-mono font-bold text-neutral-800 text-[11px] border-b border-neutral-100 pb-1 mb-2 uppercase tracking-wide">
                      Anchor8 Citation Defender
                    </h3>
                    <p className="text-neutral-500 leading-normal text-[10px]">
                      Anchor8 analyzes citations at token-level midstream using local WASM validation against pre-fetched Matter libraries. Prevents courtroom citation sanctions.
                    </p>
                  </div>

                  {/* List of citations */}
                  <div className="space-y-1.5">
                    <span className="block text-[9px] font-mono uppercase text-neutral-400 font-semibold px-0.5">
                      Citation Register
                    </span>
                    
                    {citations.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCitationId(c.id)}
                        className={cn(
                          'border p-2 cursor-pointer transition-colors',
                          c.id === selectedCitationId ? 'bg-white border-neutral-400' : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200'
                        )}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono font-bold text-neutral-800 truncate max-w-[150px]">{c.caseName}</span>
                          <span className={cn(
                            'px-1.5 py-0.5 font-mono text-[8px] font-bold',
                            c.status === 'verified' && 'bg-green-100 text-green-800',
                            c.status === 'blocked' && 'bg-red-100 text-red-800 animate-pulse',
                            c.status === 'pending' && 'bg-amber-100 text-amber-800'
                          )}>
                            {c.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                          <span>{c.citation} ({c.year})</span>
                          <span>RAHS: {c.rahsScore}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Focused Citation Details */}
                  {selectedCitationId && (
                    (() => {
                      const selectedCit = citations.find((c) => c.id === selectedCitationId);
                      if (!selectedCit) return null;
                      return (
                        <div className="border border-neutral-200 bg-white p-2.5 space-y-2">
                          <div className="flex justify-between items-start border-b border-neutral-100 pb-1.5">
                            <div>
                              <h4 className="font-mono font-bold text-neutral-800 text-[10px] leading-tight">
                                {selectedCit.caseName}
                              </h4>
                              <span className="text-[9px] text-neutral-400 font-mono">
                                {selectedCit.court} ({selectedCit.year})
                              </span>
                            </div>
                            <span className={cn(
                              'px-1.5 py-0.5 text-[8px] font-bold uppercase font-mono',
                              selectedCit.status === 'verified' && 'bg-green-100 text-green-800',
                              selectedCit.status === 'blocked' && 'bg-red-100 text-red-800',
                              selectedCit.status === 'pending' && 'bg-amber-100 text-amber-800'
                            )}>
                              {selectedCit.status}
                            </span>
                          </div>

                          <div className="space-y-1 font-mono text-[9px]">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Reporter:</span>
                              <span className="text-neutral-800 font-semibold">{selectedCit.citation}</span>
                            </div>
                            {selectedCit.pinpointCite && (
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Pinpoint:</span>
                                <span className="text-neutral-800 font-semibold">Page {selectedCit.pinpointCite}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-neutral-400">RAHS Risk Index:</span>
                              <span className={cn(
                                'font-bold',
                                selectedCit.rahsScore > 50 ? 'text-red-600' : 'text-green-700'
                              )}>
                                {selectedCit.rahsScore}% Risk
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Audit Timestamp:</span>
                              <span className="text-neutral-800">{selectedCit.checkedAt}</span>
                            </div>
                          </div>

                          <div className="border border-neutral-100 bg-neutral-50 p-2 font-mono text-[9px] text-neutral-600 leading-normal">
                            <strong>Validation Snippet:</strong>
                            <p className="mt-1 italic">"{selectedCit.snippet}"</p>
                          </div>

                          {selectedCit.status === 'blocked' && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1 text-red-700 bg-red-50 p-1.5 border border-red-200 text-[8px] font-mono leading-normal">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                <span><strong>Warning:</strong> Precedent not verified. This blocking error halts compiling. Adjudicate via Tribunal.</span>
                              </div>
                              <Button
                                variant="destructive"
                                className="w-full text-[9px] h-6 cursor-pointer"
                                onClick={() => {
                                  setActiveRightTab('tribunal');
                                  setActiveTribunalReviewId('rev-henderson');
                                  triggerToast('Redirected to Tribunal Adjudication queue');
                                }}
                              >
                                Resolve via Tribunal Queue
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* TAB CONTENT: COMPLIANCE CHECK VALIDATOR */}
            <TabsContent value="validator" className="flex-1 flex flex-col m-0 p-0 overflow-hidden">
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  <div className="border border-neutral-200 bg-white p-2">
                    <h3 className="font-mono font-bold text-neutral-800 text-[11px] border-b border-neutral-100 pb-1 mb-2 uppercase tracking-wide">
                      Validator Suite
                    </h3>
                    <p className="text-neutral-500 leading-normal text-[10px]">
                      Runs legal checks, local rulesets, formatting compliance, and ethical playbook audits on drafts.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[9px] font-mono uppercase text-neutral-400 font-semibold px-0.5">
                      Ruleset Checklist
                    </span>

                    {complianceChecks.map((check) => (
                      <div key={check.id} className="border border-neutral-200 bg-white p-2.5 space-y-1.5">
                        <div className="flex justify-between items-center border-b border-neutral-100 pb-1">
                          <span className="font-mono font-bold text-neutral-800 text-[10px]">{check.ruleId}: {check.title}</span>
                          <span className={cn(
                            'px-1.5 py-0.5 text-[8px] font-bold font-mono',
                            check.status === 'pass' && 'bg-green-50 text-green-700',
                            check.status === 'warning' && 'bg-amber-50 text-amber-700',
                            check.status === 'fail' && 'bg-red-50 text-red-700'
                          )}>
                            {check.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="font-mono text-[9px] text-neutral-600 leading-normal">{check.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* TAB CONTENT: TRIBUNAL REVIEW (LANE 4 ADJUDICATION) */}
            <TabsContent value="tribunal" className="flex-1 flex flex-col m-0 p-0 overflow-hidden">
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  <div className="border border-neutral-200 bg-white p-2">
                    <h3 className="font-mono font-bold text-neutral-800 text-[11px] border-b border-neutral-100 pb-1 mb-2 uppercase tracking-wide">
                      Administrative Tribunal
                    </h3>
                    <p className="text-neutral-500 leading-normal text-[10px]">
                      When Anchor8 halts streaming on critical warnings, Lead Auditors vote to bypass or require correction before enabling final filing operations.
                    </p>
                  </div>

                  {tribunalReviews.map((rev) => (
                    <div key={rev.id} className="border border-neutral-200 bg-white p-2.5 space-y-2">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-1.5">
                        <span className="font-mono font-bold text-neutral-800 text-[10px]">Review: {rev.id}</span>
                        <span className={cn(
                          'px-1.5 py-0.5 text-[8px] font-bold font-mono',
                          rev.status === 'pending' && 'bg-amber-100 text-amber-800 animate-pulse',
                          rev.status === 'adjudicated' && 'bg-green-100 text-green-800',
                          rev.status === 'breached' && 'bg-red-100 text-red-800'
                        )}>
                          {rev.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-1 font-mono text-[9px]">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Violation Reason:</span>
                          <span className="text-red-700 font-bold max-w-[150px] truncate text-right">{rev.reason}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">SLA Adjudication Clock:</span>
                          <span className="flex items-center gap-1 text-neutral-800 font-semibold">
                            <Clock className="h-3 w-3 text-amber-600" />
                            {rev.slaMinutesRemaining} minutes remaining
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Auditor Status:</span>
                          <span className="text-neutral-800">
                            {rev.votes.filter(v => v === 'reject').length} Reject Votes
                          </span>
                        </div>
                      </div>

                      {rev.proposedCorrection && (
                        <div className="bg-neutral-50 border border-neutral-200 p-2 font-mono text-[9px]">
                          <strong className="text-neutral-500">Proposed Precedent Bypasses:</strong>
                          <p className="mt-1 font-semibold text-neutral-800">{rev.proposedCorrection}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-[9px] h-5 mt-1.5 cursor-pointer font-mono font-normal"
                            onClick={() => {
                              // Replace the placeholder citation in draft
                              const replaced = draftText
                                .replace(
                                  'See Henderson v. Continental Marine, 412 F.3d 891 (5th Cir. 2005).',
                                  `See Meinhard v. Salmon, 249 N.Y. 458, 464 (1928).`
                                )
                                .replace(' [LANE 2 INTERCEPT ENGAGED]', '');
                              setDraftText(replaced);
                              setStreamPhase('idle');
                              
                              // Update citation status to verified
                              const updatedCitations = citations.map(c => {
                                if (c.id === 'cit-henderson') {
                                  return {
                                    ...c,
                                    caseName: 'Meinhard v. Salmon',
                                    citation: '249 N.Y. 458',
                                    year: 1928,
                                    status: 'verified' as const,
                                    rahsScore: 0,
                                    snippet: 'Meinhard replacement injected from tribunal suggestion.',
                                  };
                                }
                                return c;
                              });
                              setCitations(updatedCitations);

                              // Update Compliance
                              const updatedCompliance = complianceChecks.map(check => {
                                if (check.ruleId === 'FRCP-11') {
                                  return {
                                    ...check,
                                    status: 'pass' as const,
                                    message: 'Replaced fabricated Henderson citation with validated Meinhard precedent.',
                                  };
                                }
                                return check;
                              });
                              setComplianceChecks(updatedCompliance);

                              // Mark review adjudicated
                              setTribunalReviews(
                                tribunalReviews.map(r => r.id === rev.id ? { ...r, status: 'adjudicated' } : r)
                              );

                              addAuditLog({
                                level: 'info',
                                module: 'Tribunal',
                                message: 'Proposed Meinhard precedent replacement accepted. Compliance errors resolved.',
                              });

                              triggerToast('Suggested correction injected.');
                            }}
                          >
                            Inject Suggested Correction
                          </Button>
                        </div>
                      )}

                      {/* Auditor comments thread */}
                      <div className="space-y-1">
                        <span className="block text-[8px] font-mono uppercase text-neutral-400 font-semibold px-0.5">
                          Auditor Comments
                        </span>
                        <div className="bg-neutral-50 p-1.5 border border-neutral-100 rounded-none max-h-24 overflow-y-auto font-mono text-[9px] text-neutral-600 space-y-1">
                          {rev.auditorComments.map((comment, i) => (
                            <p key={i} className="border-b border-neutral-100 pb-1 last:border-0 last:pb-0">
                              • {comment}
                            </p>
                          ))}
                        </div>
                      </div>

                      {rev.status === 'pending' && (
                        <div className="pt-1.5 border-t border-neutral-100">
                          <Button
                            variant="bloomberg"
                            className="w-full text-[9px] h-6 cursor-pointer"
                            onClick={() => setShowOverrideDialog(true)}
                          >
                            Execute Admin Override Code
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {tribunalReviews.length === 0 && (
                    <div className="text-center py-4 border border-dashed border-neutral-200 text-neutral-400 font-mono text-[10px]">
                      No active tribunal adjudications.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* TAB CONTENT: WASM / AUDIT TELEMETRY LOGS */}
            <TabsContent value="telemetry" className="flex-1 flex flex-col m-0 p-0 overflow-hidden">
              <div className="flex-1 flex flex-col p-3 overflow-hidden">
                <div className="border border-neutral-200 bg-white p-2 mb-2 select-none">
                  <h3 className="font-mono font-bold text-neutral-800 text-[11px] border-b border-neutral-100 pb-1 mb-2 uppercase tracking-wide flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Terminal className="h-3.5 w-3.5 text-neutral-600" />
                      <span>Audit Telemetry</span>
                    </span>
                    <Button variant="ghost" className="h-4 px-1.5 text-[8px] cursor-pointer" onClick={clearAuditLogs}>
                      Clear Logs
                    </Button>
                  </h3>
                  <p className="text-neutral-500 leading-normal text-[10px]">
                    Real-time logging of WASM checks, REST queries, local DB cache actions, and cassette payloads.
                  </p>
                </div>

                {/* Dense Monospaced Terminal View */}
                <div className="flex-1 bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[9px] p-2 overflow-y-auto scrollbar-thin">
                  <div className="space-y-1.5">
                    {auditLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-1 leading-normal border-b border-neutral-800 pb-1 last:border-0 last:pb-0">
                        <span className="text-neutral-500 shrink-0 select-none">[{log.timestamp}]</span>
                        <span className={cn(
                          'font-bold shrink-0 px-1 text-[8px] select-none',
                          log.level === 'info' && 'bg-neutral-800 text-neutral-400',
                          log.level === 'warning' && 'bg-amber-900/50 text-amber-400',
                          log.level === 'critical' && 'bg-red-950/70 text-red-400 animate-pulse',
                          log.level === 'error' && 'bg-red-900/50 text-red-400'
                        )}>
                          {log.module.toUpperCase()}
                        </span>
                        <span className="break-all whitespace-pre-wrap">{log.message}</span>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <span className="text-neutral-600 italic">Logs are empty. Run Compile & Verify to capture logs.</span>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </aside>

      </div>

      {/* ========================================================================================= */}
      {/* OVERLAYS & MODAL DIALOGS                                                                  */}
      {/* ========================================================================================= */}

      {/* Tribunal Administrative Code Override Modal */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span>Administrative Override Adjudication</span>
            </DialogTitle>
            <DialogDescription>
              Authorize court pleading submission bypassing standard check triggers. Enter the audit override signature key.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2 font-mono text-xs">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="code" className="text-neutral-500">Security Override Passcode</label>
              <input
                id="code"
                type="text"
                placeholder="Enter OVERRIDE_ADMIN"
                value={adminOverrideCode}
                onChange={(e) => setAdminOverrideCode(e.target.value)}
                className="w-full bg-neutral-100 border border-neutral-300 px-3 py-1.5 font-mono text-xs text-neutral-800 uppercase focus:outline-hidden focus:ring-1 focus:ring-neutral-400 focus:bg-white"
              />
            </div>
            <div className="text-[10px] text-neutral-500 leading-normal bg-neutral-50 border border-neutral-200 p-2">
              ⚠️ Warning: Admin override bypasses FRCP Rule 11 verification. Your auditor credentials will be recorded in the persistent blockchain telemetry log.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none cursor-pointer" onClick={() => setShowOverrideDialog(false)}>
              Cancel
            </Button>
            <Button variant="bloomberg" className="rounded-none cursor-pointer" onClick={handleOverrideAdjudication}>
              Authorize Bypass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-neutral-900 border border-neutral-700 text-white font-mono text-[10px] px-3 py-1.5 shadow-md flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-[#0033aa]" />
          <span>{toastMsg}</span>
        </div>
      )}

    </TooltipProvider>
  );
}
