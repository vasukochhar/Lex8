const API_BASE_URL =
  process.env.NEXT_PUBLIC_LEX8_API_BASE_URL ?? 'http://localhost:8000';

export type ModuleInfo = {
  name: string;
  archetype: string;
  status: string;
  health?: string;
  mode?: string;
};

export type ModuleEnvelope<T> = T & {
  module?: string;
  standard_status?: 'ok' | 'degraded' | 'blocked' | 'error';
  data?: T;
  error?: unknown;
  degradation_reason?: string | null;
  anchor8_mode?: string;
};

export type DefensibilityAction = {
  action_id: string;
  module: string;
  action_type: string;
  verdict: string;
  lane: number;
  rahs: number;
  reason: string;
};

export type DefensibilitySummary = {
  total_actions: number;
  blocked_actions: number;
  lane4_queue_depth: number;
  average_rahs: number;
};

export type Lane4Review = {
  review_id: string;
  action_id: string;
  status: string;
  sla_status: string;
  minutes_remaining: number;
  reason: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Lex8 API ${response.status}: ${path}`);
  }

  return response.json() as Promise<T>;
}

export const lex8Api = {
  apiBaseUrl: API_BASE_URL,

  modules: () => request<{ modules: ModuleInfo[] }>('/api/v1/modules'),
  moduleHealth: () =>
    request<{
      status: string;
      modules: ModuleInfo[];
      anchor8: { mode: string; gateway_configured: boolean; internals: string };
    }>('/api/v1/health/modules'),

  drafterTemplates: () =>
    request<{ templates: { id: string; name: string }[] }>(
      '/api/v1/drafter/templates',
    ),
  createDraft: () =>
    request<ModuleEnvelope<{ draft_id: string; status: string; content_preview: string }>>(
      '/api/v1/drafter/drafts',
      {
        method: 'POST',
        body: JSON.stringify({ matter_id: 'demo-acme-beta', template_id: 'msj' }),
      },
    ),

  searchLibrary: () =>
    request<ModuleEnvelope<{ results: { title: string; snippet: string }[] }>>(
      '/api/v1/library/search',
      {
        method: 'POST',
        body: JSON.stringify({ matter_id: 'demo-acme-beta', query: 'veil piercing' }),
      },
    ),
  validateDraft: () =>
    request<ModuleEnvelope<{ checks: { label: string; result: string; message: string }[] }>>(
      '/api/v1/validator/validate',
      {
        method: 'POST',
        body: JSON.stringify({
          matter_id: 'demo-acme-beta',
          draft_id: 'draft_demo_msj_001',
        }),
      },
    ),
  analyzeVaultVision: () =>
    request<ModuleEnvelope<{ findings: { type: string; severity: string; message: string }[] }>>(
      '/api/v1/vault-vision/analyze',
      {
        method: 'POST',
        body: JSON.stringify({ matter_id: 'demo-acme-beta', document_id: 'P-14' }),
      },
    ),
  createFiling: () =>
    request<ModuleEnvelope<{ filing_id: string; status: string }>>(
      '/api/v1/filer/filings',
      {
        method: 'POST',
        body: JSON.stringify({ matter_id: 'demo-acme-beta', court: 'PACER mock' }),
      },
    ),
  predictForecast: () =>
    request<ModuleEnvelope<{ outcomes: { label: string; probability: number }[] }>>(
      '/api/v1/forecast/predict',
      {
        method: 'POST',
        body: JSON.stringify({ matter_id: 'demo-acme-beta' }),
      },
    ),
  createTimeline: () =>
    request<ModuleEnvelope<{ events: { title: string; description: string }[] }>>(
      '/api/v1/case-synth/timeline',
      {
        method: 'POST',
        body: JSON.stringify({ matter_id: 'demo-acme-beta' }),
      },
    ),
  createWarRoom: () =>
    request<ModuleEnvelope<{ session_id: string; final_ruling: string }>>(
      '/api/v1/war-room/sessions',
      {
        method: 'POST',
        body: JSON.stringify({
          matter_id: 'demo-acme-beta',
          issue: 'Veil piercing and commingled ledger evidence',
        }),
      },
    ),

  defensibilityActions: () =>
    request<{ actions: DefensibilityAction[] }>(
      '/api/v1/defensibility/actions?matter_id=demo-acme-beta',
    ),
  defensibilitySummary: () =>
    request<DefensibilitySummary>(
      '/api/v1/defensibility/summary?matter_id=demo-acme-beta',
    ),
  blockAnalyzer: () =>
    request<{ total_blocks: number; by_category: Record<string, number> }>(
      '/api/v1/defensibility/block-analyzer?matter_id=demo-acme-beta',
    ),
  jurorDisagreements: () =>
    request<{ disagreements: { review_id: string; votes: string[] }[] }>(
      '/api/v1/defensibility/juror-disagreements?matter_id=demo-acme-beta',
    ),
  lane4Sla: () =>
    request<{ queue_depth: number; pending: number; breached: number }>(
      '/api/v1/defensibility/lane4-sla?matter_id=demo-acme-beta',
    ),
  lane4Reviews: () =>
    request<{ reviews: Lane4Review[] }>('/api/v1/lane4/reviews?status=pending'),
};
