import { useLocation } from 'react-router-dom';
import Grid from './Grid';
import { useTheme } from '../../contexts/ThemeContext';
import { GameConfig } from '../../types/grid';

const GridWrapper: React.FC = () => {
  const { isDark } = useTheme();
  const location = useLocation();

  return (
    <Grid 
      gameConfig={location.state as GameConfig}
      isDark={isDark}
    />
  );
};

export default GridWrapper; 