export const PATTERNS: { [key: string]: boolean[][] } = {
  'Glider': [
    [false, true, false],
    [false, false, true],
    [true, true, true]
  ],
  'Blinker': [
    [true, true, true]
  ],
  'Block': [
    [true, true],
    [true, true]
  ],
  'Beehive': [
    [false, true, true, false],
    [true, false, false, true],
    [false, true, true, false]
  ],
  'Loaf': [
    [false, true, true, false],
    [true, false, false, true],
    [false, true, false, true],
    [false, false, true, false]
  ],
  'Boat': [
    [true, true, false],
    [true, false, true],
    [false, true, false]
  ]
}; 