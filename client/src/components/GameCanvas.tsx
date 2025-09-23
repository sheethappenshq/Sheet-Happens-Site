import { useEffect, useRef, useState } from 'react';
import RetroButton from './RetroButton';

interface GameCanvasProps {
  gameType: 'snake' | 'spaceinvaders';
  width?: number;
  height?: number;
}

export default function GameCanvas({ gameType, width = 400, height = 300 }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple Snake Game Implementation
    if (gameType === 'snake' && isPlaying) {
      let snake = [{ x: 200, y: 150 }];
      let direction = { x: 20, y: 0 };
      let food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 15) * 20 };

      const gameLoop = () => {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // Move snake
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        
        // Check wall collision
        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
          setIsPlaying(false);
          return;
        }

        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 10);
          food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 15) * 20 };
        } else {
          snake.pop();
        }

        // Draw snake
        ctx.fillStyle = '#0f0';
        snake.forEach(segment => {
          ctx.fillRect(segment.x, segment.y, 18, 18);
        });

        // Draw food
        ctx.fillStyle = '#f00';
        ctx.fillRect(food.x, food.y, 18, 18);

        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };

      const handleKeyPress = (e: KeyboardEvent) => {
        switch(e.key) {
          case 'ArrowUp': direction = { x: 0, y: -20 }; break;
          case 'ArrowDown': direction = { x: 0, y: 20 }; break;
          case 'ArrowLeft': direction = { x: -20, y: 0 }; break;
          case 'ArrowRight': direction = { x: 20, y: 0 }; break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      gameLoop();

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    }

    // Simple Space Invaders Implementation
    if (gameType === 'spaceinvaders' && isPlaying) {
      let player = { x: width / 2, y: height - 30, width: 30, height: 20 };
      let bullets: Array<{ x: number; y: number }> = [];
      let enemies: Array<{ x: number; y: number; width: number; height: number }> = [];
      
      // Create enemies
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 3; j++) {
          enemies.push({ x: i * 40 + 50, y: j * 30 + 50, width: 25, height: 20 });
        }
      }

      const gameLoop = () => {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // Draw player
        ctx.fillStyle = '#0f0';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Update bullets
        bullets = bullets.filter(bullet => {
          bullet.y -= 5;
          ctx.fillStyle = '#ff0';
          ctx.fillRect(bullet.x, bullet.y, 3, 10);
          return bullet.y > 0;
        });

        // Draw enemies
        ctx.fillStyle = '#f0f';
        enemies.forEach(enemy => {
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });

        // Check collisions
        bullets.forEach((bullet, bulletIndex) => {
          enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + 3 > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + 10 > enemy.y) {
              bullets.splice(bulletIndex, 1);
              enemies.splice(enemyIndex, 1);
              setScore(prev => prev + 100);
            }
          });
        });

        if (enemies.length === 0) {
          setIsPlaying(false);
          alert('You Win!');
          return;
        }

        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };

      const handleKeyPress = (e: KeyboardEvent) => {
        switch(e.key) {
          case 'ArrowLeft': 
            if (player.x > 0) player.x -= 10; 
            break;
          case 'ArrowRight': 
            if (player.x < width - player.width) player.x += 10; 
            break;
          case ' ': 
            bullets.push({ x: player.x + player.width / 2, y: player.y });
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      gameLoop();

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    }
  }, [gameType, isPlaying, width, height]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-primary uppercase mb-2">
          {gameType === 'snake' ? '🐍 SNAKE' : '👾 SPACE INVADERS'}
        </h3>
        <p className="text-accent font-bold" data-testid="text-score">SCORE: {score}</p>
      </div>
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-4 border-accent bg-black"
        data-testid={`canvas-${gameType}`}
      />
      
      <div className="flex space-x-4">
        <RetroButton
          variant="accent"
          onClick={startGame}
          disabled={isPlaying}
          data-testid={`button-start-${gameType}`}
        >
          START
        </RetroButton>
        <RetroButton
          variant="destructive"
          onClick={stopGame}
          disabled={!isPlaying}
          data-testid={`button-stop-${gameType}`}
        >
          STOP
        </RetroButton>
      </div>
      
      {gameType === 'snake' && (
        <p className="text-xs text-muted-foreground text-center">
          Use arrow keys to control the snake
        </p>
      )}
      {gameType === 'spaceinvaders' && (
        <p className="text-xs text-muted-foreground text-center">
          Arrow keys to move, SPACE to shoot
        </p>
      )}
    </div>
  );
}