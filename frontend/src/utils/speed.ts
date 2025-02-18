// Speed constants in milliseconds
export const SPEEDS = {
  SPEED_1X: 1000,
  SPEED_2X: 500,
  SPEED_3X: 333,
  SPEED_4X: 250,
  SPEED_5X: 200,
  SPEED_6X: 167,
  SPEED_7X: 143,
  SPEED_8X: 125,
  SPEED_9X: 111,
  SPEED_10X: 100
} as const;

// Available speed values for the game
export const SPEED_VALUES = [1000, 500, 333, 250, 200, 167, 143, 125, 111, 100] as const;

// Type for speed values
export type SpeedValue = typeof SPEED_VALUES[number];

// Format speed value to display string (e.g., "2x")
export const formatSpeed = (speed: number): string => {
  const speedEntry = Object.entries(SPEEDS).find(([_, value]) => value === speed);
  if (!speedEntry) return 'Unknown';
  return speedEntry[0].replace('SPEED_', '').replace('X', 'x');
};

// Get color based on speed value for visual feedback
export const getSpeedColor = (speed: number): string => {
  const index = SPEED_VALUES.indexOf(speed as SpeedValue);
  if (index < 3) return 'text-green-500';  // Slower speeds
  if (index < 6) return 'text-yellow-500'; // Medium speeds
  return 'text-red-500';                   // Faster speeds
}; 