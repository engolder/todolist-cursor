import { type FC } from 'react'
import { TodoList } from "../widgets/todo/TodoList";

export const App: FC = () => {
  return (
    <main>
      <TodoList />
    </main>
  )
}

export default App
