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
};
