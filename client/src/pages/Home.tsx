import { Link } from 'wouter';
// Removed useQuery as it relies on a backend API
import { useState, useEffect } from 'react';

// --- MOCK DATA FOR STATIC SITE ---
const MOCK_BLOG_POSTS = [
  {
    id: '1',
    title: 'Welcome to Sheet Happens!',
    author: 'Admin',
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    content: 'Hello everyone! This is the very first post on Sheet Happens. We are excited to bring you the best emergency study sheets and a blast from the past with our retro website. Stay tuned for more updates and new cheat sheets!',
  },
  {
    id: '2',
    title: 'New Math Cheat Sheet Released!',
    author: 'Admin',
    createdAt: new Date('2024-02-20T14:30:00Z').toISOString(),
    content: 'Just dropped a brand new Math Emergency Kit! It covers Algebra, Calculus, and Geometry. Perfect for those last-minute study sessions. Check it out in the Study Sheets section!',
  },
  {
    id: '3',
    title: 'Snake Game High Score Challenge!',
    author: 'Admin',
    createdAt: new Date('2024-03-05T11:00:00Z').toISOString(),
    content: 'Think you\'re a Snake master? Head over to the Games section and try to beat the high score! Submit your name and score to see if you can make it to the top of the leaderboard!',
  },
  {
    id: '4',
    title: 'Physics Formulas Reference Sheet Now Available!',
    author: 'Admin',
    createdAt: new Date('2024-04-10T09:00:00Z').toISOString(),
    content: 'Struggling with Physics? Our new Physics Formula Arsenal is here to save the day! Covers Newton\'s laws, electromagnetics, and thermodynamics. Get yours now!',
  },
  {
    id: '5',
    title: 'Website Updates and Bug Fixes',
    author: 'Admin',
    createdAt: new Date('2024-05-01T16:00:00Z').toISOString(),
    content: 'We\'ve been working hard behind the scenes to improve your experience. Expect smoother navigation and even more retro goodness! Report any bugs to our contact email.',
  },
];

// Sort posts by creation date, newest first
MOCK_BLOG_POSTS.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const LOCAL_STORAGE_VISITOR_KEY = 'sheetHappensVisitorCount';

export default function Home() {
  const [visitorCount, setVisitorCount] = useState(0); // Initialize to 0, will load from localStorage

  // Use mock posts directly
  const posts = MOCK_BLOG_POSTS;

  useEffect(() => {
    // Load visitor count from localStorage or initialize
    let currentCount = parseInt(localStorage.getItem(LOCAL_STORAGE_VISITOR_KEY) || '0', 10);
    if (isNaN(currentCount) || currentCount < 0) {
      currentCount = 0; // Ensure it's a valid number
    }
    
    // Increment for this visit
    currentCount += 1;
    localStorage.setItem(LOCAL_STORAGE_VISITOR_KEY, currentCount.toString());
    setVisitorCount(currentCount);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 text-center border-b-4 border-accent">
        <h1 className="text-4xl font-bold">
          Welcome to the Official Website of Sheet Happens!
        </h1>
        <div className="text-sm mt-2 text-accent rainbow-text">
          <span className="blnk">✩</span> Look this bit is glowing <span className="blnk">✩</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-muted border-b-2 border-accent p-2">
        <div className="max-w-6xl mx-auto flex justify-center space-x-4">
          <Link href="/">
            <div className="px-4 py-2 border-2 bg-secondary text-secondary-foreground border-primary font-bold text-lg cursor-pointer hover:bg-primary hover:text-primary-foreground">
              🏠 HOME
            </div>
          </Link>
          <Link href="/admin"> {/* Changed to /admin as per your original code, assuming it's for "Study Sheets" now */}
            <div className="px-4 py-2 border-2 bg-secondary text-secondary-foreground border-primary font-bold text-lg cursor-pointer hover:bg-primary hover:text-primary-foreground">
              📃 STUDY SHEETS
            </div>
          </Link>
          <Link href="/games">
            <div className="px-4 py-2 border-2 bg-secondary text-secondary-foreground border-primary font-bold text-lg cursor-pointer hover:bg-primary hover:text-primary-foreground">
              🎮 GAMES
            </div>
          </Link>
        </div>
      </nav>

      {/* News Ticker */}
      <div className="bg-black text-green-400 py-1 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee text-s font-mono">
             BREAKING NEWS: This is where you can find last minute cheat sheets, send me an email or have a look around and maybe play some games! 
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-140%);
            }
          }

          .animate-marquee {
            animation: marquee 25s linear infinite;
            white-space: nowrap;
          }
        `}</style>
      </div>
      
      <div className="flex max-w-6xl mx-auto p-4 gap-4">
        {/* Sidebar */}
        <aside className="w-64 space-y-4">
          {/* Visitor Counter */}
          <div className="bg-black text-green-400 font-mono text-center p-3 border-2 border-accent neon-glow">
            <div className="text-green-300 text-xs mb-1 font-bold">VISITORS:</div>
            <div className="text-2xl font-bold">
              {visitorCount.toString().padStart(6, '0')}
            </div>
            <div className="text-xs mt-1 text-green-500">
              <span className="animate-pulse">●</span> ONLINE NOW
            </div>
          </div>
          
          {/* Under Construction */}
          <div className="bg-yellow-300 text-black p-3 border-2 border-black text-center">
            <div className="font-bold text-sm mb-2">🚧 UNDER CONSTRUCTION 🚧</div>
            <div className="text-xs">I'm working on some more games that I should be able to release soon, so maybe check back sometime :D</div>
          </div>
          
          {/* Cool Links */}
          <div className="bg-muted border-2 border-accent p-3">
            <h3 className="font-bold text-accent text-center mb-2">CONTACT ME</h3>
            <ul className="text-xs space-y-1">
              <li><a href="mailto:sheethappenshq@gmail.com" className="text-blue-400 hover:text-blue-300">• SheetHappensHQ@gmail.com</a></li>
              <li><a href="https://discordapp.com/users/1419692310853324953" className="text-blue-400 hover:text-blue-300">• SheetHappens_93416 (Discord)</a></li>
              <li><a href="https://www.tiktok.com/@sheethappenshq" className="text-blue-400 hover:text-blue-300">• SheetHappensHQ (Tiktok)</a></li>
              <li><a href="#" className="text-blue-400 hover:text-blue-300"></a></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          <div className="bg-card border-2 border-card-border p-6">
            <h1 className="text-3xl font-bold text-primary text-center mb-4">
              Hi! Welcome To My Website!
            </h1>
            <p className="text-left text-muted-foreground mb-4">
              <span className="block text-2xl font-bold mb-0 mt-4">Q&A SECTION</span>

              <span className="block font-bold mb-0 mt-4">Is this one of those generic boring Wix.com websites with the dodgy watermark everywhere?</span>
              I’ll be honest with you, I really didn't want to make one of those generic free WordPress websites where someone tries to sell you a product that costs 15 times what it should cause they annoy me. This website was a hobby of mine long before Sheet Happens even existed, and for that reason, I’ve kept the games page open as a relic from before I started trying to integrate this second hobby into it :D 
              <br />

              <span className="block font-bold mb-0 mt-4">Is this one of those cringy corporate Q&A sections where they try and sell themselves or their product 147 different ways??</span>
              NO and flip u for asking (I'm kidding but also this is not one of those Q&A sections I promise, (also why do they always have like 4000 emojis it’s so bad)) 
              <br />

              <span className="block font-bold mb-0 mt-4">Why the flop would I even spend money on u I don't even know u?</span>
              Well if you're even a little bit like me, you also didn’t study until it’s the night before your exam (and maybe even why you’re on my website right now…). I know the feeling, trust me, that's the only reason I started making these in the first place, by trying to fit as much as I could into a piece of paper and read it on the way to school, or even my phone in particularly dire times. Prelims are stressful enough, let alone trying to learn the entire syllabus the night before an exam so I found these helped a lot. I promise I'm not sponsoring myself, it feels a bit better to know that if I remember what's on the sheet I'll do okay in the exam. 
              <br />

              <span className="block font-bold mb-0 mt-4">Why charge money you greedy corporate scum!!!</span>
              To be honest the main reason I’m charging anything at all is to try and save enough to break even on hosting this website (fees pmo😭) and to maybe give these out for free if I can afford to in the future cuz i know thats something i would have enjoyed, i promise there is no malicious corporate greed behind my pricing cough cough studoku coughcough. All the study sheets I made were created using all syllabus dot points and as much exam tips as i can possibly fit onto a piece of paper (I know this because i use them myself and im paranoid about missing bits of the syllabus incase its the 25 marker question.......). 
              <br />

              <span className="block font-bold mb-0 mt-4">
                Why should I pay you at all for this??? :0
              </span>
              You might be wondering, “uh but cant i just use ai to do it for me and it wont cost a cent???” Well, yes, but also no, trust me I tried that too. AI literally is not capable of effectively making these, I would know as it was the first thing I turned to after finding nothing online for last minute study sheets (that didn’t require uploading like 12 study documents and waiting hours for approval or spending like 15 bucks ts is crazy work), but the crappola it spat out was so awful I literally gave up and just decided to do it myself.
              <div className="mb-4" /> {/* Add margin here for spacing */}
              (While certain friends and family with dollar signs lighting up in their eyes said to charge far more for these, at the end of the day they’re really just something that can save you some stress and a couple of hours before an exam, and to be fair I genuinely wouldn't pay more than 2 to 5 bucks for one of these anyway, no matter how much of a pinch im in (thats how these even came to exist…) so i dont see any point in charging any more than I would pay.) 
              <br />

              <span className="block font-bold mb-0 mt-4">Final Notes (DISCOUNT ALERT)!!!!</span>
              The first thing I'd recommend if you don't want to spend any money is to get a particularly generous friend to buy whatever you need or could both use and then just send a copy of it to you as well (I don't mind losing $2, I know I know, so generous). If you really really are in some trouble before your exam and you don’t wanna pay a cent (or you have no friends), I honestly understand, send me an email! I’ll see if there's anything I can do to help or just make sure you pass that exam, cause I know that feeling all too well.
            </p>
          </div>

          {/* Latest Blog Posts */}
          <div className="bg-card border-2 border-card-border p-6">
            <h2 className="text-2xl font-bold text-accent mb-4 text-center">📰 LATEST NEWS AND UPDATES</h2>
            {posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.slice(0, 3).map((post: any) => (
                  <div key={post.id} className="bg-muted border border-accent p-4">
                    <h3 className="font-bold text-primary mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm">{post.content.substring(0, 200)}...</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="animate-pulse">Loading the latest updates...</div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-green-400 text-black border-2 border-black p-4">
            <h2 className="font-bold text-center mb-3">🟢 WHAT'S COOL HERE:</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>• Interactive Blog System</div>
              <div>• Retro Snake Game</div>
              <div>• Live Visitor Counter</div>
              <div>• Admin Panel</div>
              <div>• Animated Graphics</div>
              <div>• 90s Nostalgia</div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-6 px-4 border-t-2 border-accent text-center">
        <p className="text-sm text-muted-foreground">
          TomSpace '95 © 1995 | Best viewed in Netscape Navigator
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="animate-pulse text-green-400">● ONLINE</span> | 
          This page has been visited <span className="font-bold">{visitorCount}</span> times
        </div>
      </footer>
    </div>
  );
}
