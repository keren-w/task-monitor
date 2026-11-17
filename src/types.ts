
export type TTask<T> = {
  id: string;
  name: string;
  action: () => Promise<T>;
};