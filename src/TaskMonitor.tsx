import { useState } from 'react';
import { runTasks } from './api.ts';
import styles from './TaskMonitor.module.css';
import { tasksList } from './tasks.ts';
import type { TTaskItem } from './TaskItem.tsx';
import { TaskItem } from './TaskItem.tsx';

export const TaskMonitor = () => {
  const [concurrency, setConcurrency] = useState(2);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<TTaskItem<string>[]>(
    tasksList.map((task) => ({
      status: 'Ready',
      id: task.id,
      action: task.action,
      title: task.name,
    }))
  );

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
        task.id === taskId ? { ...task, status: 'Error', error: err } : task
      )
    );
  };

  const handleRunClick = () => {
    setIsRunning(true);
    runTasks(
      tasks,
      concurrency,
      onTaskProgress,
      onTaskResolve,
      onTaskReject
    ).then((tasksResults) => {
      console.log(tasksResults);
      setIsFirstLoad(false);
      setIsRunning(false);
    });
  };

  return (
    <div className={styles['view-wrapper']}>
      <div className={styles['section-title']}>
        <h1>Task Monitor</h1>
        <h5>Track every task, from start to finish.</h5>
      </div>
      <div className={styles['actions']}>
        Concurrency:{' '}
        <input
          type="number"
          value={concurrency}
          min={1}
          max={5}
          onChange={handleConcurrencyChange}
        />
        <button
          className={isRunning && styles['running']}
          onClick={handleRunClick}
        >
          {isRunning ? 'Running...' : isFirstLoad ? 'Run tasks' : 'Run again'}
        </button>
      </div>
      <table>
        <th>Task</th>
        <th>Status</th>
        <th>Output</th>
        <tbody>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
