import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Apple, SelectionBox, generateApples } from "../gameLogic";

export type GameState = "ready" | "playing" | "gameOver";

interface AppleGameState {
  gameState: GameState;
  apples: Apple[];
  selectionBox: SelectionBox | null;
  score: number;
  timeLeft: number;
  hints: number;
  showHints: boolean;
  startTime: number | null;
  showScoreSubmission: boolean;
  
  // Actions
  startGame: () => void;
  resetGame: () => void;
  updateGame: (deltaTime: number) => void;
  startSelection: (x: number, y: number) => void;
  updateSelection: (x: number, y: number) => void;
  endSelection: () => void;
  removeApples: (appleIds: string[]) => void;
  useHint: () => void;
  hideHints: () => void;
  showScoreSubmissionDialog: () => void;
  hideScoreSubmissionDialog: () => void;
  getCompletionTime: () => number | null;
}

export const useAppleGame = create<AppleGameState>()(
  subscribeWithSelector((set, get) => ({
    gameState: "ready",
    apples: [],
    selectionBox: null,
    score: 0,
    timeLeft: 120, // 2 minutes
    hints: 3, // Start with 3 hints
    showHints: false,
    startTime: null,
    showScoreSubmission: false,
    
    startGame: () => {
      set({
        gameState: "playing",
        apples: generateApples(),
        score: 0,
        timeLeft: 120,
        selectionBox: null,
        hints: 3,
        showHints: false,
        startTime: Date.now(),
        showScoreSubmission: false
      });
    },
    
    resetGame: () => {
      set({
        gameState: "ready",
        apples: [],
        score: 0,
        timeLeft: 120,
        selectionBox: null,
        hints: 3,
        showHints: false,
        startTime: null,
        showScoreSubmission: false
      });
    },
    
    updateGame: (deltaTime: number) => {
      const state = get();
      if (state.gameState !== "playing") return;
      
      const newTimeLeft = Math.max(0, state.timeLeft - deltaTime / 1000);
      
      if (newTimeLeft <= 0) {
        set({ gameState: "gameOver", timeLeft: 0 });
      } else {
        set({ timeLeft: newTimeLeft });
      }
    },
    
    startSelection: (x: number, y: number) => {
      set({
        selectionBox: {
          startX: x,
          startY: y,
          endX: x,
          endY: y,
          isValid: false
        }
      });
    },
    
    updateSelection: (x: number, y: number) => {
      const { selectionBox, apples } = get();
      if (!selectionBox) return;
      
      // Find apples within selection
      const selectedApples = apples.filter(apple => {
        const minX = Math.min(selectionBox.startX, x);
        const maxX = Math.max(selectionBox.startX, x);
        const minY = Math.min(selectionBox.startY, y);
        const maxY = Math.max(selectionBox.startY, y);
        
        return apple.x >= minX && apple.x <= maxX && 
               apple.y >= minY && apple.y <= maxY;
      });
      
      const sum = selectedApples.reduce((total, apple) => total + apple.number, 0);
      const isValid = sum === 10 && selectedApples.length > 0;
      
      set({
        selectionBox: {
          ...selectionBox,
          endX: x,
          endY: y,
          isValid
        }
      });
    },
    
    endSelection: () => {
      console.log("endSelection called - clearing selectionBox");
      set({ selectionBox: null });
      // Force a re-render to ensure the selection box disappears
      setTimeout(() => {
        set({ selectionBox: null });
      }, 50);
    },
    
    removeApples: (appleIds: string[]) => {
      const { apples, score } = get();
      const newApples = apples.filter(apple => !appleIds.includes(apple.id));
      const newScore = score + appleIds.length;
      
      set({
        apples: newApples,
        score: newScore
      });
    },
    
    useHint: () => {
      const { hints, showHints } = get();
      if (hints > 0 && !showHints) {
        set({
          hints: hints - 1,
          showHints: true
        });
        
        // Auto-hide hints after 10 seconds
        setTimeout(() => {
          set({ showHints: false });
        }, 10000);
      }
    },
    
    hideHints: () => {
      set({ showHints: false });
    },
    
    showScoreSubmissionDialog: () => {
      set({ showScoreSubmission: true });
    },
    
    hideScoreSubmissionDialog: () => {
      set({ showScoreSubmission: false });
    },
    
    getCompletionTime: () => {
      const { startTime, timeLeft, apples } = get();
      if (!startTime) return null;
      
      // If all apples are cleared (perfect game)
      if (apples.length === 0) {
        return Math.floor((Date.now() - startTime) / 1000);
      }
      
      // If time ran out
      if (timeLeft <= 0) {
        return null; // Time up, no completion time
      }
      
      return null; // Game still in progress
    }
  }))
);
