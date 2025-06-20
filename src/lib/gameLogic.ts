export interface Apple {
  id: string;
  x: number;
  y: number;
  number: number;
  size: number;
}

export interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isValid: boolean;
}

export function generateApples(): Apple[] {
  const apples: Apple[] = [];
  const gridWidth = 17;
  const gridHeight = 10;
  const canvasWidth = 850;
  const canvasHeight = 500;
  const cellWidth = canvasWidth / gridWidth;
  const cellHeight = canvasHeight / gridHeight;
  const appleSize = Math.min(cellWidth, cellHeight) * 0.3;
  
  for (let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;
      const number = Math.floor(Math.random() * 9) + 1; // 1-9
      
      apples.push({
        id: `apple-${row}-${col}`,
        x,
        y,
        number,
        size: appleSize
      });
    }
  }
  
  return apples;
}

// Valid combinations that sum to 10
export const validCombinations = [
  // 2 numbers
  [1, 9], [2, 8], [3, 7], [4, 6], [5, 5],
  // 3 numbers
  [1, 1, 8], [1, 2, 7], [1, 3, 6], [1, 4, 5], [2, 2, 6], [2, 3, 5], [2, 4, 4], [3, 3, 4],
  // 4 numbers
  [1, 1, 1, 7], [1, 1, 2, 6], [1, 1, 3, 5], [1, 1, 4, 4], [1, 2, 2, 5], [1, 2, 3, 4], [1, 3, 3, 3], [2, 2, 2, 4], [2, 2, 3, 3]
];

export function isValidSelection(numbers: number[]): boolean {
  const sum = numbers.reduce((total, num) => total + num, 0);
  return sum === 10;
}

// Find all possible valid combinations for hints that can be selected in a single drag
export function findValidCombinations(apples: Apple[]): Apple[][] {
  const validSets: Apple[][] = [];
  
  // Try different rectangular regions to find valid combinations
  const gridWidth = 17;
  const gridHeight = 10;
  const canvasWidth = 850;
  const canvasHeight = 500;
  const cellWidth = canvasWidth / gridWidth;
  const cellHeight = canvasHeight / gridHeight;
  
  // Check different sized rectangular areas
  for (let startRow = 0; startRow < gridHeight; startRow++) {
    for (let startCol = 0; startCol < gridWidth; startCol++) {
      // Try different rectangle sizes
      for (let endRow = startRow; endRow < Math.min(startRow + 3, gridHeight); endRow++) {
        for (let endCol = startCol; endCol < Math.min(startCol + 4, gridWidth); endCol++) {
          // Skip single cells
          if (startRow === endRow && startCol === endCol) continue;
          
          // Find apples in this rectangle
          const rectApples = apples.filter(apple => {
            const appleRow = Math.floor(apple.y / cellHeight);
            const appleCol = Math.floor(apple.x / cellWidth);
            return appleRow >= startRow && appleRow <= endRow && 
                   appleCol >= startCol && appleCol <= endCol;
          });
          
          // Check if sum equals 10
          const sum = rectApples.reduce((total, apple) => total + apple.number, 0);
          if (sum === 10 && rectApples.length >= 2 && rectApples.length <= 4) {
            // Avoid duplicate combinations
            const isDuplicate = validSets.some(existing => 
              existing.length === rectApples.length && 
              existing.every(apple => rectApples.some(rect => rect.id === apple.id))
            );
            
            if (!isDuplicate) {
              validSets.push(rectApples);
            }
          }
        }
      }
    }
  }
  
  return validSets;
}
