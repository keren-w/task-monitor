import { useState, useEffect } from 'react';
export type TTaskItem<T> =
  {
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

const durationFormatter = new Intl.DurationFormat('en', { style: 'narrow' });

export const TaskItem = ({
  task,
}: {
  key: string;
  task: TTaskItem<string>;
}) => {
  const { status, title, error, result } = task;
  const [duration, setDuration] = useState<undefined | Number>(undefined);

  useEffect(() => {
    let interval;
    let duration;
    if (status === 'Running') {
      duration = 0;
      setDuration(duration);
      interval = setInterval(() => {
        setDuration(++duration)
      }, 100);
    }
    return () => {
      clearInterval(interval);
    };


  }, [status]);
  const durationInSeconds = duration > 0 ? duration/10 : 0; 
  return (
    <tr>
      <td>{title}</td>
      <td>{status}</td>
      <td>{(duration || duration === 0) ? `${durationInSeconds}s` : '---'}</td>
      <td>{status === 'Running' && 'Processing...' || task.status === 'Succeeded' && result || task.status === 'Failed' && error.message}</td>
    </tr>
  );
};
