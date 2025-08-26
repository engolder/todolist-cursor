import ky from 'ky';
import type { Todo, CreateTodoInput } from '../../entities/todo/todo';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = ky.create({
  prefixUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T> {
  data: T;
}

export interface UpdateTodoInput {
  text?: string;
  completed?: boolean;
}

export const todoApi = {
  async getAll(): Promise<Todo[]> {
    const response = await api.get('todos').json<ApiResponse<Todo[]>>();
    return response.data;
  },

  async getById(id: string): Promise<Todo> {
    const response = await api.get(`todos/${id}`).json<ApiResponse<Todo>>();
    return response.data;
  },

  async create(input: CreateTodoInput): Promise<Todo> {
    const response = await api.post('todos', { json: input }).json<ApiResponse<Todo>>();
    return response.data;
  },

  async update(id: string, input: UpdateTodoInput): Promise<Todo> {
    const response = await api.put(`todos/${id}`, { json: input }).json<ApiResponse<Todo>>();
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`todos/${id}`);
  },

  async toggle(id: string, completed: boolean): Promise<Todo> {
    return this.update(id, { completed });
  },
};