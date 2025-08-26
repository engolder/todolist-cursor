import { type FC, useState, type FormEvent } from 'react'
import { TodoItem } from './TodoItem'
import { useTodos, useCreateTodo, useToggleTodo, useDeleteTodo } from '../../features/todo-list/hooks/useTodos';
import type { Todo } from "../../entities/todo/todo";
import * as styles from './styles.css'

export const TodoList: FC = () => {
  const [newTodo, setNewTodo] = useState("");
  
  const { data: todos = [], isLoading, error } = useTodos();
  const createTodoMutation = useCreateTodo();
  const toggleTodoMutation = useToggleTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await createTodoMutation.mutateAsync({ text: newTodo.trim() });
      setNewTodo("");
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      await toggleTodoMutation.mutateAsync({ id, completed: !todo.completed });
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodoMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div>Error loading todos: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>할 일 목록</h1>
      </header>

      <div className={styles.list}>
        {todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
        {todos.length === 0 && (
          <div className={styles.empty}>할 일이 없습니다.</div>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="할 일을 입력하세요"
          disabled={createTodoMutation.isPending}
        />
        <button 
          type="submit" 
          className={styles.addButton}
          disabled={createTodoMutation.isPending}
        >
          {createTodoMutation.isPending ? '추가중...' : '추가'}
        </button>
      </form>
    </div>
  );
}
