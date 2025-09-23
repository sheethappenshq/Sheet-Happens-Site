import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';

export default function Admin() {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  const { data: posts } = useQuery({
    queryKey: ['/api/blog'],
    queryFn: async () => {
      const response = await fetch('/api/blog');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    }
  });

  const { data: scores } = useQuery({
    queryKey: ['/api/scores/snake'],
    queryFn: async () => {
      const response = await fetch('/api/scores/snake');
      if (!response.ok) throw new Error('Failed to fetch scores');
      return response.json();
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4 text-center border-b-4 border-accent">
        <h1 className="text-4xl font-bold rainbow-text neon-glow">
          ★★★ TOMSPACE '95 ADMIN ★★★
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
            <div className="px-4 py-2 border-2 bg-secondary text-secondary-foreground border-primary font-bold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground">
              🎮 GAMES
            </div>
          </Link>
          <Link href="/admin">
            <div className="px-4 py-2 border-2 bg-accent text-accent-foreground border-accent font-bold text-sm cursor-pointer neon-glow">
              ⚙️ ADMIN
            </div>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-card border-2 border-card-border p-6 text-center">
          <h2 className="text-2xl font-bold text-accent mb-4">ADMIN CONTROL PANEL</h2>
          <p className="text-muted-foreground">Welcome to the TomSpace '95 Admin Panel!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Site Stats */}
          <div className="bg-card border-2 border-card-border p-6">
            <h3 className="text-xl font-bold text-accent mb-4 text-center">📊 SITE STATISTICS</h3>
            {stats ? (
              <div className="space-y-2 text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.visitorCount}
                </div>
                <div className="text-sm text-muted-foreground">Total Visitors</div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date(stats.lastUpdated).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">Loading stats...</div>
            )}
          </div>

          {/* Blog Stats */}
          <div className="bg-card border-2 border-card-border p-6">
            <h3 className="text-xl font-bold text-accent mb-4 text-center">📝 BLOG STATS</h3>
            {posts ? (
              <div className="space-y-2 text-center">
                <div className="text-2xl font-bold text-primary">
                  {posts.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
                <div className="text-xs text-muted-foreground">
                  Latest: {posts[0] ? new Date(posts[0].createdAt).toLocaleDateString() : 'None'}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">Loading posts...</div>
            )}
          </div>

          {/* Game Stats */}
          <div className="bg-card border-2 border-card-border p-6">
            <h3 className="text-xl font-bold text-accent mb-4 text-center">🎮 GAME STATS</h3>
            {scores ? (
              <div className="space-y-2 text-center">
                <div className="text-2xl font-bold text-primary">
                  {scores.length}
                </div>
                <div className="text-sm text-muted-foreground">Snake Scores</div>
                <div className="text-xs text-muted-foreground">
                  High Score: {scores[0] ? scores[0].score : 0}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">Loading scores...</div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-green-400 text-black border-2 border-black p-6">
          <h3 className="text-xl font-bold text-center mb-4">💻 SYSTEM STATUS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
            <div>
              <div className="font-bold">SERVER</div>
              <div className="text-green-800">● ONLINE</div>
            </div>
            <div>
              <div className="font-bold">DATABASE</div>
              <div className="text-green-800">● CONNECTED</div>
            </div>
            <div>
              <div className="font-bold">GAMES</div>
              <div className="text-green-800">● ACTIVE</div>
            </div>
            <div>
              <div className="font-bold">BLOG</div>
              <div className="text-green-800">● READY</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border-2 border-card-border p-6">
          <h3 className="text-xl font-bold text-accent mb-4 text-center">⚡ QUICK ACTIONS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/blog">
              <div className="bg-primary text-primary-foreground border-2 border-primary p-4 text-center cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent">
                <div className="font-bold">📝</div>
                <div className="text-sm">Manage Blog</div>
              </div>
            </Link>
            <Link href="/games">
              <div className="bg-primary text-primary-foreground border-2 border-primary p-4 text-center cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent">
                <div className="font-bold">🎮</div>
                <div className="text-sm">View Games</div>
              </div>
            </Link>
            <div className="bg-muted text-muted-foreground border-2 border-muted p-4 text-center">
              <div className="font-bold">👥</div>
              <div className="text-sm">User Management</div>
              <div className="text-xs">(Coming Soon)</div>
            </div>
            <div className="bg-muted text-muted-foreground border-2 border-muted p-4 text-center">
              <div className="font-bold">⚙️</div>
              <div className="text-sm">Site Settings</div>
              <div className="text-xs">(Coming Soon)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}