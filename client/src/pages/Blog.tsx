import { Link } from 'wouter';
import { useState, useEffect } from 'react';

const LOCAL_STORAGE_BLOG_KEY = 'retro_blog_posts';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '🎉 Welcome to TOMSPACE ’95 Blog!',
    content: 'This is a retro-inspired blog running fully in your browser using localStorage. No backend required!',
    author: 'System',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '🚀 Static Hosting Rocks',
    content: 'GitHub Pages makes it super easy to host static React apps. Everything you see here is client-side!',
    author: 'System',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
  },
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // Load posts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_BLOG_KEY);
    if (stored) {
      try {
        setPosts(JSON.parse(stored));
      } catch {
        setPosts(INITIAL_POSTS);
      }
    } else {
      setPosts(INITIAL_POSTS);
    }
  }, []);

  // Save posts whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_BLOG_KEY, JSON.stringify(posts));
  }, [posts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle.trim() && newPostContent.trim()) {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        author: 'Guest',
        createdAt: new Date().toISOString(),
      };
      setPosts([newPost, ...posts]);
      setNewPostTitle('');
      setNewPostContent('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4 text-center border-b-4 border-accent">
        <h1 className="text-4xl font-bold rainbow-text neon-glow">
          ★★★ TOMSPACE '95 BLOG ★★★
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
            <div className="px-4 py-2 border-2 bg-accent text-accent-foreground border-accent font-bold text-sm cursor-pointer neon-glow">
              📝 BLOG
            </div>
          </Link>
          <Link href="/games">
            <div className="px-4 py-2 border-2 bg-secondary text-secondary-foreground border-primary font-bold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground">
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

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Create New Post */}
        <div className="bg-card border-2 border-card-border p-6">
          <h2 className="text-2xl font-bold text-accent mb-4 text-center">📝 CREATE NEW POST</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-accent mb-2">POST TITLE:</label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full p-2 border-2 border-muted bg-input text-foreground"
                placeholder="Enter your radical post title..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-accent mb-2">POST CONTENT:</label>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-2 border-2 border-muted bg-input text-foreground h-32"
                placeholder="Share your thoughts with the world..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground border-2 border-primary font-bold py-2 px-4 hover:bg-accent hover:text-accent-foreground hover:border-accent"
            >
              PUBLISH POST
            </button>
          </form>
        </div>

        {/* Blog Posts */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-primary neon-glow">BLOG POSTS</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-card border-2 border-card-border p-6">
                <h3 className="text-2xl font-bold text-accent mb-2">{post.title}</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  By {post.author} on{' '}
                  {new Date(post.createdAt).toLocaleDateString()} at{' '}
                  {new Date(post.createdAt).toLocaleTimeString()}
                </div>
                <div className="text-foreground whitespace-pre-wrap">{post.content}</div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="animate-pulse">No blog posts yet...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
