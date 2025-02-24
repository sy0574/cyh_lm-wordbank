
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMatchTimer } from '../useMatchTimer';
import { MAX_TIME, BASE_POINTS, MAX_BONUS } from '@/utils/scoring';
import { vi } from 'vitest';

describe('useMatchTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with correct values', () => {
    const startTime = Date.now();
    const { result } = renderHook(() => useMatchTimer(startTime));

    expect(result.current.timeLeft).toBe(MAX_TIME);
    expect(result.current.potentialPoints).toBe(BASE_POINTS + MAX_BONUS);
  });

  it('decrements timeLeft and updates potentialPoints over time', () => {
    const startTime = Date.now();
    const { result } = renderHook(() => useMatchTimer(startTime));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const expectedTimeLeft = MAX_TIME - 1000;
    const timeRatio = expectedTimeLeft / MAX_TIME;
    const expectedPoints = BASE_POINTS + Math.round(MAX_BONUS * timeRatio);

    expect(result.current.timeLeft).toBe(expectedTimeLeft);
    expect(result.current.potentialPoints).toBe(expectedPoints);
  });

  it('stops at 0 timeLeft and minimum points', () => {
    const startTime = Date.now();
    const { result } = renderHook(() => useMatchTimer(startTime));

    act(() => {
      vi.advanceTimersByTime(MAX_TIME + 1000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.potentialPoints).toBe(BASE_POINTS);
  });
});
