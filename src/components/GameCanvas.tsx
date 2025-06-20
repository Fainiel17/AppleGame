import { useEffect, useRef, useCallback } from "react";
import { useAppleGame } from "../lib/stores/useAppleGame";
import { useAudio } from "../lib/stores/useAudio";
import { Apple, SelectionBox, findValidCombinations } from "../lib/gameLogic";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  const { 
    gameState, 
    apples, 
    selectionBox, 
    score, 
    timeLeft,
    showHints,
    updateGame,
    startSelection,
    updateSelection,
    endSelection,
    removeApples
  } = useAppleGame();
  
  const { playHit, playSuccess } = useAudio();

  const drawApple = useCallback((ctx: CanvasRenderingContext2D, apple: Apple, isHighlighted: boolean = false) => {
    const { x, y, number, size } = apple;
    
    // Draw apple with highlight effect if needed
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    
    if (isHighlighted) {
      // Highlighted apple - golden glow
      ctx.fillStyle = "#ffd700";
      ctx.shadowColor = "#ffff00";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#ff8c00";
      ctx.lineWidth = 3;
    } else {
      // Normal apple
      ctx.fillStyle = "#ff4444";
      ctx.fill();
      ctx.strokeStyle = "#cc0000";
      ctx.lineWidth = 2;
    }
    ctx.stroke();
    
    // Draw number
    ctx.fillStyle = isHighlighted ? "black" : "white";
    ctx.font = `bold ${size}px Inter`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(number.toString(), x, y);
  }, []);

  const drawSelectionBox = useCallback((ctx: CanvasRenderingContext2D, box: SelectionBox) => {
    const { startX, startY, endX, endY, isValid } = box;
    
    ctx.strokeStyle = isValid ? "#ff0000" : "#666666";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      Math.min(startX, endX),
      Math.min(startY, endY),
      Math.abs(endX - startX),
      Math.abs(endY - startY)
    );
    ctx.setLineDash([]);
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines (subtle)
    ctx.strokeStyle = "#e9ecef";
    ctx.lineWidth = 1;
    const cellWidth = canvas.width / 17;
    const cellHeight = canvas.height / 10;
    
    // Vertical lines
    for (let i = 1; i < 17; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 1; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(canvas.width, i * cellHeight);
      ctx.stroke();
    }
    
    // Get highlighted apples if hints are shown
    let highlightedApples: Set<string> = new Set();
    if (showHints) {
      const validCombinations = findValidCombinations(apples);
      // Show only the first 2 combinations to avoid overwhelming
      validCombinations.slice(0, 2).forEach(combination => {
        combination.forEach(apple => highlightedApples.add(apple.id));
      });
    }
    
    // Draw apples
    apples.forEach(apple => {
      const isHighlighted = highlightedApples.has(apple.id);
      drawApple(ctx, apple, isHighlighted);
    });
    
    // Draw selection box
    if (selectionBox) {
      drawSelectionBox(ctx, selectionBox);
    }
  }, [apples, selectionBox, showHints, drawApple, drawSelectionBox]);

  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    if (gameState === "playing") {
      updateGame(deltaTime);
    }
    
    render();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updateGame, render]);

  useEffect(() => {
    if (gameState === "playing") {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  const isTouch = useRef(false);

  const getCanvasCoordinates = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    return { x, y };
  }, []);

  const getTouchCoordinates = useCallback((e: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const touch = e.touches[0] || e.changedTouches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    
    return { x, y };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isTouch.current) return;
    if (gameState !== "playing") return;
    
    const { x, y } = getCanvasCoordinates(e);
    startSelection(x, y);
  }, [gameState, startSelection, getCanvasCoordinates]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isTouch.current) return;
    if (gameState !== "playing" || !selectionBox) return;
    
    const { x, y } = getCanvasCoordinates(e);
    updateSelection(x, y);
  }, [gameState, selectionBox, updateSelection, getCanvasCoordinates]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isTouch.current = true;
    
    if (gameState !== "playing") return;
    
    const { x, y } = getTouchCoordinates(e);
    console.log("Touch start:", { x, y });
    startSelection(x, y);
  }, [gameState, startSelection, getTouchCoordinates]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (gameState !== "playing" || !selectionBox) return;
    
    const { x, y } = getTouchCoordinates(e);
    updateSelection(x, y);
  }, [gameState, selectionBox, updateSelection, getTouchCoordinates]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Touch end - processing selection");
    
    // Force end selection immediately
    if (selectionBox && gameState === "playing") {
      const selectedApples = apples.filter(apple => {
        const { startX, startY, endX, endY } = selectionBox;
        const minX = Math.min(startX, endX);
        const maxX = Math.max(startX, endX);
        const minY = Math.min(startY, endY);
        const maxY = Math.max(startY, endY);
        
        return apple.x >= minX && apple.x <= maxX && 
               apple.y >= minY && apple.y <= maxY;
      });
      
      const sum = selectedApples.reduce((total, apple) => total + apple.number, 0);
      
      console.log("Touch end - selected:", selectedApples.length, "sum:", sum);
      
      if (sum === 10 && selectedApples.length > 0) {
        removeApples(selectedApples.map(apple => apple.id));
        playSuccess();
      } else if (selectedApples.length > 0) {
        playHit();
      }
    }
    
    // Always clear selection
    endSelection();
    isTouch.current = false;
  }, [gameState, selectionBox, apples, removeApples, endSelection, playSuccess, playHit]);

  const handleSelectionEnd = useCallback(() => {
    console.log("handleSelectionEnd called - gameState:", gameState, "selectionBox:", selectionBox);
    
    if (gameState !== "playing" || !selectionBox) {
      console.log("Early return - gameState or selectionBox invalid");
      endSelection();
      return;
    }
    
    const selectedApples = apples.filter(apple => {
      const { startX, startY, endX, endY } = selectionBox;
      const minX = Math.min(startX, endX);
      const maxX = Math.max(startX, endX);
      const minY = Math.min(startY, endY);
      const maxY = Math.max(startY, endY);
      
      // Check if apple center is within selection box
      const isSelected = apple.x >= minX && apple.x <= maxX && 
                        apple.y >= minY && apple.y <= maxY;
      
      if (isSelected) {
        console.log("Selected apple:", apple.number, "at", apple.x, apple.y);
      }
      
      return isSelected;
    });
    
    const sum = selectedApples.reduce((total, apple) => total + apple.number, 0);
    
    console.log("Selection ended:", { 
      selectedApples: selectedApples.length, 
      sum, 
      numbers: selectedApples.map(a => a.number),
      selectionBox
    });
    
    if (sum === 10 && selectedApples.length > 0) {
      console.log("Valid selection! Removing apples:", selectedApples.map(a => a.id));
      removeApples(selectedApples.map(apple => apple.id));
      playSuccess();
    } else if (selectedApples.length > 0) {
      console.log("Invalid selection. Sum:", sum);
      playHit();
    }
    
    // Always end selection to clear the box
    endSelection();
  }, [gameState, selectionBox, apples, removeApples, endSelection, playSuccess, playHit]);

  const handleMouseUp = useCallback(() => {
    if (isTouch.current) return;
    handleSelectionEnd();
  }, [handleSelectionEnd]);

  return (
    <canvas
      ref={canvasRef}
      width={850}
      height={500}
      className="border border-gray-300 cursor-crosshair select-none"
      style={{ 
        width: '100%', 
        height: 'auto',
        maxWidth: '850px',
        aspectRatio: '850/500'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    />
  );
}
