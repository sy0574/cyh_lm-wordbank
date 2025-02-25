
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStudentSelection } from '../useStudentSelection';
import { Student, MatchResult } from '@/types/match';
import * as router from 'react-router-dom';
import { vi } from 'vitest';

// Mock navigate function
const mockNavigate = vi.fn();
vi.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);

const mockStudents: Student[] = [
  { id: '1', name: 'Student 1', avatar: 'avatar1', class: 'Class A' },
  { id: '2', name: 'Student 2', avatar: 'avatar2', class: 'Class A' }
];

const mockResults: MatchResult[] = [];

describe('useStudentSelection', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    // Mock the speech synthesis
    Object.assign(window, { speechSynthesis: { speak: vi.fn() } });
  });

  it('initializes with correct values', () => {
    const { result } = renderHook(() => 
      useStudentSelection(mockStudents, 2, 0, mockResults, 'easy')
    );

    expect(result.current.currentStudent).toBeNull();
    expect(result.current.studentAnswerCounts).toEqual({});
  });

  it('selects students in round-robin order', () => {
    const { result } = renderHook(() => 
      useStudentSelection(mockStudents, 2, 0, mockResults, 'easy')
    );

    act(() => {
      const firstStudent = result.current.selectNextStudent();
      expect(firstStudent.id).toBe('1');
      
      result.current.updateStudentAnswerCount('1');
      const secondStudent = result.current.selectNextStudent();
      expect(secondStudent.id).toBe('2');
    });
  });

  it('navigates to summary when all students complete their questions', () => {
    const { result } = renderHook(() => 
      useStudentSelection(mockStudents, 1, 0, mockResults, 'easy')
    );

    act(() => {
      result.current.selectNextStudent();
      result.current.updateStudentAnswerCount('1');
      result.current.selectNextStudent();
      result.current.updateStudentAnswerCount('2');
      result.current.selectNextStudent();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/match-summary', expect.any(Object));
  });

  it('tracks student answer counts correctly', () => {
    const { result } = renderHook(() => 
      useStudentSelection(mockStudents, 2, 0, mockResults, 'easy')
    );

    act(() => {
      result.current.selectNextStudent();
      result.current.updateStudentAnswerCount('1');
    });

    expect(result.current.studentAnswerCounts['1']).toBe(1);
  });
});
