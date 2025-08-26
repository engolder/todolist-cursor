import { type FC } from 'react'
import { TodoList } from "../widgets/todo/TodoList";
import { QueryProvider } from './providers/QueryProvider';

export const App: FC = () => {
  return (
    <QueryProvider>
      <main>
        <TodoList />
      </main>
    </QueryProvider>
  )
}

export default App
