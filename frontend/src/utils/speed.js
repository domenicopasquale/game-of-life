// La velocità base è 1000ms (1x)
const BASE_SPEED = 1000;

export const SPEEDS = {
  SPEED_1X: BASE_SPEED,          // 1000ms
  SPEED_2X: BASE_SPEED / 2,      // 500ms
  SPEED_3X: BASE_SPEED / 3,      // 333ms
  SPEED_4X: BASE_SPEED / 4,      // 250ms
  SPEED_5X: BASE_SPEED / 5,      // 200ms
  SPEED_6X: BASE_SPEED / 6,      // 167ms
  SPEED_7X: BASE_SPEED / 7,      // 143ms
  SPEED_8X: BASE_SPEED / 8,      // 125ms
  SPEED_9X: BASE_SPEED / 9,      // 111ms
  SPEED_10X: BASE_SPEED / 10     // 100ms
};

export const SPEED_VALUES = [
  SPEEDS.SPEED_1X,
  SPEEDS.SPEED_2X,
  SPEEDS.SPEED_3X,
  SPEEDS.SPEED_4X,
  SPEEDS.SPEED_5X,
  SPEEDS.SPEED_6X,
  SPEEDS.SPEED_7X,
  SPEEDS.SPEED_8X,
  SPEEDS.SPEED_9X,
  SPEEDS.SPEED_10X
];

export const formatSpeed = (speed) => {
  const multiplier = Math.round(BASE_SPEED / speed);
  return `${multiplier}x`;
};

export const getSpeedColor = (speed) => {
  const multiplier = BASE_SPEED / speed;
  if (multiplier <= 3) return 'text-red-500';    // 1x-3x
  if (multiplier <= 6) return 'text-green-500';  // 4x-6x
  return 'text-blue-500';                        // 7x-10x
}; 