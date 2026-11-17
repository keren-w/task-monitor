import type { TTask } from './types.ts';

const importCustomers = () =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve('42 customers imported'), 500);
  });

const syncInventory = () =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve('128 items synced'), 100);
  });

const generateReport = () =>
  new Promise<string>((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Report service unavailable'));
    }, 200);
  });

const sendSummary = () =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve('Summary sent'), 700);
  });

export const mockTasks: TTask<string>[] = [
  { id: 'import-customers', name: 'Import customers', action: importCustomers },
  { id: 'sync-inventory', name: 'Sync inventory', action: syncInventory },
  { id: 'generate-report', name: 'Generate report', action: generateReport },
  { id: 'send-summary', name: 'Send summary', action: sendSummary },
];

export const tasksList = mockTasks.map((task) => task);
