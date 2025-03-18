import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating = 0,
  maxRating = 5,
  onRate,
  readonly = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (selectedRating: number) => {
    if (!readonly && onRate) {
      onRate(selectedRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;

        return (
          <button
            key={index}
            onClick={() => handleClick(starNumber)}
            disabled={readonly}
            className={`${!readonly && 'hover:scale-110 transition-transform'} 
                       ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
            aria-label={`Rate ${starNumber} stars`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-gray-200 text-gray-200'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}