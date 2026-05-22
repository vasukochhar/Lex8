import Link from 'next/link';
import { Shield, UserCheck, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50 text-neutral-900 font-sans antialiased text-xs">

      {/* Minimal top bar matching dashboard chrome */}
      <div className="flex flex-col flex-1">
        <header className="flex h-9 items-center justify-between border-b border-neutral-200 px-4 bg-neutral-200 shrink-0">
          <div className="flex items-center gap-2 font-mono font-bold tracking-tight text-neutral-800">
            <Shield className="h-4 w-4 text-[#0033aa]" />
            <span>LEX8 // DRAFTER</span>
            <span className="text-neutral-400 font-normal mx-1">/</span>
            <span className="text-neutral-500 font-normal">Profile</span>
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
        <main className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
          <div className="w-full max-w-lg border border-neutral-200 bg-white">

            {/* Card header */}
            <div className="border-b border-neutral-200 bg-neutral-100 px-4 py-3 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-[#0033aa]" />
              <span className="font-mono font-bold text-neutral-800 text-xs uppercase tracking-wide">
                User Profile
              </span>
              <span className="ml-auto bg-[#0033aa] text-white font-mono text-[8px] font-bold px-1.5 py-0.5">
                PLACEHOLDER
              </span>
            </div>

            {/* Avatar + info */}
            <div className="p-6 flex items-center gap-4 border-b border-neutral-200">
              <div className="h-14 w-14 rounded-full bg-[#0033aa] flex items-center justify-center shrink-0">
                <span className="text-white font-mono font-bold text-xl leading-none">N</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono font-bold text-sm text-neutral-800">Nimish Mittal</span>
                <span className="font-mono text-[10px] text-neutral-400">Lead Auditor · Institutional Risk</span>
                <span className="font-mono text-[9px] text-[#0033aa]">nimish@lex8.io</span>
              </div>
            </div>

            {/* Coming soon body */}
            <div className="p-6 space-y-3">
              {[
                'Display Name',
                'Email Address',
                'Role & Access Level',
                'Two-Factor Authentication',
                'API Key Management',
              ].map((field) => (
                <div
                  key={field}
                  className="flex items-center justify-between border border-neutral-200 bg-neutral-50 px-3 py-2"
                >
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wide">
                    {field}
                  </span>
                  <span className="font-mono text-[9px] text-neutral-300 italic">
                    coming soon
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-2 font-mono text-[9px] text-neutral-400">
              ⚠️ Profile management settings will be implemented in a future release.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
