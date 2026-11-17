 export type TTaskItem<T> =
  | {
      status: 'Ready' | 'Running';
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
      status: 'Error';
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
      <td>{task.status === 'Succeeded' && result}</td>
    </tr>
  );
};
