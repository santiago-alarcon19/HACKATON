import confetti from 'canvas-confetti';
import { runOrderCelebration } from './order-celebration';

jest.mock('canvas-confetti', () => ({
  __esModule: true,
  default: Object.assign(jest.fn(), {
    create: jest.fn(() => jest.fn()),
  }),
}));

describe('runOrderCelebration', () => {
  const mockedConfetti = confetti as jest.Mocked<typeof confetti> & {
    create: jest.Mock;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockedConfetti.create.mockClear();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('creates confetti when motion is allowed', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn().mockReturnValue({ matches: false }),
    });

    runOrderCelebration();
    jest.advanceTimersByTime(1000);

    expect(mockedConfetti.create).toHaveBeenCalled();
  });

  it('skips confetti when reduced motion is preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn().mockReturnValue({ matches: true }),
    });

    runOrderCelebration();

    expect(mockedConfetti.create).not.toHaveBeenCalled();
  });
});
