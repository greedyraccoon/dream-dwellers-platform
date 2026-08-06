import type {
  AuthenticationResponse, LoginRequest, RegisterRequest,
  PropertyRequest, PropertyResponse,
  ClientRequest, ClientResponse,
  DealRequest, DealResponse,
  BlogRequest, BlogResponse,
  UserResponse,
} from "./types";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8083/api/v1";
const TOKEN_KEY = "token";

export const tokenStore = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> || {}),
  };
  const token = tokenStore.get();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = await res.text();
      if (body) {
        try {
          const parsed = JSON.parse(body);
          message = parsed.message ?? parsed.error ?? body;
        } catch { message = body; }
      }
    } catch { /* noop */ }
    if (res.status === 401 || res.status === 403) message = message || "Invalid credentials";
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ===== Auth =====
export const authApi = {
  login: (data: LoginRequest) =>
    request<AuthenticationResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: RegisterRequest) =>
    request<AuthenticationResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
};

// ===== Users =====
export const userApi = {
  list: () => request<UserResponse[]>("/users"),
  remove: (id: number) => request<void>(`/users/${id}`, { method: "DELETE" }),
};

// ===== Properties =====
export const propertyApi = {
  list: () => request<PropertyResponse[]>("/properties"),
  get: (id: number) => request<PropertyResponse>(`/properties/${id}`),
  create: (data: PropertyRequest) =>
    request<PropertyResponse>("/properties", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: PropertyRequest) =>
    request<PropertyResponse>(`/properties/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) =>
    request<void>(`/properties/${id}`, { method: "DELETE" }),
  uploadImages: async (id: number, files: File[]): Promise<string[]> => {
    const form = new FormData();
    files.forEach(f => form.append("files", f));
    const token = tokenStore.get();
    const res = await fetch(`${API_BASE_URL}/properties/${id}/images`, {
      method: "POST",
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as string[];
  },
};

// ===== Clients =====
export const clientApi = {
  list: () => request<ClientResponse[]>("/clients"),
  create: (data: ClientRequest) =>
    request<ClientResponse>("/clients", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: ClientRequest) =>
    request<ClientResponse>(`/clients/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) =>
    request<void>(`/clients/${id}`, { method: "DELETE" }),
};

// ===== Deals =====
export const dealApi = {
  list: () => request<DealResponse[]>("/deals"),
  create: (data: DealRequest) =>
    request<DealResponse>("/deals", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: DealRequest) =>
    request<DealResponse>(`/deals/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) =>
    request<void>(`/deals/${id}`, { method: "DELETE" }),
};

// ===== Media (S3 upload) =====
export const mediaApi = {
  /** POST /api/v1/media/upload (multipart, key: "file") -> returns the S3 URL string. */
  upload: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const token = tokenStore.get();
    const res = await fetch(`${API_BASE_URL}/media/upload`, {
      method: "POST",
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const text = (await res.text()).trim();
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "string") return parsed;
      return parsed.url ?? parsed.coverImageUrl ?? text;
    } catch {
      return text;
    }
  },
};

// ===== Blogs =====
export const blogApi = {
  list: () => request<BlogResponse[]>("/blogs"),
  getBySlug: (slug: string) => request<BlogResponse>(`/blogs/${slug}`),
  create: (data: BlogRequest) =>
    request<BlogResponse>("/blogs", { method: "POST", body: JSON.stringify(data) }),
  remove: (id: number) =>
    request<void>(`/blogs/${id}`, { method: "DELETE" }),
};
