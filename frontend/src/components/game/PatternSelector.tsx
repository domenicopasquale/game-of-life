import { useState } from 'react';
import { PatternSelectorProps } from '../../types/components';
import { PATTERNS } from '../../constants/patterns';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export const PatternSelector: React.FC<PatternSelectorProps> = ({ 
  onSelect, 
  isDark, 
  selectedPattern,
  onPatternSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm
          ${isDark 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }
        `}
      >
        <span className="max-w-[100px] truncate">
          {selectedPattern || 'Patterns'}
        </span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div 
          className={`
            absolute top-full left-0 mt-1 py-1 rounded-lg shadow-lg z-50
            max-h-60 overflow-y-auto w-48
            ${isDark ? 'bg-gray-800' : 'bg-white'}
          `}
        >
          {Object.entries(PATTERNS).map(([patternName, pattern]) => (
            <button
              key={patternName}
              onClick={() => {
                onSelect(pattern);
                onPatternSelect(patternName);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-2 text-left text-sm
                ${isDark 
                  ? 'text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
                ${selectedPattern === patternName 
                  ? 'bg-primary-50 text-primary-700' 
                  : ''
                }
              `}
            >
              {patternName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 