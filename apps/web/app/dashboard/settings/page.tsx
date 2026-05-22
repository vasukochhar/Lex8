'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Terminal, ArrowLeft, Save, Check, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

// --- Types ---
type SaveState = 'idle' | 'saving' | 'saved';

// --- Toggle Component ---
function Toggle({
  enabled,
  onChange,
  id,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-150 focus:outline-none',
        enabled
          ? 'bg-[#0033aa] border-[#0033aa]'
          : 'bg-neutral-200 border-neutral-300'
      )}
    >
      <span
        className={cn(
          'inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-150',
          enabled ? 'translate-x-3.5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

// --- Section Label ---
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-mono text-[9px] uppercase text-neutral-400 font-semibold tracking-wider mb-2 pt-1">
      {children}
    </span>
  );
}

// --- Row wrapper ---
function SettingRow({
  label,
  sublabel,
  children,
}: {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border border-neutral-200 bg-neutral-50 px-3 py-2 gap-4">
      <div className="flex flex-col min-w-0">
        <span className="font-mono text-[10px] text-neutral-700 font-medium">{label}</span>
        {sublabel && (
          <span className="font-mono text-[9px] text-neutral-400 leading-tight">{sublabel}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  // --- Governance Engine ---
  const [failClosedThreshold, setFailClosedThreshold] = useState('0.82');
  const [tribunalQuorum, setTribunalQuorum] = useState('3');
  const [lane2Sensitivity, setLane2Sensitivity] = useState('high');
  const [cassetteReplay, setCassetteReplay] = useState(false);

  // --- Integrations ---
  const [westlawEndpoint, setWestlawEndpoint] = useState('https://api.westlaw.com/v1');
  const [anchor8Uri, setAnchor8Uri] = useState('vault://anchor8.lex8.io/primary');
  const [didRegistry, setDidRegistry] = useState('did:eth:mainnet');

  // --- Audit & Compliance ---
  const [auditLogging, setAuditLogging] = useState(true);
  const [euAiActMode, setEuAiActMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soc2Export, setSoc2Export] = useState('weekly');

  // --- Save state ---
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const handleSave = () => {
    if (saveState !== 'idle') return;
    setSaveState('saving');
    setTimeout(() => {
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    }, 1000);
  };

  const inputClass =
    'bg-white border border-neutral-300 px-2 py-1 font-mono text-[10px] text-neutral-800 w-36 focus:outline-none focus:ring-1 focus:ring-[#0033aa] focus:border-[#0033aa] transition-colors rounded-none';

  const selectClass =
    'bg-white border border-neutral-300 px-2 py-1 font-mono text-[10px] text-neutral-800 w-36 focus:outline-none focus:ring-1 focus:ring-[#0033aa] focus:border-[#0033aa] transition-colors rounded-none appearance-none cursor-pointer';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50 text-neutral-900 font-sans antialiased text-xs">
      <div className="flex flex-col flex-1 min-h-0">

        {/* Top bar */}
        <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-4 bg-neutral-200 shrink-0">
          <div className="flex items-center gap-2 font-mono font-bold tracking-tight text-neutral-800">
            <Shield className="h-4 w-4 text-[#0033aa]" />
            <span>LEX8 // DRAFTER</span>
            <span className="text-neutral-400 font-normal mx-1">/</span>
            <span className="text-neutral-500 font-normal">Settings</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 font-mono text-[10px] text-neutral-500 hover:text-[#0033aa] transition-colors no-underline"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Dashboard
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-8 bg-white flex flex-col items-center">
          <div className="w-full max-w-lg border border-neutral-200 bg-white">

            {/* Card header */}
            <div className="border-b border-neutral-200 bg-neutral-100 px-4 py-3 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#0033aa]" />
              <span className="font-mono font-bold text-neutral-800 text-xs uppercase tracking-wide">
                Platform Settings
              </span>
              <span className="ml-auto bg-[#0033aa] text-white font-mono text-[8px] font-bold px-1.5 py-0.5">
                LIVE CONFIG
              </span>
            </div>

            <div className="divide-y divide-neutral-200">

              {/* ── Governance Engine ── */}
              <div className="p-4 space-y-2">
                <SectionLabel>Governance Engine</SectionLabel>

                <SettingRow
                  label="Fail-Closed Threshold"
                  sublabel="Risk score above which output is blocked"
                >
                  <input
                    id="fail-closed-threshold"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={failClosedThreshold}
                    onChange={(e) => setFailClosedThreshold(e.target.value)}
                    className={inputClass}
                  />
                </SettingRow>

                <SettingRow
                  label="Tribunal Quorum Size"
                  sublabel="Number of juror models required"
                >
                  <input
                    id="tribunal-quorum"
                    type="number"
                    min="1"
                    max="9"
                    step="1"
                    value={tribunalQuorum}
                    onChange={(e) => setTribunalQuorum(e.target.value)}
                    className={inputClass}
                  />
                </SettingRow>

                <SettingRow
                  label="Lane 2 Intercept Sensitivity"
                  sublabel="Hallucination detection aggressiveness"
                >
                  <select
                    id="lane2-sensitivity"
                    value={lane2Sensitivity}
                    onChange={(e) => setLane2Sensitivity(e.target.value)}
                    className={selectClass}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="max">Max (Strict)</option>
                  </select>
                </SettingRow>

                <SettingRow
                  label="Cassette Replay Mode"
                  sublabel="Serve pre-recorded API responses offline"
                >
                  <Toggle
                    id="cassette-replay"
                    enabled={cassetteReplay}
                    onChange={setCassetteReplay}
                  />
                </SettingRow>
              </div>

              {/* ── Integrations ── */}
              <div className="p-4 space-y-2">
                <SectionLabel>Integrations</SectionLabel>

                <SettingRow
                  label="Westlaw API Endpoint"
                  sublabel="Primary citation verification URL"
                >
                  <input
                    id="westlaw-endpoint"
                    type="text"
                    value={westlawEndpoint}
                    onChange={(e) => setWestlawEndpoint(e.target.value)}
                    className={inputClass}
                  />
                </SettingRow>

                <SettingRow
                  label="Anchor8 Vault URI"
                  sublabel="Cryptographic document vault endpoint"
                >
                  <input
                    id="anchor8-uri"
                    type="text"
                    value={anchor8Uri}
                    onChange={(e) => setAnchor8Uri(e.target.value)}
                    className={inputClass}
                  />
                </SettingRow>

                <SettingRow
                  label="DID Registry"
                  sublabel="Decentralised identity chain target"
                >
                  <input
                    id="did-registry"
                    type="text"
                    value={didRegistry}
                    onChange={(e) => setDidRegistry(e.target.value)}
                    className={inputClass}
                  />
                </SettingRow>
              </div>

              {/* ── Audit & Compliance ── */}
              <div className="p-4 space-y-2">
                <SectionLabel>Audit &amp; Compliance</SectionLabel>

                <SettingRow
                  label="Immutable Audit Logging"
                  sublabel="Write all operations to append-only ledger"
                >
                  <Toggle
                    id="audit-logging"
                    enabled={auditLogging}
                    onChange={setAuditLogging}
                  />
                </SettingRow>

                <SettingRow
                  label="EU AI Act Article 14 Mode"
                  sublabel="Enforce human-in-the-loop overrides"
                >
                  <Toggle
                    id="eu-ai-act-mode"
                    enabled={euAiActMode}
                    onChange={setEuAiActMode}
                  />
                </SettingRow>

                <SettingRow
                  label="Email Notifications"
                  sublabel="Alert on tribunal blocks and overrides"
                >
                  <Toggle
                    id="email-notifications"
                    enabled={emailNotifications}
                    onChange={setEmailNotifications}
                  />
                </SettingRow>

                <SettingRow
                  label="SOC 2 Export Schedule"
                  sublabel="Automated compliance report cadence"
                >
                  <select
                    id="soc2-export"
                    value={soc2Export}
                    onChange={(e) => setSoc2Export(e.target.value)}
                    className={selectClass}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="off">Off</option>
                  </select>
                </SettingRow>
              </div>

            </div>

            {/* Save footer */}
            <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center justify-between">
              <span className="font-mono text-[9px] text-neutral-400">
                {saveState === 'saved'
                  ? '✓ Configuration saved successfully.'
                  : 'Changes are applied immediately on save.'}
              </span>
              <button
                id="save-configuration"
                type="button"
                onClick={handleSave}
                disabled={saveState !== 'idle'}
                className={cn(
                  'flex items-center gap-1.5 font-mono text-[10px] font-bold px-3 py-1.5 border transition-all duration-150 cursor-pointer',
                  saveState === 'saved'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : saveState === 'saving'
                    ? 'bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed'
                    : 'bg-[#0033aa] border-[#0033aa] text-white hover:bg-[#002299]'
                )}
              >
                {saveState === 'saving' && <Loader2 className="h-3 w-3 animate-spin" />}
                {saveState === 'saved' && <Check className="h-3 w-3" />}
                {saveState === 'idle' && <Save className="h-3 w-3" />}
                <span>
                  {saveState === 'saving'
                    ? 'Saving...'
                    : saveState === 'saved'
                    ? 'Saved!'
                    : 'Save Configuration'}
                </span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
