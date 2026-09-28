export interface ChildProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ageYears: number;
  ageMonths: number;
  heightCm?: number;
  weightKg?: number;
  avatarColor?: string;
}

export interface ArtAnalysisResult {
  id: string;
  date: string;
  childId: string;
  summaryTitle: string;
  overallEmotionSummary: string;
  developmentalStage: string;
  dominantMood: string;
  emotionalScores: {
    joyScore: number;
    confidenceScore: number;
    calmnessScore: number;
    creativityScore: number;
    affectionNeedScore: number;
  };
  artAnalysis: {
    colorPsychology: string;
    strokeAndPressure: string;
    spatialComposition: string;
    symbolism: string;
  };
  facialExpression?: {
    detectedExpression: string;
    congruence: string;
  };
  recommendations: {
    parentValidationPhrase: string;
    conversationStarters: string[];
    bondingActivities: Array<{
      title: string;
      description: string;
    }>;
    emotionalRedFlags: string;
    isRedFlagPresent: boolean;
  };
  artImagePreview: string;
  expressionPhotoPreview?: string;
  activityNotes?: string;
}

export interface PeriodicInsightResult {
  periodSummary: string;
  trendClassification: string;
  keyMilestonesAchieved: string[];
  emotionalStrengths: string[];
  supportFocusAreas: string[];
  nextMonthActionPlan: Array<{
    week: string;
    focus: string;
    parentingStrategy: string;
  }>;
  encouragementMessage: string;
}

export interface KeyNutrient {
  name: string;
  role: string;
  bestFoods: string[];
}

export interface MealItem {
  menu: string;
  ingredients: string;
  nutritionHighlight?: string;
}

export interface NutritionAnalysisResult {
  childName: string;
  calculatedAt: string;
  anthropometryEvaluation: {
    heightStatus: string;
    weightStatus: string;
    wastingStatus: string;
    overallStatusHeadline: string;
    statusExplanation: string;
    isGrowthFaltering: boolean;
  };
  nutritionTargets: {
    estimatedDailyCalories: string;
    proteinGoalGrams: string;
    waterRequirement: string;
    keyNutrients: KeyNutrient[];
  };
  recommendedMealPlan: {
    breakfast: MealItem;
    morningSnack: MealItem;
    lunch: MealItem;
    afternoonSnack: MealItem;
    dinner: MealItem;
  };
  catchUpStrategies: string[];
  pickyEaterSolutions: string[];
  gutBrainConnection: string;
  pediatricReferralIndicators: string[];
  inputs: {
    ageMonths: number;
    heightCm: number;
    weightKg: number;
    gender: 'male' | 'female';
  };
}

export interface WHOGrowthStandardCalculation {
  heightZScore: number;
  heightStatus: 'Sangat Pendek (Severely Stunted)' | 'Pendek (Stunted)' | 'Normal' | 'Tinggi';
  heightPercentile: number;
  
  weightZScore: number;
  weightStatus: 'Sangat Kurang' | 'Kurang (Underweight)' | 'Normal' | 'Berisiko Lebih';
  weightPercentile: number;
  
  bmi: number;
  bmiZScore: number;
  bmiStatus: 'Gizi Buruk' | 'Gizi Kurang (Wasted)' | 'Gizi Baik (Normal)' | 'Berisiko Lebih' | 'Obesitas';
  
  isAbnormal: boolean;
  deviationDescription: string;
  idealWeightRange: { min: number; max: number };
  idealHeightRange: { min: number; max: number };
}
