export interface PlayerPerformanceData {
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards?: number;
  redCards?: number;
}

export function calculatePlayerRating(data: PlayerPerformanceData): number {
  const baseRating = 6.0;

  // Minutes contribution (up to 90 mins = +1.5)
  const minutesFactor = Math.min(data.minutesPlayed / 90, 1) * 1.5;

  // Goals contribution (+1.0 per goal)
  const goalsFactor = (data.goals || 0) * 1.0;

  // Assists contribution (+0.6 per assist)
  const assistsFactor = (data.assists || 0) * 0.6;

  // Disciplinary deductions (-0.3 per yellow, -1.5 per red)
  const yellowDeduction = (data.yellowCards || 0) * 0.3;
  const redDeduction = (data.redCards || 0) * 1.5;

  const rawRating = baseRating + minutesFactor + goalsFactor + assistsFactor - yellowDeduction - redDeduction;

  // Clamp rating between 1.0 and 10.0
  return Math.min(Math.max(parseFloat(rawRating.toFixed(1)), 1.0), 10.0);
}