import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PATTERNS } from '../../../data/patterns';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export const PatternSelector = ({ onSelect, isDark, selectedPattern, onPatternSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = useMemo(() => {
    const cats = {};
    Object.entries(PATTERNS).forEach(([key, pattern]) => {
      if (!cats[pattern.category]) {
        cats[pattern.category] = [];
      }
      cats[pattern.category].push({ key, ...pattern });
    });
    return cats;
  }, []);

  return (
    <div className="flex justify-center">
      <div className="relative w-48">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors w-full
            ${isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
          <span className="truncate">
            {selectedPattern ? PATTERNS[selectedPattern].name : 'Select Pattern'}
          </span>
          <ChevronDownIcon 
            className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => {
                  setIsOpen(false);
                  setSelectedCategory(null);
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute mt-1 py-1 rounded-lg shadow-lg z-20
                  ${isDark ? 'bg-gray-700' : 'bg-white'} 
                  border ${isDark ? 'border-gray-600' : 'border-gray-200'}
                  max-h-[300px] overflow-y-auto
                  scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600
                  scrollbar-track-transparent
                  w-56 -left-4
                `}
              >
                {Object.entries(categories).map(([category, patterns]) => (
                  <div key={category}>
                    <button
                      onClick={() => setSelectedCategory(
                        selectedCategory === category ? null : category
                      )}
                      className={`w-full text-left px-3 py-1.5 text-sm font-medium transition-colors
                        ${isDark 
                          ? 'hover:bg-gray-600 text-gray-200' 
                          : 'hover:bg-gray-100 text-gray-800'
                        }
                        flex items-center justify-between
                      `}
                    >
                      <span className="truncate">{category}</span>
                      <ChevronDownIcon 
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200
                          ${selectedCategory === category ? 'rotate-180' : ''}
                        `}
                      />
                    </button>

                    <AnimatePresence>
                      {selectedCategory === category && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          {patterns.map((pattern) => (
                            <button
                              key={pattern.key}
                              onClick={() => {
                                onSelect(pattern.pattern);
                                onPatternSelect(pattern.key);
                                setIsOpen(false);
                                setSelectedCategory(null);
                              }}
                              className={`w-full text-left px-6 py-1.5 text-sm transition-colors truncate
                                ${selectedPattern === pattern.key
                                  ? isDark 
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-primary-100 text-primary-900'
                                  : isDark 
                                    ? 'hover:bg-gray-600 text-gray-300' 
                                    : 'hover:bg-gray-100 text-gray-700'
                                }
                              `}
                            >
                              {pattern.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 