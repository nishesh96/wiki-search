// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay = 1000
): ((...args: Parameters<T>) => void) => {
  let timerId = null;

  return (...args: Parameters<T>) => {
    clearTimeout(timerId!);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

export { debounce };
