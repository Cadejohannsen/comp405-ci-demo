import { getDealScoreColor, getDealScoreText } from "@/lib/deal-scoring";

interface DealScoreProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export default function DealScore({ 
  score, 
  size = 'medium', 
  showText = true,
  className = "" 
}: DealScoreProps) {
  const color = getDealScoreColor(score);
  const text = getDealScoreText(score);
  
  const sizeClasses = {
    small: {
      container: 'w-8 h-8 text-xs',
      circle: 'w-6 h-6',
      text: 'text-xs'
    },
    medium: {
      container: 'w-12 h-12 text-sm',
      circle: 'w-10 h-10',
      text: 'text-sm'
    },
    large: {
      container: 'w-16 h-16 text-base',
      circle: 'w-14 h-14',
      text: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={currentSize.container}>
        <div 
          className={`${currentSize.circle} rounded-full border-2 flex items-center justify-center font-bold transition-colors`}
          style={{ 
            borderColor: color,
            color: color,
            backgroundColor: `${color}10`
          }}
        >
          {score}
        </div>
      </div>
      {showText && (
        <div>
          <div 
            className={`font-medium uppercase tracking-wider ${currentSize.text}`}
            style={{ color }}
          >
            {text}
          </div>
          <div className="text-xs text-muted-foreground">
            {score}% deal score
          </div>
        </div>
      )}
    </div>
  );
}
