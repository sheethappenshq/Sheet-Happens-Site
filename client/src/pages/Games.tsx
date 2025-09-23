import { Link } from 'wouter';
import { useRef, useEffect, useState, useCallback } from 'react';

// --- MOCK DATA AND LOCALSTORAGE SETUP FOR STATIC SITE ---
const LOCAL_STORAGE_HIGH_SCORES_KEY = 'snakeHighScores';
const MAX_HIGH_SCORES = 10; // Keep top 10 scores

// Initial mock high scores (if localStorage is empty)
const INITIAL_HIGH_SCORES = [
  { id: '1', playerName: 'Retro Gamer', score: 1250, date: new Date('2024-05-01T10:00:00Z').toISOString() },
  { id: '2', playerName: 'Snake Master', score: 980, date: new Date('2024-04-28T14:30:00Z').toISOString() },
  { id: '3', playerName: 'Pixel Pro', score: 750, date: new Date('2024-04-20T11:00:00Z').toISOString() },
  { id: '4', playerName: 'Admin', score: 620, date: new Date('2024-04-15T09:00:00Z').toISOString() },
  { id: '5', playerName: 'Visitor', score: 450, date: new Date('2024-04-10T16:00:00Z').toISOString() },
  { id: '6', playerName: 'Noob Slayer', score: 320, date: new Date('2024-04-05T12:00:00Z').toISOString() },
  { id: '7', playerName: 'High Score', score: 280, date: new Date('2024-04-01T18:00:00Z').toISOString() },
  { id: '8', playerName: 'Snake Fan', score: 210, date: new Date('2024-03-28T20:00:00Z').toISOString() },
  { id: '9', playerName: 'Player One', score: 150, date: new Date('2024-03-25T15:00:00Z').toISOString() },
  { id: '10', playerName: 'Test User', score: 100, date: new Date('2024-03-20T08:00:00Z').toISOString() },
];

// Helper functions for localStorage high scores
const loadHighScores = (): Array<{ id: string; playerName: string; score: number; date: string }> => {
  const stored = localStorage.getItem(LOCAL_STORAGE_HIGH_SCORES_KEY);
  if (stored) {
    try {
      const scores = JSON.parse(stored);
      return Array.isArray(scores) ? scores : INITIAL_HIGH_SCORES;
    } catch {
      return INITIAL_HIGH_SCORES;
    }
  }
  return INITIAL_HIGH_SCORES;
};

const saveHighScore = (newScore: { playerName: string; score: number }) => {
  const scores = loadHighScores();
  const scoreWithId = {
    ...newScore,
    id: Date.now().toString(), // Simple unique ID
    date: new Date().toISOString(),
  };
  
  // Add new score and sort by score descending
  const updatedScores = [...scores, scoreWithId].sort((a, b) => b.score - a.score);
  
  // Keep only top MAX_HIGH_SCORES
  const topScores = updatedScores.slice(0, MAX_HIGH_SCORES);
  
  localStorage.setItem(LOCAL_STORAGE_HIGH_SCORES_KEY, JSON.stringify(topScores));
  return topScores;
};

export default function Games() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [highScores, setHighScores] = useState(loadHighScores()); // Load initial high scores
  const gameLoopRef = useRef<number>();

  // Game loop useEffect (client-side only, no backend deps)
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
        // Save score to localStorage if valid
        if (score > 0 && playerName.trim()) {
          const updatedScores = saveHighScore({ playerName: playerName.trim(), score });
          setHighScores(updatedScores); // Update the displayed high scores
          alert(`Game Over! Final Score: ${score}. Check the leaderboard!`);
        }
        return;
      }

      // Check self-collision (basic improvement)
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsPlaying(false);
        if (score > 0 && playerName.trim()) {
          const updatedScores = saveHighScore({ playerName: playerName.trim(), score });
          setHighScores(updatedScores);
          alert(`Game Over! You ate yourself! Final Score: ${score}`);
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

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
      // Prevent direction reversal for smoother gameplay
      if (e.key === 'ArrowUp' && direction.y !== 20) direction = { x: 0, y: -20 };
      else if (e.key === 'ArrowDown' && direction.y !== -20) direction = { x: 0, y: 20 };
      else if (e.key === 'ArrowLeft' && direction.x !== 20) direction = { x: -20, y: 0 };
      else if (e.key === 'ArrowRight' && direction.x !== -20) direction = { x: 20, y: 0 };
    }, [direction]);

    window.addEventListener('keydown', handleKeyPress);
    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying]); // Removed score, playerName, saveScoreMutation from deps to prevent re-renders during game

  const startGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name first!');
      return;
    }
    setIsPlaying(true);
    setScore(0);
    // Reset snake position if needed (handled in useEffect)
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
