'use client';

import * as React from 'react';
import {
  Search,
  Filter,
  Check,
  ChevronRight,
  Clock,
  Activity,
  FileText,
  ShieldAlert,
  HelpCircle,
  Globe,
  Briefcase,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useDrafterStore, Matter } from '../lib/store';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export function MatterLibrary() {
  const {
    matters,
    activeMatterId,
    setActiveMatterId,
    setActiveModule,
    setDraftTitle,
    addAuditLog
  } = useDrafterStore();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = React.useState('ALL');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [selectedRiskRange, setSelectedRiskRange] = React.useState('ALL');

  // Audit event logs on filter change
  const handleFilterChange = (filterName: string, value: string) => {
    addAuditLog({
      level: 'info',
      module: 'MatterLibrary',
      message: `Filter applied - ${filterName}: ${value}`,
    });
  };

  // Get unique values for filters
  const jurisdictions = React.useMemo(() => {
    const list = new Set(matters.map(m => m.court));
    return ['ALL', ...Array.from(list)];
  }, [matters]);

  const statuses = React.useMemo(() => {
    return ['ALL', 'active', 'closed', 'suspended', 'adjudicating', 'pending_appeal'];
  }, []);

  // Filter matters
  const filteredMatters = React.useMemo(() => {
    return matters.filter(matter => {
      // Search term match
      const searchMatch =
        matter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.assignedCounsel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.practiceGroup.toLowerCase().includes(searchTerm.toLowerCase());

      // Jurisdiction match
      const jurisdictionMatch =
        selectedJurisdiction === 'ALL' || matter.court === selectedJurisdiction;

      // Status match
      const statusMatch =
        selectedStatus === 'ALL' || matter.status === selectedStatus;

      // Risk score match
      let riskMatch = true;
      if (selectedRiskRange === 'HIGH') {
        riskMatch = matter.tribunalRiskScore >= 70;
      } else if (selectedRiskRange === 'MED') {
        riskMatch = matter.tribunalRiskScore >= 30 && matter.tribunalRiskScore < 70;
      } else if (selectedRiskRange === 'LOW') {
        riskMatch = matter.tribunalRiskScore < 30;
      }

      return searchMatch && jurisdictionMatch && statusMatch && riskMatch;
    });
  }, [matters, searchTerm, selectedJurisdiction, selectedStatus, selectedRiskRange]);

  // Selected matter object
  const activeMatter = React.useMemo<Matter>(() => {
    const found = matters.find(m => m.id === activeMatterId);
    if (found) return found;
    if (matters[0]) return matters[0];
    return {
      id: 'default',
      name: 'Default Matter',
      court: 'Unknown Court',
      caseNumber: 'N/A',
      description: '',
      status: 'active',
      assignedCounsel: 'N/A',
      tribunalRiskScore: 0,
      lastActivity: 'N/A',
      client: 'N/A',
      practiceGroup: 'N/A'
    };
  }, [matters, activeMatterId]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedJurisdiction('ALL');
    setSelectedStatus('ALL');
    setSelectedRiskRange('ALL');
    addAuditLog({
      level: 'info',
      module: 'MatterLibrary',
      message: 'Reset all active search filters.',
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white select-none">
      {/* 1. Filter and Control Bar */}
      <div className="bg-neutral-100 border-b border-neutral-200 p-2.5 space-y-2">
        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Matter, Docket, Counsel, Client..."
              className="w-full bg-white border border-neutral-300 rounded-none pl-7 pr-2 py-1 font-mono text-[10px] text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-500 h-6"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="h-6 px-2 text-[9px] font-mono rounded-none gap-1 bg-white hover:bg-neutral-50 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-3 gap-2">
          {/* Jurisdiction Filter */}
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase text-neutral-400 font-semibold mb-0.5">Jurisdiction</span>
            <select
              value={selectedJurisdiction}
              onChange={(e) => {
                setSelectedJurisdiction(e.target.value);
                handleFilterChange('Jurisdiction', e.target.value);
              }}
              className="bg-white border border-neutral-300 rounded-none px-1.5 py-0.5 font-mono text-[9px] text-neutral-700 focus:outline-hidden h-5"
            >
              <option value="ALL">All Courts</option>
              {jurisdictions.filter(j => j !== 'ALL').map(court => (
                <option key={court} value={court}>{court}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase text-neutral-400 font-semibold mb-0.5">Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                handleFilterChange('Status', e.target.value);
              }}
              className="bg-white border border-neutral-300 rounded-none px-1.5 py-0.5 font-mono text-[9px] text-neutral-700 focus:outline-hidden h-5"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="suspended">Suspended</option>
              <option value="adjudicating">Adjudicating</option>
              <option value="pending_appeal">Pending Appeal</option>
            </select>
          </div>

          {/* Risk Range Filter */}
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase text-neutral-400 font-semibold mb-0.5">Tribunal Risk Score</span>
            <select
              value={selectedRiskRange}
              onChange={(e) => {
                setSelectedRiskRange(e.target.value);
                handleFilterChange('RiskRange', e.target.value);
              }}
              className="bg-white border border-neutral-300 rounded-none px-1.5 py-0.5 font-mono text-[9px] text-neutral-700 focus:outline-hidden h-5"
            >
              <option value="ALL">All Risk Ranges</option>
              <option value="HIGH">High Risk (70-100)</option>
              <option value="MED">Medium Risk (30-69)</option>
              <option value="LOW">Low Risk (0-29)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. TanStack-styled Dense Data Table */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ScrollArea className="flex-1">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 font-mono text-[9px] text-neutral-400 font-semibold select-none sticky top-0 bg-neutral-100/95 backdrop-blur-xs z-10">
                <th className="py-2 px-3 w-8"></th>
                <th className="py-2 px-2">CASE / DOCKET</th>
                <th className="py-2 px-2 hidden md:table-cell">JURISDICTION</th>
                <th className="py-2 px-2 hidden lg:table-cell">ASSIGNED COUNSEL</th>
                <th className="py-2 px-2 w-24">STATUS</th>
                <th className="py-2 px-2 w-16 text-right">RISK</th>
                <th className="py-2 px-3 w-28 text-right">ACTIVITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredMatters.map((matter) => {
                const isSelected = matter.id === activeMatterId;

                // Color formatting based on risk
                let riskColorClass = "text-green-700 font-semibold";
                let riskBgClass = "bg-green-50 text-green-700 border-green-200";
                if (matter.tribunalRiskScore >= 70) {
                  riskColorClass = "text-red-700 font-bold animate-pulse";
                  riskBgClass = "bg-red-50 text-red-700 border-red-200";
                } else if (matter.tribunalRiskScore >= 30) {
                  riskColorClass = "text-amber-700 font-semibold";
                  riskBgClass = "bg-amber-50 text-amber-700 border-amber-200";
                }

                return (
                  <tr
                    key={matter.id}
                    onClick={() => {
                      setActiveMatterId(matter.id);
                      addAuditLog({
                        level: 'info',
                        module: 'MatterLibrary',
                        message: `Focused matter selection changed to: ${matter.name}`,
                      });
                    }}
                    className={cn(
                      "group hover:bg-neutral-50 cursor-pointer transition-colors text-[10px] font-mono leading-normal",
                      isSelected ? "bg-[#0033aa]/5 hover:bg-[#0033aa]/5 font-semibold text-neutral-900 border-l-2 border-[#0033aa]" : "text-neutral-700 bg-white"
                    )}
                  >
                    {/* Selection Gutter */}
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center">
                        {isSelected ? (
                          <Check className="h-3.5 w-3.5 text-[#0033aa] font-bold" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-neutral-200 group-hover:bg-neutral-400 transition-colors" />
                        )}
                      </div>
                    </td>

                    {/* Case Name / Docket */}
                    <td className="py-2 px-2 min-w-[200px]">
                      <div className="flex flex-col">
                        <span className={cn("text-neutral-900 truncate block", isSelected && "font-bold")}>
                          {matter.name}
                        </span>
                        <span className="text-[8px] text-neutral-400 font-mono">
                          {matter.caseNumber}
                        </span>
                      </div>
                    </td>

                    {/* Jurisdiction */}
                    <td className="py-2 px-2 hidden md:table-cell max-w-[150px] truncate">
                      <span className="text-neutral-500 font-mono block text-[9px] truncate">
                        {matter.court}
                      </span>
                    </td>

                    {/* Counsel */}
                    <td className="py-2 px-2 hidden lg:table-cell">
                      <div className="flex flex-col truncate">
                        <span className="text-neutral-600 font-mono truncate block">
                          {matter.assignedCounsel}
                        </span>
                        <span className="text-[8px] text-neutral-400 block font-mono">
                          {matter.practiceGroup}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-2 px-2">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-1.5 py-0.5 border text-[8px] font-bold font-mono tracking-wider uppercase",
                        matter.status === 'active' && "bg-green-50 border-green-200 text-green-700",
                        matter.status === 'adjudicating' && "bg-red-50 border-red-200 text-red-700 animate-pulse",
                        matter.status === 'suspended' && "bg-amber-50 border-amber-200 text-amber-700",
                        matter.status === 'closed' && "bg-neutral-50 border-neutral-200 text-neutral-400",
                        matter.status === 'pending_appeal' && "bg-purple-50 border-purple-200 text-purple-700"
                      )}>
                        <span className={cn(
                          "h-1 w-1 rounded-full",
                          matter.status === 'active' && "bg-green-600",
                          matter.status === 'adjudicating' && "bg-red-600",
                          matter.status === 'suspended' && "bg-amber-500",
                          matter.status === 'closed' && "bg-neutral-400",
                          matter.status === 'pending_appeal' && "bg-purple-600"
                        )} />
                        {matter.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Risk Score */}
                    <td className="py-2 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={riskColorClass}>
                          {matter.tribunalRiskScore}
                        </span>
                        <div className="h-1.5 w-6 bg-neutral-100 border border-neutral-200 overflow-hidden flex">
                          <div
                            className={cn(
                              "h-full",
                              matter.tribunalRiskScore >= 70 ? "bg-red-500" :
                                matter.tribunalRiskScore >= 30 ? "bg-amber-500" : "bg-green-500"
                            )}
                            style={{ width: `${matter.tribunalRiskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Last Activity */}
                    <td className="py-2 px-3 text-right text-neutral-500 font-mono text-[9px] tabular-nums">
                      {matter.lastActivity}
                    </td>
                  </tr>
                );
              })}

              {filteredMatters.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400 font-mono text-[10px] bg-neutral-50 border-dashed border border-neutral-200 m-3">
                    <ShieldAlert className="h-6 w-6 text-neutral-300 mx-auto mb-1" />
                    <span>No matters match the active query.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      {/* 3. Compact Selected Detail Panel (Left-aligned Metadata Summary) */}
      <div className="bg-neutral-50 border-t border-neutral-200 p-3 select-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-neutral-800 uppercase tracking-wide">
              Selected Matter Profile:
            </span>
            <span className="font-mono text-[10px] font-bold text-[#0033aa] bg-neutral-200/50 px-1.5 py-0.5">
              {activeMatter.name}
            </span>
            <span className="text-[9px] text-neutral-400 font-mono">
              ({activeMatter.caseNumber})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 font-mono text-[9px] text-neutral-600 leading-tight">
            <div className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-neutral-400 shrink-0" />
              <span className="text-neutral-400">Court:</span>
              <span className="text-neutral-800 font-medium truncate">{activeMatter.court}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3 w-3 text-neutral-400 shrink-0" />
              <span className="text-neutral-400">Client:</span>
              <span className="text-neutral-800 font-medium truncate">{activeMatter.client}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-neutral-400 shrink-0" />
              <span className="text-neutral-400">Last Act:</span>
              <span className="text-neutral-800 font-medium">{activeMatter.lastActivity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-neutral-400 shrink-0" />
              <span className="text-neutral-400">Counsel:</span>
              <span className="text-neutral-800 font-medium truncate">{activeMatter.assignedCounsel}</span>
            </div>
          </div>

          {activeMatter.description && (
            <p className="text-[9px] text-neutral-500 font-mono leading-normal line-clamp-2 pt-0.5">
              <strong className="text-neutral-400">Synopsis:</strong> {activeMatter.description}
            </p>
          )}
        </div>

        <div className="flex items-center shrink-0">
          <Button
            variant="bloomberg"
            size="sm"
            onClick={() => {
              setActiveModule('drafter');
              setDraftTitle(`${activeMatter.name} — MSJ Brief`);
              addAuditLog({
                level: 'info',
                module: 'MatterLibrary',
                message: `Forwarded active matter ${activeMatter.name} to Drafter workspace.`,
              });
            }}
            className="w-full md:w-auto h-7 px-3 text-[10px] font-mono rounded-none gap-1 bg-[#0033aa] hover:bg-[#0033aa]/90 cursor-pointer"
          >
            <FileText className="h-3 w-3" />
            <span>Open in Drafter</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
