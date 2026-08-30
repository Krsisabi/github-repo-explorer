export const createDebounce = <T extends (...args: any[]) => any>(
  cb: T,
  ms: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => cb(...args), ms);
  };
};
