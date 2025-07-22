import { type FC } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import type { Todo } from "../../entities/todo/todo";
import * as styles from './styles.css'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export const TodoItem: FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={styles.item}>
      <Checkbox.Root
        className={styles.checkbox}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
      >
        <Checkbox.Indicator>
          {todo.completed && '✓'}
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span className={todo.completed ? styles.completedText : styles.text}>
        {todo.text}
      </span>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(todo.id)}
        type="button"
      >
        삭제
      </button>
    </div>
  )
} 