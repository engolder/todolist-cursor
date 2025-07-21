import { type FC } from 'react'
import { TodoList } from './features/todos/components/TodoList'

export const App: FC = () => {
  return (
    <main>
      <TodoList />
    </main>
  )
}

export default App
