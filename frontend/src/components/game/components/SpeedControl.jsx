import { BoltIcon } from '@heroicons/react/24/solid';

const getSpeedLabel = (speed) => {
  if (speed >= 900) return 'Very Slow';
  if (speed >= 700) return 'Slow';
  if (speed >= 500) return 'Medium';
  if (speed >= 300) return 'Fast';
  return 'Very Fast';
};

const getSpeedColor = (speed) => {
  if (speed >= 900) return 'text-blue-500';
  if (speed >= 700) return 'text-violet-500';
  if (speed >= 500) return 'text-green-500';
  if (speed >= 300) return 'text-yellow-500';
  return 'text-red-500';
};

export const SpeedControl = ({ speed, onSpeedChange, isDark }) => (
  <div className={`flex items-center gap-2 rounded-lg p-2 border
    ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
  >
    <BoltIcon className={`w-5 h-5 ${getSpeedColor(speed)}`} />
    <input
      type="range"
      min="100"
      max="1000"
      step="50"
      value={1100 - speed}
      onChange={(e) => {
        const newSpeed = 1100 - Number(e.target.value);
        onSpeedChange(newSpeed);
      }}
      className={`w-24 h-2 rounded-lg appearance-none cursor-pointer
        ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-primary-600
        [&::-webkit-slider-thumb]:hover:bg-primary-700
        [&::-webkit-slider-thumb]:transition-colors
        [&::-webkit-slider-thumb]:duration-200`}
      title={`Speed: ${getSpeedLabel(speed)} (${speed}ms)`}
    />
  </div>
);