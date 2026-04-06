import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  adminId: string;
  depositAmount: number;
}

export interface Task {
  id: string;
  projectId: string;
  departmentId: number;
  assignedUserId?: string;
  status: 'PENDING' | 'UNLOCKED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  stepOrder: number;
  departmentName?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiFacade = {
  // Auth
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData: any) => {
    return api.post('/auth/register', userData);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Projects
  getProjects: async () => {
    return api.get<Project[]>('/projects');
  },

  createProject: async (projectData: Partial<Project>) => {
    return api.post<Project>('/projects', projectData);
  },

  // Tasks
  getDepartmentTasks: async (departmentId: number, status?: string) => {
    const url = `/departments/${departmentId}/tasks${status ? `?status=${status}` : ''}`;
    return api.get<Task[]>(url);
  },

  updateTaskStatus: async (projectId: string, taskId: string, status: string) => {
    return api.put(`/projects/${projectId}/tasks/${taskId}?status=${status}`);
  },

  // Users / Admin
  getUsers: async () => {
    return api.get<User[]>('/users'); // Assuming this endpoint exists or will exist
  },

  deleteUser: async (id: string) => {
    return api.delete(`/users/${id}`); // Assuming this endpoint exists or will exist
  },
};
