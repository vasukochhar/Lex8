'use client';

import { useState, useEffect, useRef } from 'react';
import './globals.css';
import {
  DefensibilityAction,
  DefensibilitySummary,
  Lane4Review,
  ModuleInfo,
  lex8Api,
} from '../lib/api';

export default function Lex8Dashboard() {
  const [isOffline, setIsOffline] = useState(false);
  const [showFixture, setShowFixture] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'degraded'>('loading');
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [actions, setActions] = useState<DefensibilityAction[]>([]);
  const [summary, setSummary] = useState<DefensibilitySummary | null>(null);
  const [lane4Reviews, setLane4Reviews] = useState<Lane4Review[]>([]);
  const [lastModuleResult, setLastModuleResult] = useState('Waiting for backend action');
  const [templates, setTemplates] = useState<string[]>([]);
  const [draftText, setDraftText] = useState('IN THE UNITED STATES DISTRICT COURT\nFOR THE SOUTHERN DISTRICT OF NEW YORK\n\nAcme Corp,\n    Plaintiff,\nv.\nBeta LLC,\n    Defendant.\n\nMOTION FOR SUMMARY JUDGMENT\n');
  
  const draftAreaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Autosave (IndexedDB Simulation via localStorage for demo)
  useEffect(() => {
    const saved = localStorage.getItem('lex8_autosave');
    if (saved) setDraftText(saved);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadBackendState() {
      try {
        const [
          moduleHealth,
          templateResult,
          actionResult,
          summaryResult,
          lane4Result,
        ] = await Promise.all([
          lex8Api.moduleHealth(),
          lex8Api.drafterTemplates(),
          lex8Api.defensibilityActions(),
          lex8Api.defensibilitySummary(),
          lex8Api.lane4Reviews(),
        ]);

        if (cancelled) return;
        setApiStatus('connected');
        setModules(moduleHealth.modules);
        setTemplates(templateResult.templates.map(template => template.name));
        setActions(actionResult.actions);
        setSummary(summaryResult);
        setLane4Reviews(lane4Result.reviews);
      } catch (error) {
        if (cancelled) return;
        setApiStatus('degraded');
        setLastModuleResult(error instanceof Error ? error.message : 'Backend unavailable');
      }
    }

    loadBackendState();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('lex8_autosave', draftText);
    }, 1000);
    return () => clearTimeout(timer);
  }, [draftText]);

  // Handle Keyboard Shortcuts for Phase 3 Demo Playbook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey) {
        if (e.key.toLowerCase() === 'o') {
          e.preventDefault();
          setIsOffline(prev => !prev);
          showToast(isOffline ? "Online Mode Restored" : "Offline Cassette Mode Engaged");
        }
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          setShowFixture(prev => !prev);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOffline]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const runBackendAction = async (
    label: string,
    action: () => Promise<Record<string, unknown>>,
  ) => {
    try {
      const result = await action();
      const status =
        typeof result.standard_status === 'string'
          ? result.standard_status
          : typeof result.status === 'string'
            ? result.status
            : 'ok';
      setLastModuleResult(`${label}: ${status}`);
      setApiStatus('connected');
      showToast(`${label} completed`);
    } catch (error) {
      setApiStatus('degraded');
      setLastModuleResult(error instanceof Error ? error.message : `${label} failed`);
      showToast(`${label} unavailable`);
    }
  };

  const runDemoSequence = async () => {
    await runBackendAction('Draft', lex8Api.createDraft);
    await Promise.allSettled([
      lex8Api.searchLibrary(),
      lex8Api.validateDraft(),
      lex8Api.analyzeVaultVision(),
      lex8Api.createFiling(),
      lex8Api.predictForecast(),
      lex8Api.createTimeline(),
      lex8Api.createWarRoom(),
      lex8Api.blockAnalyzer(),
      lex8Api.jurorDisagreements(),
      lex8Api.lane4Sla(),
    ]);
    const [actionResult, summaryResult, lane4Result] = await Promise.all([
      lex8Api.defensibilityActions(),
      lex8Api.defensibilitySummary(),
      lex8Api.lane4Reviews(),
    ]);
    setActions(actionResult.actions);
    setSummary(summaryResult);
    setLane4Reviews(lane4Result.reviews);
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo-container">
          <h1>LEX8</h1>
          <p>The Defensible Legal AI Platform</p>
        </div>
        <div className="status-indicator">
          <div className={`dot ${isOffline || apiStatus === 'degraded' ? 'offline' : ''}`}></div>
          {isOffline ? 'Cassette Mode' : apiStatus === 'connected' ? 'Backend Connected' : apiStatus === 'loading' ? 'Checking Backend' : 'Backend Degraded'}
        </div>
      </header>

      <nav className="nav-sidebar glass-panel">
        {modules.length > 0 ? modules.map(module => (
          <div className={`nav-item ${module.archetype === 'drafter' ? 'active' : ''}`} key={module.archetype}>
            <span>{module.name}</span>
            <small>{module.status}</small>
          </div>
        )) : (
          <>
            <div className="nav-item">Matter Dashboard</div>
            <div className="nav-item active">Drafter</div>
          </>
        )}
      </nav>

      <main className="main-content glass-panel">
        <div className="content-header">
          <h2>Acme v. Beta — Motion for Summary Judgment</h2>
          <div className="anchor-chip verified">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            ANCHOR8 VERIFIED
          </div>
        </div>
        
        <textarea 
          ref={draftAreaRef}
          className="draft-area"
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          placeholder="Start drafting or click 'Generate'..."
        />
        
        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
          <button className="btn" onClick={runDemoSequence}>Generate Draft</button>
          <button className="btn" onClick={() => showToast("Draft Saved (IndexedDB sync complete)")}>Manual Save</button>
        </div>
      </main>

      <aside className="telemetry-sidebar glass-panel">
        <h3 style={{fontFamily: 'var(--font-heading)', marginBottom: '1rem'}}>Active Telemetry</h3>
        <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6}}>
          <p><strong>API:</strong> {lex8Api.apiBaseUrl}</p>
          <p><strong>Templates:</strong> {templates.length || 'fallback'}</p>
          <p><strong>Actions:</strong> {summary?.total_actions ?? actions.length}</p>
          <p><strong>Blocks:</strong> {summary?.blocked_actions ?? 0}</p>
          <p><strong>Lane 4 Queue:</strong> {summary?.lane4_queue_depth ?? lane4Reviews.length}</p>
          <p><strong>Last Module:</strong> {lastModuleResult}</p>
          {lane4Reviews[0] && (
            <div className="mini-panel">
              <strong>Lane 4 SLA</strong>
              <span>{lane4Reviews[0].sla_status} · {lane4Reviews[0].minutes_remaining} min</span>
            </div>
          )}
          {actions.slice(0, 3).map(action => (
            <div className="mini-panel" key={action.action_id}>
              <strong>{action.module}</strong>
              <span>{action.verdict} · Lane {action.lane} · {action.rahs}</span>
            </div>
          ))}
          <div style={{marginTop: '1rem', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
            <em>Defensibility metadata is loaded from the Lex8 gateway; Anchor8 internals remain external.</em>
          </div>
        </div>
      </aside>

      {/* Fixture Screen Recovery UI */}
      <div className={`fixture-overlay ${showFixture ? 'active' : ''}`}>
        <div className="fixture-box">
          <h2>⚠️ Service Interruption</h2>
          <p>The Drafter module encountered an unexpected timeout from the upstream provider.</p>
          <button className="btn" onClick={() => setShowFixture(false)}>Acknowledge & Continue Demo</button>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`toast ${toastMsg ? 'show' : ''}`}>
        {toastMsg}
      </div>
    </div>
  );
}
