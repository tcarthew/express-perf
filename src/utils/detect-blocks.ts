import { createHook } from 'async_hooks';
import { monitorEventLoopDelay } from 'perf_hooks';

export function detectBlocks(thresholdMS: number): void {
  console.log(`event block detect @ ${thresholdMS}`);

  const lag = monitorEventLoopDelay({ resolution: 20 });
  const thresholdNs = thresholdMS * 1e6;
  const cache = new Map<number, [number, number]>();

  const before = (asyncId: number) => {
    cache.set(asyncId, process.hrtime());
  }

  const after = (asyncId: number) => {
    const cached = cache.get(asyncId);

    if (!cached) {
      return;
    }

    cache.delete(asyncId);

    const [sec, nsec] = process.hrtime(cached);
    const diffNs = (sec * 1e9) + nsec;

    if (diffNs > thresholdNs){
      const blockTimeMs = diffNs / 1e6;
      console.warn('Event loop blocked', {
        blockTimeMs,
        lagMs: {
          min: lag.min / 1e6,
          max: lag.max / 1e6,
          mean: lag.mean / 1e6,
          p90: lag.percentile(90) / 1e6
        }
      })
    }
  }

  const asyncHook = createHook({ before, after });

  asyncHook.enable();
  lag.enable();
}