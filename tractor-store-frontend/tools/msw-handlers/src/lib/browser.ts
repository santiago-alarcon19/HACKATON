import { setupWorker } from 'msw/browser';
import { createTractorStoreHandlers } from './handlers';

export async function startBrowserMsw(apiBaseUrl?: string): Promise<void> {
  const worker = setupWorker(...createTractorStoreHandlers(apiBaseUrl));
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: false,
  });
}
