import { WHOGrowthStandardCalculation } from '../types';

// Simplified WHO / Kemenkes Anthro reference tables for median and approximate SD (standard deviation)
// Based on WHO Child Growth Standards (0-5 years) & WHO Reference 2007 (5-10 years)
interface GrowthRefPoint {
  ageMonths: number;
  // Boys
  boyMedianHeight: number;
  boyHeightSD: number;
  boyMedianWeight: number;
  boyWeightSD: number;
  // Girls
  girlMedianHeight: number;
  girlHeightSD: number;
  girlMedianWeight: number;
  girlWeightSD: number;
}

const WHO_GROWTH_REFS: GrowthRefPoint[] = [
  { ageMonths: 0, boyMedianHeight: 49.9, boyHeightSD: 1.9, boyMedianWeight: 3.3, boyWeightSD: 0.45, girlMedianHeight: 49.1, girlHeightSD: 1.9, girlMedianWeight: 3.2, girlWeightSD: 0.43 },
  { ageMonths: 6, boyMedianHeight: 67.6, boyHeightSD: 2.3, boyMedianWeight: 7.9, boyWeightSD: 0.85, girlMedianHeight: 65.7, girlHeightSD: 2.3, girlMedianWeight: 7.3, girlWeightSD: 0.8 },
  { ageMonths: 12, boyMedianHeight: 75.7, boyHeightSD: 2.6, boyMedianWeight: 9.6, boyWeightSD: 1.0, girlMedianHeight: 74.0, girlHeightSD: 2.6, girlMedianWeight: 8.9, girlWeightSD: 0.95 },
  { ageMonths: 18, boyMedianHeight: 82.3, boyHeightSD: 2.9, boyMedianWeight: 10.9, boyWeightSD: 1.15, girlMedianHeight: 80.7, girlHeightSD: 2.9, girlMedianWeight: 10.2, girlWeightSD: 1.1 },
  { ageMonths: 24, boyMedianHeight: 87.8, boyHeightSD: 3.2, boyMedianWeight: 12.2, boyWeightSD: 1.3, girlMedianHeight: 86.4, girlHeightSD: 3.2, girlMedianWeight: 11.5, girlWeightSD: 1.25 },
  { ageMonths: 36, boyMedianHeight: 96.1, boyHeightSD: 3.6, boyMedianWeight: 14.3, boyWeightSD: 1.6, girlMedianHeight: 95.1, girlHeightSD: 3.6, girlMedianWeight: 13.9, girlWeightSD: 1.6 },
  { ageMonths: 48, boyMedianHeight: 103.3, boyHeightSD: 4.1, boyMedianWeight: 16.3, boyWeightSD: 2.0, girlMedianHeight: 102.7, girlHeightSD: 4.1, girlMedianWeight: 16.1, girlWeightSD: 2.0 },
  { ageMonths: 60, boyMedianHeight: 110.0, boyHeightSD: 4.5, boyMedianWeight: 18.3, boyWeightSD: 2.4, girlMedianHeight: 109.4, girlHeightSD: 4.5, girlMedianWeight: 18.2, girlWeightSD: 2.4 },
  { ageMonths: 72, boyMedianHeight: 116.0, boyHeightSD: 5.0, boyMedianWeight: 20.5, boyWeightSD: 2.9, girlMedianHeight: 115.1, girlHeightSD: 5.0, girlMedianWeight: 20.2, girlWeightSD: 2.9 },
  { ageMonths: 84, boyMedianHeight: 121.7, boyHeightSD: 5.4, boyMedianWeight: 22.9, boyWeightSD: 3.5, girlMedianHeight: 120.6, girlHeightSD: 5.4, girlMedianWeight: 22.4, girlWeightSD: 3.5 },
  { ageMonths: 96, boyMedianHeight: 127.3, boyHeightSD: 5.9, boyMedianWeight: 25.6, boyWeightSD: 4.2, girlMedianHeight: 126.4, girlHeightSD: 5.9, girlMedianWeight: 25.0, girlWeightSD: 4.2 },
  { ageMonths: 108, boyMedianHeight: 132.6, boyHeightSD: 6.3, boyMedianWeight: 28.6, boyWeightSD: 5.0, girlMedianHeight: 132.2, girlHeightSD: 6.3, girlMedianWeight: 28.2, girlWeightSD: 5.0 },
  { ageMonths: 120, boyMedianHeight: 137.8, boyHeightSD: 6.8, boyMedianWeight: 31.9, boyWeightSD: 6.0, girlMedianHeight: 138.3, girlHeightSD: 6.8, girlMedianWeight: 31.9, girlWeightSD: 6.0 },
];

// Linear interpolation between age milestones
function getInterpolatedNorm(ageMonths: number, gender: 'male' | 'female') {
  const clampedAge = Math.max(0, Math.min(120, ageMonths));
  let lower = WHO_GROWTH_REFS[0];
  let upper = WHO_GROWTH_REFS[WHO_GROWTH_REFS.length - 1];

  for (let i = 0; i < WHO_GROWTH_REFS.length - 1; i++) {
    if (clampedAge >= WHO_GROWTH_REFS[i].ageMonths && clampedAge <= WHO_GROWTH_REFS[i + 1].ageMonths) {
      lower = WHO_GROWTH_REFS[i];
      upper = WHO_GROWTH_REFS[i + 1];
      break;
    }
  }

  const range = upper.ageMonths - lower.ageMonths || 1;
  const factor = (clampedAge - lower.ageMonths) / range;

  const isBoy = gender === 'male';
  const medH = isBoy ? lower.boyMedianHeight + factor * (upper.boyMedianHeight - lower.boyMedianHeight) : lower.girlMedianHeight + factor * (upper.girlMedianHeight - lower.girlMedianHeight);
  const sdH = isBoy ? lower.boyHeightSD + factor * (upper.boyHeightSD - lower.boyHeightSD) : lower.girlHeightSD + factor * (upper.girlHeightSD - lower.girlHeightSD);

  const medW = isBoy ? lower.boyMedianWeight + factor * (upper.boyMedianWeight - lower.boyMedianWeight) : lower.girlMedianWeight + factor * (upper.girlMedianWeight - lower.girlMedianWeight);
  const sdW = isBoy ? lower.boyWeightSD + factor * (upper.boyWeightSD - lower.boyWeightSD) : lower.girlWeightSD + factor * (upper.girlWeightSD - lower.girlWeightSD);

  return { medH, sdH, medW, sdW };
}

// Convert Z-score to standard normal cumulative percentile
function zScoreToPercentile(z: number): number {
  if (z < -3) return 0.1;
  if (z > 3) return 99.9;
  // Approximation of standard normal CDF
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return Math.round((z > 0 ? 1 - prob : prob) * 1000) / 10;
}

export function calculateWHOGrowth(
  ageMonths: number,
  gender: 'male' | 'female',
  heightCm: number,
  weightKg: number
): WHOGrowthStandardCalculation {
  const { medH, sdH, medW, sdW } = getInterpolatedNorm(ageMonths, gender);

  const heightZScore = Number(((heightCm - medH) / sdH).toFixed(2));
  const weightZScore = Number(((weightKg - medW) / sdW).toFixed(2));

  // Height Status per Kemenkes / WHO
  let heightStatus: WHOGrowthStandardCalculation['heightStatus'] = 'Normal';
  if (heightZScore < -3) {
    heightStatus = 'Sangat Pendek (Severely Stunted)';
  } else if (heightZScore < -2) {
    heightStatus = 'Pendek (Stunted)';
  } else if (heightZScore > 3) {
    heightStatus = 'Tinggi';
  } else {
    heightStatus = 'Normal';
  }

  // Weight Status per Kemenkes / WHO
  let weightStatus: WHOGrowthStandardCalculation['weightStatus'] = 'Normal';
  if (weightZScore < -3) {
    weightStatus = 'Sangat Kurang';
  } else if (weightZScore < -2) {
    weightStatus = 'Kurang (Underweight)';
  } else if (weightZScore > 1) {
    weightStatus = 'Berisiko Lebih';
  } else {
    weightStatus = 'Normal';
  }

  // BMI (Body Mass Index) = weight in kg / (height in meters)^2
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? Number((weightKg / (heightM * heightM)).toFixed(1)) : 0;

  // Approximate BMI standard for children (median ~15-16, SD ~1.2)
  const medianBMI = 15.6;
  const sdBMI = 1.3;
  const bmiZScore = Number(((bmi - medianBMI) / sdBMI).toFixed(2));

  let bmiStatus: WHOGrowthStandardCalculation['bmiStatus'] = 'Gizi Baik (Normal)';
  if (bmiZScore < -3) {
    bmiStatus = 'Gizi Buruk';
  } else if (bmiZScore < -2) {
    bmiStatus = 'Gizi Kurang (Wasted)';
  } else if (bmiZScore > 2) {
    bmiStatus = 'Obesitas';
  } else if (bmiZScore > 1) {
    bmiStatus = 'Berisiko Lebih';
  } else {
    bmiStatus = 'Gizi Baik (Normal)';
  }

  const isAbnormal = heightZScore < -2 || weightZScore < -2 || bmiZScore < -2 || bmiZScore > 2;

  let deviationDescription = 'Pertumbuhan anak berada dalam batas normal standar WHO/Kemenkes.';
  if (heightZScore < -2 && weightZScore < -2) {
    deviationDescription = 'Anak terindikasi Stunting (tinggi badan di bawah -2 SD) disertai Berat Badan Kurang (Underweight). Diperlukan intervensi protein hewani kejar tumbuh.';
  } else if (heightZScore < -2) {
    deviationDescription = 'Tinggi badan anak berada di bawah kurva rata-rata (Stunting / Perawakan Pendek). Nutrisi mineral seperti kalsium, zat besi, zinc, dan protein sangat krusial.';
  } else if (weightZScore < -2) {
    deviationDescription = 'Berat badan anak di bawah garis normal (Underweight/Gizi Kurang). Asupan padat kalori dan protein hewani perlu ditingkatkan segera.';
  } else if (bmiZScore > 2) {
    deviationDescription = 'Berat badan anak melebihi kurva rata-rata proporsi tubuh (Berisiko Lebih / Obesitas). Pengaturan porsi seimbang dan aktivitas fisik dianjurkan.';
  }

  return {
    heightZScore,
    heightStatus,
    heightPercentile: zScoreToPercentile(heightZScore),
    weightZScore,
    weightStatus,
    weightPercentile: zScoreToPercentile(weightZScore),
    bmi,
    bmiZScore,
    bmiStatus,
    isAbnormal,
    deviationDescription,
    idealWeightRange: {
      min: Number((medW - 2 * sdW).toFixed(1)),
      max: Number((medW + 1 * sdW).toFixed(1)),
    },
    idealHeightRange: {
      min: Number((medH - 2 * sdH).toFixed(1)),
      max: Number((medH + 2 * sdH).toFixed(1)),
    },
  };
}
