// ─── API Service Layer ───────────────────────────────────────────────────────
// Central HTTP client for communicating with the Spring Boot backend at /api/*

export type ApiError = {
    status: number;
    message: string;
};

const BASE_URL = '/api';

function buildUrl(path: string): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${normalized}`;
}

async function parseErrorMessage(response: Response): Promise<string> {
    const ct = response.headers.get('content-type') ?? '';
    try {
        if (ct.includes('application/json')) {
            const body = (await response.json()) as Record<string, unknown>;
            if (typeof body.message === 'string' && body.message.trim()) return body.message;
            if (typeof body.error === 'string' && body.error.trim()) return body.error;
            return JSON.stringify(body);
        }
        const text = await response.text();
        return text || response.statusText;
    } catch {
        return response.statusText;
    }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {};
    const init: RequestInit = { method, headers };

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
    }

    const response = await fetch(buildUrl(path), init);

    if (!response.ok) {
        const message = await parseErrorMessage(response);
        const error: ApiError = { status: response.status, message };
        throw error;
    }

    if (response.status === 204) return undefined as T;

    const ct = response.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) return (await response.text()) as unknown as T;

    return (await response.json()) as T;
}

async function requestForm<T>(method: string, path: string, form: FormData): Promise<T> {
    const response = await fetch(buildUrl(path), { method, body: form });

    if (!response.ok) {
        const message = await parseErrorMessage(response);
        const error: ApiError = { status: response.status, message };
        throw error;
    }

    if (response.status === 204) return undefined as T;
    const ct = response.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) return (await response.text()) as unknown as T;
    return (await response.json()) as T;
}

// ─── Convenience helpers ─────────────────────────────────────────────────────

export const apiGet = <T>(path: string): Promise<T> => request<T>('GET', path);
export const apiPost = <T = unknown>(path: string, body: unknown): Promise<T> => request<T>('POST', path, body);
export const apiPut = <T = unknown>(path: string, body: unknown): Promise<T> => request<T>('PUT', path, body);
export const apiDelete = <T = unknown>(path: string): Promise<T> => request<T>('DELETE', path);
export const apiPostForm = <T = unknown>(path: string, form: FormData): Promise<T> => requestForm<T>('POST', path, form);
