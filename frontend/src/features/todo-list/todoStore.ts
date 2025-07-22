import { create } from 'zustand'
import type { Todo, CreateTodoInput } from "../../entities/todo/todo";

interface TodoStore {
  todos: Todo[];
  addTodo: (input: CreateTodoInput) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (input) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: crypto.randomUUID(),
          text: input.text,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
})); 