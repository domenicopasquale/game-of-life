import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  isDark: boolean;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, isDark }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onZoomOut}
        className={`p-1.5 rounded-lg ${
          isDark 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        title="Zoom out"
      >
        <MagnifyingGlassMinusIcon className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomIn}
        className={`p-1.5 rounded-lg ${
          isDark 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        title="Zoom in"
      >
        <MagnifyingGlassPlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
}; 