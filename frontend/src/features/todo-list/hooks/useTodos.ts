import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../../../shared/api';
import type { CreateTodoInput, Todo } from '../../../entities/todo/todo';

const TODOS_KEY = ['todos'] as const;

export function useTodos() {
  return useQuery({
    queryKey: TODOS_KEY,
    queryFn: todoApi.getAll,
  });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => todoApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { text?: string; completed?: boolean } }) =>
      todoApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: todoApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todoApi.toggle(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}