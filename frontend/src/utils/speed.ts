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

export const SPEED_VALUES = [1000, 500, 333, 250, 200, 167, 143, 125, 111, 100] as const;
export type SpeedValue = typeof SPEED_VALUES[number];

export const formatSpeed = (speed: number): string => {
  const speedEntry = Object.entries(SPEEDS).find(([_, value]) => value === speed);
  if (!speedEntry) return 'Unknown';
  return speedEntry[0].replace('SPEED_', '').replace('X', 'x');
};

export const getSpeedColor = (speed: number): string => {
  const index = SPEED_VALUES.indexOf(speed as SpeedValue);
  if (index < 3) return 'text-green-500';
  if (index < 6) return 'text-yellow-500';
  return 'text-red-500';
}; 