import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400; // Fixed visual aspect

type Point = { x: number; y: number };

const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const snakeRef = useRef<Point[]>(INITIAL_SNAKE);
  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const foodRef = useRef<Point>({ x: 15, y: 5 });
  const lastUpdateRef = useRef<number>(0);
  const frameRef = useRef<number>(0);

  const speed = Math.max(40, 150 - score * 3);

  const generateFood = useCallback((snake: Point[]) => {
    let newFood: Point;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIRECTION;
    foodRef.current = generateFood(INITIAL_SNAKE);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    lastUpdateRef.current = performance.now();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
          if (gameOver) resetGame();
          else setIsPaused(p => !p);
          return;
      }

      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (dir.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (dir.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (dir.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (dir.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const gameLoop = (time: number) => {
      if (gameOver || isPaused) {
          draw(ctx);
          frameRef.current = requestAnimationFrame(gameLoop);
          return;
      }

      if (!lastUpdateRef.current) lastUpdateRef.current = time;

      if (time - lastUpdateRef.current > speed) {
        update();
        lastUpdateRef.current = time;
      }
      
      draw(ctx);
      frameRef.current = requestAnimationFrame(gameLoop);
    };

    const update = () => {
      const snake = [...snakeRef.current];
      const head = { ...snake[0] };
      const dir = directionRef.current;

      head.x += dir.x;
      head.y += dir.y;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 10);
        foodRef.current = generateFood(snake);
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
      // Clear background (pitch black)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      const cellSize = CANVAS_SIZE / GRID_SIZE;
      const pixel_padding = 2; // raw gaps between blocks

      // Occasional glitch effect during gameplay
      const isGlitching = Math.random() > 0.93;
      const xOffset = isGlitching ? (Math.random() * 10 - 5) : 0;
      const yOffset = isGlitching ? (Math.random() * 10 - 5) : 0;

      // Background Grid - harsh cyan dots
      ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
      for (let i = 0; i <= CANVAS_SIZE; i += cellSize) {
        for (let j = 0; j <= CANVAS_SIZE; j += cellSize) {
          ctx.fillRect(i, j, 2, 2);
        }
      }

      // Draw Food (Magenta)
      ctx.fillStyle = isGlitching ? '#00ffff' : '#ff00ff';
      ctx.fillRect(
        foodRef.current.x * cellSize + pixel_padding + xOffset,
        foodRef.current.y * cellSize + pixel_padding + yOffset,
        cellSize - pixel_padding * 2,
        cellSize - pixel_padding * 2
      );

      // Draw Snake (Cyan)
      snakeRef.current.forEach((segment, index) => {
        // Head is white, body is cyan, glitched is magenta
        ctx.fillStyle = index === 0 ? '#ffffff' : (isGlitching ? '#ff00ff' : '#00ffff');
        ctx.fillRect(
          segment.x * cellSize + pixel_padding + (index===0?0:xOffset),
          segment.y * cellSize + pixel_padding + (index===0?0:yOffset),
          cellSize - pixel_padding * 2,
          cellSize - pixel_padding * 2
        );
      });
    };

    frameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [speed, gameOver, isPaused, generateFood]);

  return (
    <div className="flex flex-col items-center w-full h-full text-cyan-400 font-mono">
      <div className="w-full mb-6 px-4 py-2 flex justify-between items-center border-2 border-fuchsia-500 bg-fuchsia-900/20 text-xl lg:text-2xl">
        <div className="font-black uppercase animate-pulse">
            SYS.DATA.VOL: {score.toString().padStart(4, '0')}
        </div>
        {isPaused && !gameOver && (
            <div className="text-fuchsia-500 bg-black px-2 py-1 animate-pulse border border-fuchsia-500">[ PAUSED ]</div>
        )}
      </div>
      
      <div className="relative border-4 border-cyan-800 bg-black p-2 w-full max-w-[500px] aspect-square flex items-center justify-center">
        
        <canvas 
          ref={canvasRef} 
          width={CANVAS_SIZE} 
          height={CANVAS_SIZE}
          className={`block w-full h-full object-contain ${gameOver ? 'opacity-30' : ''}`}
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-4 border-[10px] border-double border-red-600 animate-pulse m-2 z-30">
            <h2 className="text-4xl lg:text-5xl font-black text-fuchsia-500 mb-4 uppercase break-words text-glitch" data-text="FATAL_ERR">
              FATAL_ERR
            </h2>
            <div className="bg-red-900 text-white p-3 mb-8 text-lg font-bold border-2 border-red-500">
              OFFSET_VIOLATION AT 0x{score.toString(16).toUpperCase().padStart(4, '0')}
            </div>
            <button 
              onClick={resetGame}
              className="px-8 py-4 bg-fuchsia-600 text-black font-black text-2xl hover:bg-cyan-400 hover:text-black transition-none uppercase shadow-[6px_6px_0_#fff] border-2 border-transparent hover:border-white active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0_#fff]"
            >
              REBOOT_SEQ
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 border-l-4 border-cyan-500 pl-4 w-full text-left text-lg lg:text-xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
          <span className="text-fuchsia-500 bg-black px-2 py-1 border border-fuchsia-500 font-bold tracking-widest shrink-0">W/A/S/D</span>
          <span className="text-cyan-700">:: NAVIGATE_GRID_VECTORS</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
          <span className="text-fuchsia-500 bg-black px-2 py-1 border border-fuchsia-500 font-bold shrink-0">SPACE</span>
          <span className="text-cyan-700">:: HALT_OR_RESUME_PROC</span>
        </div>
      </div>
    </div>
  );
}
