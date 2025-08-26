import { type FC } from 'react'
import { TaskList } from "../widgets/task/TaskList";
import { QueryProvider } from './providers/QueryProvider';

export const App: FC = () => {
  return (
    <QueryProvider>
      <main>
        <TaskList />
      </main>
    </QueryProvider>
  )
}

export default App
