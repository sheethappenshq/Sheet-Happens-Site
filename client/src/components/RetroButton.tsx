import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'glow' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'data-testid'?: string;
}

export default function RetroButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'default',
  className = "",
  disabled = false,
  type = 'button',
  'data-testid': testId
}: RetroButtonProps) {
  const variantStyles = {
    primary: "bg-secondary text-secondary-foreground border-2 border-t-white border-l-white border-r-gray-500 border-b-gray-500 shadow-sm",
    secondary: "bg-muted text-muted-foreground border-2 border-t-white border-l-white border-r-gray-400 border-b-gray-400 shadow-sm",
    accent: "bg-accent text-accent-foreground border-2 border-t-white border-l-white border-r-yellow-600 border-b-yellow-600 shadow-sm",
    glow: "bg-primary text-primary-foreground border-2 border-t-white border-l-white border-r-purple-600 border-b-purple-600 shadow-sm animate-pulse",
    destructive: "bg-destructive text-destructive-foreground border-2 border-t-white border-l-white border-r-red-600 border-b-red-600 shadow-sm"
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      size={size}
      disabled={disabled}
      data-testid={testId}
      className={cn(
        "font-bold uppercase tracking-wide transition-all duration-100 hover:brightness-110 active:translate-y-[1px] active:shadow-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </Button>
  );
}