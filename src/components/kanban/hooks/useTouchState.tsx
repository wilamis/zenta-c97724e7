
import { useState } from 'react';

export interface TouchState {
  longPressTimer: NodeJS.Timeout | null;
  draggingTask: string | null;
  initialTouch: { x: number; y: number } | null;
  currentTouchPosition: { x: number; y: number } | null;
}

export function useTouchState() {
  const [touchState, setTouchState] = useState<TouchState>({
    longPressTimer: null,
    draggingTask: null,
    initialTouch: null,
    currentTouchPosition: null,
  });

  const updateTouchState = (updates: Partial<TouchState>) => {
    setTouchState(prev => ({ ...prev, ...updates }));
  };

  return {
    touchState,
    updateTouchState,
  };
}
