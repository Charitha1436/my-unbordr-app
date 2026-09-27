type Position = 'GK' | 'CB' | 'FB' | 'CM' | 'W' | 'ST';

// Positional weight matrices emphasizing key role duties
const METRIC_WEIGHTS: Record> = {
  ST: { goals: 0.30, shotsOnTarget: 0.20, dribblesCompleted: 0.15, assists: 0.15, duelsWon: 0.10, progressivePasses: 0.10 },
  W:  { dribblesCompleted: 0.25, crosses: 0.20, assists: 0.20, progressivePasses: 0.15, goals: 0.10, foulsWon: 0.10 },
  CM: { passesCompleted: 0.25, progressivePasses: 0.25, recoveries: 0.15, tackles: 0.15, assists: 0.10, duelsWon: 0.10 },
  FB: { tackles: 0.20, progressivePasses: 0.20, crosses: 0.20, recoveries: 0.15, interceptions: 0.15, duelsWon: 0.10 },
  CB: { clearances: 0.25, aerialDuelsWon: 0.25, tackles: 0.20, interceptions: 0.15, passesCompleted: 0.15 },
  GK: { recoveries: 0.40, clearances: 0.30, passesCompleted: 0.30 }
};

// Gaussian Error Function for CDF Percentile conversion
function erfc(x: number): number {
  const a1 =  0.254829592, a2 = -0.284496736, a3 =  1.421413741;
  const a4 = -1.453152027, a5 =  1.061405429, p  =  0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return 0.5 * (1.0 + sign * y);
}

function zScoreToPercentile(z: number): number {
  return Math.round(erfc(-z / Math.sqrt(2)) * 100);
}

export function calculatePlayerRatings(playersWithAppearances: any[]) {
  // 1. Group stats per 90 minutes
  const playerStats = playersWithAppearances.map((player) => {
    const totalMins = player.appearances.reduce((acc: number, app: any) => acc + (app.minutesPlayed || 0), 0);
    const p90Factor = totalMins > 0 ? 90 / totalMins : 0;

    const aggregated: Record = {};
    const metrics = ['goals', 'assists', 'shotsOnTarget', 'passesCompleted', 'progressivePasses', 'dribblesCompleted', 'crosses', 'tackles', 'interceptions', 'recoveries', 'clearances', 'duelsWon', 'aerialDuelsWon'];

    metrics.forEach((m) => {
      const sum = player.appearances.reduce((acc: number, app: any) => acc + (app[m] || 0), 0);
      aggregated[m] = sum * p90Factor;
    });

    return {
      playerId: player.id,
      name: player.name,
      position: (player.position || 'CM') as Position,
      ageGroup: player.ageGroup,
      totalMins,
      aggregated
    };
  });

  // 2. Compute Mean & StdDev per Age Group + Position
  const ageGroups = ['U15', 'U17'];
  const results: Record = {};

  ageGroups.forEach((group) => {
    const groupPlayers = playerStats.filter((p) => p.ageGroup === group);
    
    // Group Z-score calculation
    groupPlayers.forEach((p) => {
      const weights = METRIC_WEIGHTS[p.position] || METRIC_WEIGHTS.CM;
      let compositeZ = 0;

      Object.entries(weights).forEach(([metric, weight]) => {
        const values = groupPlayers.map((gp) => gp.aggregated[metric] || 0);
        const mean = values.reduce((a, b) => a + b, 0) / (values.length || 1);
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length || 1);
        const stdDev = Math.sqrt(variance) || 1;

        const val = p.aggregated[metric] || 0;
        const z = (val - mean) / stdDev;
        compositeZ += z * weight;
      });

      results[p.playerId] = zScoreToPercentile(compositeZ);
    });
  });

  return results;
}