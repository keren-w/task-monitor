import type { TTaskItem } from './TaskItem.tsx';

type TaskResponse<T> =
  | { success: true; data: T }
  | { success: false; error: unknown };

export async function runTasks<T>(
  tasks: TTaskItem<T>[],
  concurrency: number,
  onTaskProgress: (taskIndex: string) => void,
  onTaskResolve: (taskIndex: string, res: T) => void,
  onTaskReject: (taskIndex: string, rej: unknown) => void
): Promise<TaskResponse<T>[]> {
  const results: TaskResponse<T>[] = new Array(tasks.length);
  let nextTaskIndex = 0;

  console.log('concurrency: ', concurrency);

  const runTask = async () => {
    if (nextTaskIndex >= tasks.length) {
      return;
    }
    const currentTaskIndex = nextTaskIndex;
    onTaskProgress(tasks[currentTaskIndex].id);
    try {
      nextTaskIndex += 1;
      const res = await tasks[currentTaskIndex].action();
      onTaskResolve(tasks[currentTaskIndex].id, res);
      results[currentTaskIndex] = { success: true, data: res };
    } catch (err) {
      results[currentTaskIndex] = { success: false, error: err };
      onTaskReject(tasks[currentTaskIndex].id, err);
    } finally {
      await runTask();
    }
  };

  await Promise.all(new Array(concurrency).fill(0).map(() => runTask()));
  return results;
}
