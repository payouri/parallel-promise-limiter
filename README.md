# Parallel Promise Limiter

Parallel Promise Limiter is a library designed to run promises in parallel with a specified concurrency limit. Unlike traditional chunk strategies, this library allows for dynamic processing, adapting to available capacity without waiting for an entire batch to complete.

## Prerequisites

- Node.js version 20.0.0 or higher

## Installation

You can install the Parallel Promise Limiter library via npm:

```bash
npm install parallel-promise-limiter;
```
## Usage
Below is a basic example of how to use the Parallel Promise Limiter:

```typescript
import runPromises from 'parallel-promise-limiter';

const exampleUsage = async () => {
  const tasks = [
    () => Promise.resolve(1),
    () => Promise.resolve(2),
    () => Promise.resolve(3),
  ];

  const results = await runPromises(tasks, {
    limit: 2,
    onProgress: (progress) => {
      console.log(`Progress: ${progress.done}/${progress.total}`);
    },
  });

  console.log(results);
};

exampleUsage();
```

## Options
limit (optional): Number of promises to run concurrently. Default is 5.

signal (optional): An AbortSignal to cancel the operation.

onProgress (optional): A callback function to receive progress updates.

bailOnFail (optional): If true, stops processing upon the first failure. Default is true.

## Contribution Guidelines
Contributions are welcome! Please open an issue or submit a pull request on GitHub to contribute to this project.

## License
This project is licensed under the MIT License.

## Contact
For any questions or further information, please open an issue.