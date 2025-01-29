export class AbortPromiseError extends Error {
  name = "AbortPromiseError";
}

export const runPromises = async <T extends Exclude<unknown, Promise<any>>>(
  promisesArray: (() => Promise<T>)[],
  options: {
    limit?: number;
    signal?: AbortSignal;
    onProgress?: (progressObject: {
      progress: number;
      fail: number;
      done: number;
      total: number;
    }) => void;
    bailOnFail?: boolean;
  }
): Promise<T[]> => {
  const { limit = 5, signal, onProgress, bailOnFail = true } = options;
  const results: T[] = [];
  let failCount = 0;

  const promisesLeftToExecute = Array.from(promisesArray).reverse();
  const currentlyRunningPromises = new Map<number, Promise<void>>();
  const currentlyRunningPromisesCount = () => currentlyRunningPromises.size;

  return new Promise<T[]>((resolve, reject) => {
    const onFinally = () => {
      if (!currentlyRunningPromisesCount() && !promisesLeftToExecute.length) {
        resolve(results);
        return;
      }

      if (currentlyRunningPromisesCount() < limit) {
        const index = promisesLeftToExecute.length;
        const promise = promisesLeftToExecute.pop();
        if (!promise) {
          return;
        }

        if (currentlyRunningPromises.has(index)) {
          throw new Error("Promise already running");
        }

        currentlyRunningPromises.set(index, runPromise(index, promise));
      }
    };

    const runPromise = (index: number, promise: () => Promise<T>) =>
      promise()
        .then((v) => {
          results.push(v);
        })
        .catch((e) => {
          if (bailOnFail) {
            reject(e);
            return;
          }
          failCount++;
        })
        .finally(() => {
          currentlyRunningPromises.delete(index);
          onProgress?.({
            done: results.length,
            fail: failCount,
            progress: (results.length + failCount) / promisesArray.length,
            total: promisesArray.length,
          });
          onFinally();
        });

    signal?.addEventListener("abort", () => {
      reject(new AbortPromiseError(signal.reason || "Aborted"));
    });
    for (let count = 0; count < limit; count += 1) {
      const index = promisesLeftToExecute.length;
      const promise = promisesLeftToExecute.pop();
      if (!promise) {
        break;
      }

      currentlyRunningPromises.set(index, runPromise(index, promise));
    }
  });
};

export default runPromises;
