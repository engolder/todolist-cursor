import { type FC, useState, type FormEvent } from 'react'
import { TodoItem } from './TodoItem'
import { useTodoStore } from "../../features/todo-list/todoStore";
import type { Todo } from "../../entities/todo/todo";
import * as styles from './styles.css'

export const TodoList: FC = () => {
  const [newTodo, setNewTodo] = useState("");
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    addTodo({ text: newTodo.trim() });
    setNewTodo("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>할 일 목록</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button type="submit" className={styles.addButton}>
          추가
        </button>
      </form>

      <div className={styles.list}>
        {todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
    </div>
  );
}
