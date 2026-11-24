import { useState } from 'react';
import { runTasks } from './api.ts';
import styles from './TaskMonitor.module.css';
import { tasksList } from './tasks.ts';
import type { TTaskItem } from './TaskItem.tsx';
import { TaskItem } from './TaskItem.tsx';
import { Chip } from'./components/Chip.tsx';

export const TaskMonitor = () => {
  const [concurrency, setConcurrency] = useState(2);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<TTaskItem<string>[]>(
    tasksList.map((task) => ({
      status: 'Waiting',
      id: task.id,
      action: task.action,
      title: task.name,
    }))
  );

  const [jobStatus, setJobStatus] = useState<'Ready' | 'Running' | 'Completed' | 'Error'>('Ready');

  const tasksStatuses = ['Waiting', 'Running', 'Succeeded', 'Failed'];
  const tasksByStatus = tasksStatuses.reduce((acc, status) => {
    acc.set(status, tasks.filter((task => task.status === status)))
    return acc;
  }, new Map<string, TTaskItem>());
  const completedTasks = tasksByStatus.get('Succeeded')?.length + tasksByStatus.get('Failed')?.length;
  const progressPercentage = completedTasks / tasks.length * 100;

  const handleConcurrencyChange = (e) => {
    const concurrency = e.target.valueAsNumber;
    if (Number.isInteger(concurrency) && concurrency > 0 && concurrency < 6) {
      setConcurrency(concurrency);
    }
  };

  const onTaskProgress = (taskId) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: 'Running' } : task
      )
    );
  };

  const onTaskResolve = (taskId, res) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'Succeeded', result: res }
          : task
      )
    );
  };

  const onTaskReject = (taskId, err) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: 'Failed', error: err } : task
      )
    );
  };

  const handleRunClick = () => {
    setJobStatus('Running');
    setIsRunning(true);
    runTasks(
      tasks,
      concurrency,
      onTaskProgress,
      onTaskResolve,
      onTaskReject
    ).then((tasksResults) => {
      const jobStatus = Object.values(tasksResults).every(res => res.success);
      setJobStatus(jobStatus ? 'Completed' : 'Error');
      setIsFirstLoad(false);
      setIsRunning(false);
    });
  };


  const getJobStatusChip = (jobStatus: typeof jobStatus) => {
    const chipStatusValues = {
      Ready: {
        chipStatus: 'Idle',
      },
      Running: {
        chipStatus: 'Running',
      },
      Completed: {
        chipStatus: 'Success',
      },
      Error: {
        chipStatus: 'Partial',
      }
    }
    const getJobStatusTitle = () => {
      switch (jobStatus) {
        case 'Error':
          return 'Completed with errors';
        default:
          return jobStatus
      }
    }
    return <Chip status={chipStatusValues[jobStatus]?.chipStatus} text={getJobStatusTitle()} />
  }

  return (
    <div className={styles['view-wrapper']}>
      <div className={styles['section-title']}>
        <div className={styles.titles}><h1>Task Monitor</h1>
          <h5>Track every task, from start to finish.</h5></div>
        {getJobStatusChip(jobStatus)}
      </div>
      <div className={styles['actions']}>
        Concurrency:{' '}
        <input
          type="number"
          value={concurrency}
          min={1}
          max={5}
          onChange={handleConcurrencyChange}
          disabled={isRunning}
        />
        <button
          className={isRunning && styles['running']}
          onClick={handleRunClick}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : isFirstLoad ? 'Run tasks' : 'Run again'}
        </button>
      </div>
      <div className={styles['summary-cards']}>
        {tasksStatuses.map(status => (
          <div key={status} className={styles['card']}>
            <span>{status}</span>
            <span>{tasksByStatus.get(status)?.length}</span>
          </div>
        ))}
      </div>
      <div className={styles['progress-status']}>
        <span>{completedTasks} of {tasks.length} completed</span>
        <span>{progressPercentage}%</span>
      </div>
      <progress id="file" max="100" value={progressPercentage} />
      <div className={styles['table-wrapper']}>
        <table>
          <thead><tr>
            <th>Task</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Output</th>
            <th></th>
          </tr></thead>
          <tbody>
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
