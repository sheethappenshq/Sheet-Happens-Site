import GameCanvas from '../GameCanvas';

export default function GameCanvasExample() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 bg-background">
      <GameCanvas gameType="snake" />
      <GameCanvas gameType="spaceinvaders" />
    </div>
  );
}