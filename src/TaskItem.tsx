 export type TTaskItem<T> =
  | {
      status: 'Waiting' | 'Running';
      title: string;
      id: string;
      action: () => Promise<T>;
    }
  | {
      status: 'Succeeded';
      title: string;
      id: string;
      action: () => Promise<T>;
      result?: T;
    }
  | {
      status: 'Failed';
      title: string;
      id: string;
      action: () => Promise<T>;
      error: unknown;
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
      <td>---</td>
      <td>{task.status=== 'Running' && 'Processing...' || task.status === 'Succeeded' && result || task.status === 'Failed' && error.message}</td>
    </tr>
  );
};
