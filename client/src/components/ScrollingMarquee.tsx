import { useEffect, useState } from 'react';

interface ScrollingMarqueeProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function ScrollingMarquee({ text, speed = 50, className = "" }: ScrollingMarqueeProps) {
  const [position, setPosition] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => prev <= -100 ? 100 : prev - 0.5);
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className={`overflow-hidden bg-primary text-primary-foreground py-2 ${className}`}>
      <div 
        className="whitespace-nowrap text-sm font-bold tracking-wider uppercase"
        style={{ transform: `translateX(${position}%)` }}
      >
        {text}
      </div>
    </div>
  );
}