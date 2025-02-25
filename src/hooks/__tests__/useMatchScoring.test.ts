
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMatchScoring } from '../useMatchScoring';
import { Student } from '@/types/match';
import { MAX_TIME } from '@/utils/scoring';

const mockStudents: Student[] = [
  { id: '1', name: 'Student 1', avatar: 'avatar1', class: 'Class A' },
  { id: '2', name: 'Student 2', avatar: 'avatar2', class: 'Class A' }
];

describe('useMatchScoring', () => {
  it('initializes with correct values', () => {
    const { result } = renderHook(() => useMatchScoring(mockStudents));

    expect(result.current.score).toBe(0);
    expect(result.current.showPoints).toBe(false);
    expect(result.current.earnedPoints).toBe(0);
  });

  it('updates scores correctly for correct answers', () => {
    const { result } = renderHook(() => useMatchScoring(mockStudents));

    act(() => {
      const points = result.current.updateScores(true, MAX_TIME, '1');
      expect(points).toBeGreaterThan(0);
      expect(result.current.score).toBe(points);
      expect(result.current.showPoints).toBe(true);
      expect(result.current.earnedPoints).toBe(points);
    });
  });

  it('does not update scores for incorrect answers', () => {
    const { result } = renderHook(() => useMatchScoring(mockStudents));

    act(() => {
      const points = result.current.updateScores(false, MAX_TIME, '1');
      expect(points).toBe(0);
      expect(result.current.score).toBe(0);
    });
  });

  it('returns correct rankings', () => {
    const { result } = renderHook(() => useMatchScoring(mockStudents));

    act(() => {
      result.current.updateScores(true, MAX_TIME, '1');
      result.current.updateScores(true, MAX_TIME / 2, '2');
    });

    const rankings = result.current.getRankings();
    expect(rankings).toHaveLength(2);
    expect(rankings[0].student.id).toBe('1');
    expect(rankings[1].student.id).toBe('2');
    expect(rankings[0].score).toBeGreaterThan(rankings[1].score);
  });
});
