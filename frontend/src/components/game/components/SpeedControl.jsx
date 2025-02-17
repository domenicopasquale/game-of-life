import { SPEEDS, formatSpeed, getSpeedColor, SPEED_VALUES } from '../../../utils/speed';
import { BoltIcon } from '@heroicons/react/24/solid';

export const SpeedControl = ({ speed, onSpeedChange, isDark }) => {
  return (
    <div>
      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        Speed: {formatSpeed(speed)}
      </label>
      <div className={`flex items-center gap-2 mt-1 p-2 rounded-lg border
        ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
      >
        <BoltIcon className={`w-5 h-5 ${getSpeedColor(speed)}`} />
        <input
          type="range"
          min="0"
          max="9"
          value={SPEED_VALUES.indexOf(speed)}
          onChange={(e) => onSpeedChange(SPEED_VALUES[e.target.value])}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer
            ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary-600
            [&::-webkit-slider-thumb]:hover:bg-primary-700`}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>1x</span>
        <span>5x</span>
        <span>10x</span>
      </div>
    </div>
  );
};