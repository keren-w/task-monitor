export type TTaskItem<T> =
  {
    status: 'Waiting';
    title: string;
    id: string;
    action: () => Promise<T>;
  }
  | {
    status: 'Running';
    title: string;
    id: string;
    action: () => Promise<T>;
    duration: number;
  }
  | {
    status: 'Succeeded';
    title: string;
    id: string;
    action: () => Promise<T>;
    result?: T;
    duration: number;
  }
  | {
    status: 'Failed';
    title: string;
    id: string;
    action: () => Promise<T>;
    error: unknown;
    duration: number;
  };

export const TaskItem = ({
  task,
}: {
  key: string;
  task: TTaskItem<string>;
}) => {
  const { error, result } = task;

  return (
    <tr>
      <td>{task.title}</td>
      <td>{task.status}</td>
      <td>{task.duration || '---'}</td>
      <td>{task.status === 'Running' && 'Processing...' || task.status === 'Succeeded' && result || task.status === 'Failed' && error.message}</td>
    </tr>
  );
};
