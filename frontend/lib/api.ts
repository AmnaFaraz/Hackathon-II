const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  tags?: string[];
  due_date?: string;
}

export interface TaskUpdate extends Partial<TaskCreate> {
  completed?: boolean;
}

export interface ChatResponse {
  conversation_id: string;
  response: string;
  tool_calls: string[];
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API error");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  tasks: {
    list: (userId: string, params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<Task[]>(`/api/${userId}/tasks${qs}`);
    },
    create: (userId: string, data: TaskCreate) =>
      request<Task>(`/api/${userId}/tasks`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    get: (userId: string, taskId: number) =>
      request<Task>(`/api/${userId}/tasks/${taskId}`),
    update: (userId: string, taskId: number, data: TaskUpdate) =>
      request<Task>(`/api/${userId}/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (userId: string, taskId: number) =>
      request<void>(`/api/${userId}/tasks/${taskId}`, { method: "DELETE" }),
    toggleComplete: (userId: string, taskId: number) =>
      request<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
        method: "PATCH",
      }),
  },
  chat: {
    send: (userId: string, message: string, conversationId?: string) =>
      request<ChatResponse>(`/api/${userId}/chat`, {
        method: "POST",
        body: JSON.stringify({ message, conversation_id: conversationId }),
      }),
  },
};
