const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  category: "Unassigned" | "In Development" | "Pending Review" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  tags: string[];
  isCompleted: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface NotesResponse {
  notes: Note[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotes: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      console.log("Auth token:", token ? "Present" : "Missing");
      return token;
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    console.log("Making API request to:", url);
    console.log("API_BASE_URL:", API_BASE_URL);

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log("Fetching URL:", url);
      const response = await fetch(url, config);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      console.error("Request URL:", url);
      console.error("Request config:", config);
      console.error(
        "Error type:",
        error instanceof Error ? error.constructor.name : typeof error
      );
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      localStorage.setItem("authToken", response.token);
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      localStorage.setItem("authToken", response.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/auth/me");
  }

  logout(): void {
    localStorage.removeItem("authToken");
  }

  // Note methods
  async createNote(noteData: {
    title: string;
    content: string;
    category?: "Unassigned" | "In Development" | "Pending Review" | "Done";
    priority?: "Low" | "Medium" | "High";
    dueDate?: string;
    tags?: string[];
  }): Promise<{ message: string; note: Note }> {
    return this.request<{ message: string; note: Note }>("/notes", {
      method: "POST",
      body: JSON.stringify(noteData),
    });
  }

  async getNotes(params?: {
    category?: string;
    priority?: string;
    isCompleted?: boolean;
    page?: number;
    limit?: number;
  }): Promise<NotesResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/notes?${queryParams.toString()}`
      : "/notes";

    return this.request<NotesResponse>(endpoint);
  }

  async getNote(id: string): Promise<{ note: Note }> {
    return this.request<{ note: Note }>(`/notes/${id}`);
  }

  async updateNote(
    id: string,
    noteData: {
      title?: string;
      content?: string;
      category?: "Unassigned" | "In Development" | "Pending Review" | "Done";
      priority?: "Low" | "Medium" | "High";
      dueDate?: string;
      tags?: string[];
      isCompleted?: boolean;
    }
  ): Promise<{ message: string; note: Note }> {
    return this.request<{ message: string; note: Note }>(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/notes/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
export type { User, Note, AuthResponse, NotesResponse };
