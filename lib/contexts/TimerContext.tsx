'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { TimerMode, TimerState } from '@/types/app';
import { useAuth } from './AuthContext';
import { createClient } from '../supabase/client';

// Constants for timer durations (in seconds)
const DEFAULT_WORK_DURATION = 25 * 60; // 25 minutes
const DEFAULT_SHORT_BREAK_DURATION = 5 * 60; // 5 minutes
const DEFAULT_LONG_BREAK_DURATION = 15 * 60; // 15 minutes
const DEFAULT_INTERVALS_UNTIL_LONG_BREAK = 4;

// Action types
type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'SET_MODE'; payload: { mode: TimerMode } }
  | { type: 'SET_TASK'; payload: { taskId: string | null } }
  | { type: 'COMPLETE_POMODORO' }
  | { type: 'SET_DURATIONS'; payload: { workDuration?: number; shortBreakDuration?: number; longBreakDuration?: number; intervalsUntilLongBreak?: number } };

// Timer reducer
function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET':
      return {
        ...state,
        isRunning: false,
        timeLeft: state.mode === 'work' ? state.workDuration * 60 : 
                 state.mode === 'short_break' ? state.shortBreakDuration * 60 : 
                 state.longBreakDuration * 60
      };
    case 'TICK':
      return {
        ...state,
        timeLeft: Math.max(0, state.timeLeft - 1)
      };
    case 'SET_MODE': {
      const newMode = action.payload.mode;
      let newTimeLeft;
      
      if (newMode === 'work') {
        newTimeLeft = state.workDuration * 60;
      } else if (newMode === 'short_break') {
        newTimeLeft = state.shortBreakDuration * 60;
      } else {
        newTimeLeft = state.longBreakDuration * 60;
      }
      
      return {
        ...state,
        mode: newMode,
        timeLeft: newTimeLeft,
        isRunning: false
      };
    }
    case 'SET_TASK':
      return {
        ...state,
        currentTaskId: action.payload.taskId
      };
    case 'COMPLETE_POMODORO': {
      const newCompletedPomodoros = state.completedPomodoros + 1;
      const shouldTakeLongBreak = newCompletedPomodoros % state.intervalsUntilLongBreak === 0;
      
      return {
        ...state,
        completedPomodoros: newCompletedPomodoros,
        isRunning: false,
        mode: shouldTakeLongBreak ? 'long_break' : 'short_break',
        timeLeft: shouldTakeLongBreak ? state.longBreakDuration * 60 : state.shortBreakDuration * 60
      };
    }
    case 'SET_DURATIONS':
      return {
        ...state,
        workDuration: action.payload.workDuration || state.workDuration,
        shortBreakDuration: action.payload.shortBreakDuration || state.shortBreakDuration,
        longBreakDuration: action.payload.longBreakDuration || state.longBreakDuration,
        intervalsUntilLongBreak: action.payload.intervalsUntilLongBreak || state.intervalsUntilLongBreak,
        timeLeft: state.mode === 'work' ? 
          (action.payload.workDuration || state.workDuration) * 60 : 
          state.mode === 'short_break' ? 
            (action.payload.shortBreakDuration || state.shortBreakDuration) * 60 : 
            (action.payload.longBreakDuration || state.longBreakDuration) * 60
      };
    default:
      return state;
  }
}

// Initial state
const initialTimerState: TimerState = {
  timeLeft: DEFAULT_WORK_DURATION,
  isRunning: false,
  mode: 'work',
  currentTaskId: null,
  completedPomodoros: 0,
  workDuration: DEFAULT_WORK_DURATION / 60, // convert to minutes
  shortBreakDuration: DEFAULT_SHORT_BREAK_DURATION / 60,
  longBreakDuration: DEFAULT_LONG_BREAK_DURATION / 60,
  intervalsUntilLongBreak: DEFAULT_INTERVALS_UNTIL_LONG_BREAK
};

// Context type
interface TimerContextType {
  state: TimerState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
  setCurrentTask: (taskId: string | null) => void;
  completePomodoro: () => Promise<void>;
  setDurations: (durations: { workDuration?: number; shortBreakDuration?: number; longBreakDuration?: number; intervalsUntilLongBreak?: number }) => void;
}

// Create context
const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);
  const { user } = useAuth();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  
  // 使用单例模式客户端
  const supabase = createClient();

  // Set up the timer interval
  useEffect(() => {
    if (state.isRunning) {
      const id = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      setIntervalId(id);

      return () => clearInterval(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    return () => {};
  }, [state.isRunning, intervalId]);

  // Check for timer completion
  useEffect(() => {
    if (state.timeLeft === 0 && state.isRunning) {
      pauseTimer();
      
      if (state.mode === 'work') {
        // Only automatically complete pomodoro if timer reached zero during work mode
        completePomodoro();
      }
      
      // Play sound or notification here
      try {
        const audio = new Audio('/notification.mp3');
        audio.play();
      } catch (error) {
        console.error('Failed to play notification sound:', error);
      }
    }
  }, [state.timeLeft, state.isRunning, state.mode]);

  // Timer control functions
  const startTimer = () => dispatch({ type: 'START' });
  const pauseTimer = () => dispatch({ type: 'PAUSE' });
  const resetTimer = () => dispatch({ type: 'RESET' });
  
  const setTimerMode = (mode: TimerMode) => {
    dispatch({ type: 'SET_MODE', payload: { mode } });
  };
  
  const setCurrentTask = (taskId: string | null) => {
    dispatch({ type: 'SET_TASK', payload: { taskId } });
  };
  
  const completePomodoro = async () => {
    if (!user || !state.currentTaskId) {
      dispatch({ type: 'COMPLETE_POMODORO' });
      return;
    }
    
    try {
      // 记录番茄钟会话 - 暂时使用本地操作，实际生产环境再启用 Supabase
      console.log('完成番茄钟', {
        用户ID: user.id,
        任务ID: state.currentTaskId,
        持续时间: state.workDuration,
        开始时间: new Date(Date.now() - state.workDuration * 60 * 1000),
        结束时间: new Date()
      });
      
      // 实际生产环境再启用 Supabase 代码
      /* 
      await supabase.from('pomodoro_sessions').insert({
        user_id: user.id,
        task_id: state.currentTaskId,
        duration_minutes: state.workDuration,
        completed: true,
        started_at: new Date(Date.now() - state.workDuration * 60 * 1000).toISOString(),
        completed_at: new Date().toISOString()
      });
      
      await supabase.rpc('increment_task_pomodoros', { 
        p_task_id: state.currentTaskId,
      });
      */
      
      // 更新番茄钟状态
      dispatch({ type: 'COMPLETE_POMODORO' });
    } catch (error) {
      console.error('番茄钟记录失败:', error);
      dispatch({ type: 'COMPLETE_POMODORO' });
    }
  };
  
  const setDurations = (durations: { workDuration?: number; shortBreakDuration?: number; longBreakDuration?: number; intervalsUntilLongBreak?: number }) => {
    dispatch({ type: 'SET_DURATIONS', payload: durations });
  };
  
  const value = {
    state,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    setCurrentTask,
    completePomodoro,
    setDurations
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
