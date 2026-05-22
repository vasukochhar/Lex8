'use client';

import * as React from 'react';
import { 
  Briefcase, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  FileText, 
  Calendar,
  Gavel,
  Users,
  MessageSquare
} from 'lucide-react';
import { useDrafterStore } from '../lib/store';
import { cn } from '../lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

export function MatterDashboard() {
  const { matters, activeMatterId } = useDrafterStore();
  const activeMatter = matters.find((m) => m.id === activeMatterId) || matters[0];

  const recentActivities = [
    { type: 'filing', title: 'Answer & Counterclaims Filed', date: '2 hours ago', icon: FileText, color: 'text-blue-600' },
    { type: 'risk', title: 'Opposing Counsel Sanction Threat', date: 'Yesterday', icon: AlertTriangle, color: 'text-red-600' },
    { type: 'discovery', title: 'Production Set 3 Completed', date: '2 days ago', icon: CheckCircle2, color: 'text-green-600' },
    { type: 'meeting', title: 'Client Briefing: Settlement', date: '4 days ago', icon: Users, color: 'text-neutral-600' }
  ];

  const tasks = [
    { title: 'Draft Motion for Summary Judgment', deadline: 'May 24, 2025', status: 'In Progress', priority: 'High' },
    { title: 'Review Plaintiff Deposition Transcripts', deadline: 'May 28, 2025', status: 'Pending', priority: 'Medium' },
    { title: 'Prepare Privilege Log', deadline: 'June 2, 2025', status: 'Pending', priority: 'High' }
  ];

  if (!activeMatter) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-neutral-50 select-none overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-6xl mx-auto space-y-4 pb-12">
          
          {/* Header Section */}
          <div className="flex items-start justify-between bg-white border border-neutral-200 p-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#0033aa]" />
                <h1 className="font-mono text-lg font-bold text-neutral-900">{activeMatter.name}</h1>
                <span className="ml-2 px-2 py-0.5 border border-green-200 bg-green-50 text-green-700 text-[10px] font-mono font-bold uppercase tracking-wide">
                  Active Litigation
                </span>
              </div>
              <div className="flex gap-6 font-mono text-xs text-neutral-500 pt-1">
                <span className="flex items-center gap-1"><Gavel className="h-3.5 w-3.5" /> {activeMatter.court}</span>
                <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Docket: {activeMatter.caseNumber}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Lead: {activeMatter.assignedCounsel}</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="block font-mono text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Matter Risk Score</span>
              <div className="flex items-end justify-end gap-1">
                <span className="font-mono text-3xl font-bold text-red-600 leading-none">High</span>
              </div>
            </div>
          </div>

          {/* KPI Risk Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 p-3 shadow-xs flex flex-col gap-2">
              <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase tracking-wide flex items-center gap-1.5">
                <ShieldAlert className="h-3 w-3 text-red-600" />
                Judicial Scrutiny
              </span>
              <span className="font-mono text-xl font-bold text-neutral-900">Elevated</span>
              <span className="text-[10px] text-neutral-500">Judge has sanctioned parties recently.</span>
            </div>
            
            <div className="bg-white border border-neutral-200 p-3 shadow-xs flex flex-col gap-2">
              <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-amber-500" />
                Burn Rate
              </span>
              <span className="font-mono text-xl font-bold text-neutral-900">$45.2K/mo</span>
              <span className="text-[10px] text-neutral-500">22% above baseline projection.</span>
            </div>
            
            <div className="bg-white border border-neutral-200 p-3 shadow-xs flex flex-col gap-2">
              <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                Discovery Status
              </span>
              <span className="font-mono text-xl font-bold text-neutral-900">68%</span>
              <span className="text-[10px] text-neutral-500">3 of 5 custodian sets produced.</span>
            </div>
            
            <div className="bg-white border border-neutral-200 p-3 shadow-xs flex flex-col gap-2">
              <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-[#0033aa]" />
                Next Deadline
              </span>
              <span className="font-mono text-xl font-bold text-neutral-900">14 Days</span>
              <span className="text-[10px] text-neutral-500">Dispositive motion cutoff (May 24).</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            
            {/* Task Panel */}
            <div className="col-span-2 space-y-3">
              <h2 className="font-mono text-xs font-bold text-neutral-800 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-neutral-500" />
                Active Tasks & Deadlines
              </h2>
              <div className="bg-white border border-neutral-200 shadow-xs divide-y divide-neutral-100">
                {tasks.map((task, i) => (
                  <div key={i} className="p-3 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-default">
                    <div className="space-y-1">
                      <p className="font-mono text-xs font-semibold text-neutral-900">{task.title}</p>
                      <div className="flex gap-3 text-[10px] font-mono text-neutral-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {task.deadline}</span>
                        <span>•</span>
                        <span className={cn(
                          "font-bold",
                          task.status === 'In Progress' ? "text-[#0033aa]" : "text-neutral-500"
                        )}>{task.status}</span>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 border text-[9px] font-mono font-bold uppercase",
                      task.priority === 'High' ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"
                    )}>
                      {task.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Matter Health Indicators */}
              <div className="mt-4 pt-4">
                <h2 className="font-mono text-xs font-bold text-neutral-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-neutral-500" />
                  Matter Health Indicators
                </h2>
                <div className="bg-white border border-neutral-200 p-4 shadow-xs space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] font-bold">
                      <span className="text-neutral-600">Counsel Alignment (Joint Defense)</span>
                      <span className="text-green-700">92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 overflow-hidden"><div className="h-full bg-green-500" style={{width: '92%'}}></div></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] font-bold">
                      <span className="text-neutral-600">Budget Adherence</span>
                      <span className="text-amber-600">78%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 overflow-hidden"><div className="h-full bg-amber-500" style={{width: '78%'}}></div></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] font-bold">
                      <span className="text-neutral-600">Timeline Compliance</span>
                      <span className="text-[#0033aa]">100%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 overflow-hidden"><div className="h-full bg-[#0033aa]" style={{width: '100%'}}></div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="space-y-3">
              <h2 className="font-mono text-xs font-bold text-neutral-800 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-neutral-500" />
                Recent Activity Feed
              </h2>
              <div className="bg-white border border-neutral-200 shadow-xs">
                <div className="p-3 border-b border-neutral-100 bg-neutral-50">
                  <span className="text-[10px] font-mono text-neutral-500">Live feed from connected dockets and systems.</span>
                </div>
                <div className="divide-y divide-neutral-100">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="p-3 flex gap-3">
                      <div className="shrink-0 mt-0.5">
                        <activity.icon className={cn("h-4 w-4", activity.color)} />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="font-mono text-[11px] font-bold text-neutral-800 leading-tight">{activity.title}</p>
                        <p className="font-mono text-[9px] text-neutral-400 flex items-center gap-1">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-neutral-100 bg-neutral-50 text-center">
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] font-mono text-neutral-500 w-full uppercase tracking-wider">
                    View Full History
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
