import { useState } from 'react';
import { PatternSelectorProps } from '../../../types/components';
import { PATTERNS } from '../../../constants/patterns';

export const PatternSelector: React.FC<PatternSelectorProps> = ({ 
  onSelect, 
  isDark, 
  selectedPattern,
  onPatternSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePatternSelect = (patternName: string) => {
    const pattern = PATTERNS[patternName];
    if (pattern) {
      onSelect(pattern);
      onPatternSelect(patternName);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 text-left rounded-lg border ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700' 
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {selectedPattern || 'Select a pattern'}
      </button>

      {isOpen && (
        <div className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg ${
          isDark 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-300'
        }`}>
          {Object.keys(PATTERNS).map((patternName) => (
            <button
              key={patternName}
              onClick={() => handlePatternSelect(patternName)}
              className={`w-full px-4 py-2 text-left first:rounded-t-lg last:rounded-b-lg ${
                isDark 
                  ? 'text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              } ${selectedPattern === patternName ? 'bg-primary-50 text-primary-700' : ''}`}
            >
              {patternName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 