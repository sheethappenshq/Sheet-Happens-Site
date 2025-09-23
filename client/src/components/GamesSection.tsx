import GameCanvas from './GameCanvas';

export default function GamesSection() {
  return (
    <section className="py-12 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-accent text-center mb-8 uppercase tracking-wider">
          🎮 RETRO ARCADE 🎮
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Take a break from studying and play some classic games!
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
          <GameCanvas gameType="snake" />
          <GameCanvas gameType="spaceinvaders" />
        </div>
      </div>
    </section>
  );
}