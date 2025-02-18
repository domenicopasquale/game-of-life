import { 
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface GridStatsProps {
  generation: number;
  population: number;
  isDark: boolean;
}

export const GridStats: React.FC<GridStatsProps> = ({ generation, population, isDark }) => (
  <div className="flex items-center gap-4 text-sm">
    <div className={`flex items-center gap-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
      <ClockIcon className="w-4 h-4" />
      <span className="font-medium">{generation}</span>
    </div>
    <div className={`flex items-center gap-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
      <UserGroupIcon className="w-4 h-4" />
      <span className="font-medium">{population}</span>
    </div>
  </div>
); 