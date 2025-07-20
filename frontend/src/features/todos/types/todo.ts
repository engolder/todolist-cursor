export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoInput {
  text: string;
} 