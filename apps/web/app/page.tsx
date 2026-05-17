'use client';

import { useState, useEffect, useRef } from 'react';
import './globals.css';

export default function Lex8Dashboard() {
  const [isOffline, setIsOffline] = useState(false);
  const [showFixture, setShowFixture] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [draftText, setDraftText] = useState('IN THE UNITED STATES DISTRICT COURT\nFOR THE SOUTHERN DISTRICT OF NEW YORK\n\nAcme Corp,\n    Plaintiff,\nv.\nBeta LLC,\n    Defendant.\n\nMOTION FOR SUMMARY JUDGMENT\n');
  
  const draftAreaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Autosave (IndexedDB Simulation via localStorage for demo)
  useEffect(() => {
    const saved = localStorage.getItem('lex8_autosave');
    if (saved) setDraftText(saved);
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

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo-container">
          <h1>LEX8</h1>
          <p>The Defensible Legal AI Platform</p>
        </div>
        <div className="status-indicator">
          <div className={`dot ${isOffline ? 'offline' : ''}`}></div>
          {isOffline ? 'Cassette Mode' : 'Connected to Anchor8'}
        </div>
      </header>

      <nav className="nav-sidebar glass-panel">
        <div className="nav-item">📊 Matter Dashboard</div>
        <div className="nav-item">📚 Library</div>
        <div className="nav-item active">✍️ Drafter</div>
        <div className="nav-item">👁️ Vault Vision</div>
        <div className="nav-item">⚖️ War Room</div>
        <div className="nav-item">📈 Forecast</div>
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
          <button className="btn" onClick={() => showToast("Draft generation queued...")}>Generate Draft</button>
          <button className="btn" onClick={() => showToast("Draft Saved (IndexedDB sync complete)")}>Manual Save</button>
        </div>
      </main>

      <aside className="telemetry-sidebar glass-panel">
        <h3 style={{fontFamily: 'var(--font-heading)', marginBottom: '1rem'}}>Active Telemetry</h3>
        <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6}}>
          <p><strong>Latency:</strong> {isOffline ? '0ms (Offline)' : '42ms'}</p>
          <p><strong>Juror A (DeepSeek):</strong> PASS</p>
          <p><strong>Juror B (Claude):</strong> PASS</p>
          <div style={{marginTop: '1rem', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
            <em>Forensic narrative recording active. All actions cryptographically signed.</em>
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
