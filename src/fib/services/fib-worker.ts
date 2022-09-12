import path from 'path';
import { isMainThread, parentPort, Worker, workerData } from 'worker_threads';
import { fib } from './fib-service';

if (!isMainThread) {
  const result = fib(workerData.value);

  parentPort?.postMessage({ result });
  process.exit(0);
}

export const run = (count: number): Promise<{ result: number }> => {
  return new Promise((resolve, reject) => {
    let workerPath = path.resolve(__dirname, '../../utils/worker.js');
    const ext = path.extname(__filename);
    
    if (ext === '.js') {
      workerPath = __filename;
    }
    
    const worker = new Worker(workerPath, {
      workerData: {
        value: count,
        path: __filename
      }
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code: number) => {
      if (code !== 0){
        reject(new Error(`Worker exited with error ${code}`));
      }
    });
  });
}