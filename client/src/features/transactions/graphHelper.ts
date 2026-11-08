const listOfColors = [
  'rgba(231, 76, 60, 1)' /* Red */,
  'rgba(52, 152, 219, 1)' /* Blue */,
  'rgba(46, 204, 113, 1)' /* Green */,
  'rgba(230, 126, 34, 1)' /* Orange */,
  'rgba(26, 188, 156, 1)' /* Turquoise */,
  'rgba(241, 196, 15, 1)' /* Yellow */,
  'rgba(155, 89, 182, 1)' /* Purple */,
  'rgba(236, 240, 241, 1)' /* Light Gray */,
  'rgba(149, 165, 166, 1)' /* Gray */,
  'rgba(192, 57, 43, 1)' /* Dark Red */,
  'rgba(41, 128, 185, 1)' /* Dark Blue */,
  'rgba(39, 174, 96, 1)' /* Dark Green */,
  'rgba(243, 156, 18, 1)' /* Dark Orange */,
  'rgba(142, 68, 173, 1)' /* Dark Purple */,
  'rgba(22, 160, 133, 1)' /* Dark Turquoise */,
  'rgba(211, 84, 0, 1)' /* Burnt Orange */,
  'rgba(44, 62, 80, 1)' /* Dark Slate */,
  'rgba(127, 140, 141, 1)' /* Medium Gray */,
  'rgba(189, 195, 199, 1)' /* Silver */,
  'rgba(255, 87, 34, 1)' /* Deep Orange */,
];

export const getCategoryColors = (categoryCount: number): string[] =>
  listOfColors.slice(0, categoryCount);
