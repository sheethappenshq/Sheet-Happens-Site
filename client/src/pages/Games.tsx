import { Link } from 'wouter';
import { useRef, useEffect, useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

export default function Games() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const gameLoopRef = useRef<number>();
  const queryClient = useQueryClient();

  const { data: highScores } = useQuery({
    queryKey: ['/api/scores/snake'],
    queryFn: async () => {
      const response = await fetch('/api/scores/snake');
      if (!response.ok) throw new Error('Failed to fetch scores');
      return response.json();
    }
  });

  const saveScoreMutation = useMutation({
    mutationFn: async (scoreData: { playerName: string; score: number; game: string }) => {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData),
      });
      if (!response.ok) throw new Error('Failed to save score');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scores/snake'] });
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple Snake Game
    let snake = [{ x: 200, y: 150 }];
    let direction = { x: 20, y: 0 };
    let food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 15) * 20 };

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 300);

      // Move snake
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
      
      // Check wall collision
      if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 300) {
        setIsPlaying(false);
        if (score > 0 && playerName.trim()) {
          saveScoreMutation.mutate({ playerName: playerName.trim(), score, game: 'snake' });
        }
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
  }, [isPlaying, score, playerName, saveScoreMutation]);

  const startGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name first!');
      return;
    }
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4 text-center border-b-4 border-accent">
        <h1 className="text-4xl font-bold rainbow-text neon-glow">
          ★★★ TOMSPACE '95 GAMES ★★★
        </h1>
      </div>

      {/* Navigation */}
      <nav className="bg-muted border-b-2 border-accent p-2">
        <div className="max-w-6xl mx-auto flex justify-center space-x-4">
          <Link href="/">
            <div className="px-4 py-2 border-2 bg-secondary text-secondary-foreground border-primary font-bold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground">
              🏠 HOME
            </div>
          </Link>
          <Link href="/blog">
            <div className="px-4 py-2 border-2 bg-secondary text-secondary-foreground border-primary font-bold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground">
              📝 BLOG
            </div>
          </Link>
          <Link href="/games">
            <div className="px-4 py-2 border-2 bg-accent text-accent-foreground border-accent font-bold text-sm cursor-pointer neon-glow">
              🎮 GAMES
            </div>
          </Link>
          <Link href="/admin">
            <div className="px-4 py-2 border-2 bg-secondary text-secondary-foreground border-primary font-bold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground">
              ⚙️ ADMIN
            </div>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Section */}
          <div className="bg-card border-2 border-card-border p-6">
            <h2 className="text-2xl font-bold text-accent text-center mb-4">🐍 SNAKE GAME</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-accent mb-2">PLAYER NAME:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-2 border-2 border-muted bg-input text-foreground"
                placeholder="Enter your name..."
                disabled={isPlaying}
              />
            </div>

            <div className="text-center mb-4">
              <div className="text-accent font-bold mb-2">SCORE: {score}</div>
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="border-4 border-accent bg-black mx-auto"
              />
            </div>
            
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={startGame}
                disabled={isPlaying}
                className="bg-primary text-primary-foreground border-2 border-primary font-bold py-2 px-4 hover:bg-accent hover:text-accent-foreground hover:border-accent disabled:opacity-50"
              >
                START GAME
              </button>
              <button
                onClick={stopGame}
                disabled={!isPlaying}
                className="bg-destructive text-destructive-foreground border-2 border-destructive font-bold py-2 px-4 hover:bg-accent hover:text-accent-foreground hover:border-accent disabled:opacity-50"
              >
                STOP GAME
              </button>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              Use arrow keys to control the snake. Eat the red food to grow and score points!
            </div>
          </div>

          {/* High Scores */}
          <div className="bg-card border-2 border-card-border p-6">
            <h2 className="text-2xl font-bold text-accent text-center mb-4">🏆 HIGH SCORES</h2>
            {highScores && highScores.length > 0 ? (
              <div className="space-y-2">
                {highScores.map((score: any, index: number) => (
                  <div key={score.id} className={`flex justify-between items-center p-2 border ${index === 0 ? 'border-accent bg-accent/20' : 'border-muted'}`}>
                    <span className="font-bold">#{index + 1}</span>
                    <span>{score.playerName}</span>
                    <span className="font-bold">{score.score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No high scores yet! Be the first to play!
              </div>
            )}
          </div>
        </div>

        {/* Additional Games Section */}
        <div className="mt-8 bg-yellow-300 text-black border-2 border-black p-6 text-center">
          <h3 className="text-xl font-bold mb-2">🚧 MORE GAMES COMING SOON! 🚧</h3>
          <p className="text-sm">We're working on adding more rad games like Tetris, Pong, and Space Invaders!</p>
        </div>
      </div>
    </div>
  );
}