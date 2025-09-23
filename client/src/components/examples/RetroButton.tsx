import RetroButton from '../RetroButton';

export default function RetroButtonExample() {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-background">
      <RetroButton variant="primary" onClick={() => console.log('Primary clicked')}>
        BUY NOW
      </RetroButton>
      <RetroButton variant="secondary" onClick={() => console.log('Secondary clicked')}>
        GAMES
      </RetroButton>
      <RetroButton variant="accent" onClick={() => console.log('Accent clicked')}>
        CONTACT
      </RetroButton>
      <RetroButton variant="glow" onClick={() => console.log('Glow clicked')}>
        SPECIAL OFFER
      </RetroButton>
    </div>
  );
}