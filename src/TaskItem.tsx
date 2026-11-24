import { useState, useEffect } from 'react';
import styles from './TaskItem.module.css';
import { Chip } from'./components/Chip.tsx';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const chipStatusValues = {
    Waiting: {
      chipStatus: 'Idle',
    },
    Running: {
      chipStatus: 'Running',
    },
    Succeeded: {
      chipStatus: 'Success',
    },
    Failed: {
      chipStatus: 'Error',
    }
  }
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
  const durationInSeconds = duration > 0 ? duration / 10 : 0;
  return (
    <>
      <tr>
        <td>{title}</td>
        <td> <Chip status={chipStatusValues[status]?.chipStatus} text={status} /></td>
        <td>{(duration || duration === 0) ? `${durationInSeconds}s` : '---'}</td>
        <td>{status === 'Running' && 'Processing...' || task.status === 'Succeeded' && result || task.status === 'Failed' && error.message}</td>
        <td>{status === 'Failed' && <button className={styles['expand']} onClick={() => setIsExpanded((isExpanded => !isExpanded))}>{isExpanded ? 'Hide details' : 'Show details'}</button>}</td>

      </tr>
      {isExpanded && <tr className={styles['expanded']}>
        <td colspan={5}>
          <div>
            <span className={styles['error-details']}>Error details</span>
            <span>{error.message}</span>
          </div>
        </td>
      </tr>}</>
  );
};
