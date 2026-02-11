import type {
  GoalType,
  PriorJuzBand,
  ScaffoldingLevel,
  TajwidConfidence,
} from "@/lib/api";

export type AssessmentData = {
  timeBudget: 15 | 30 | 60 | 90 | null;
  experience: PriorJuzBand | null;
  fluency: number;
  tajweed: TajwidConfidence | null;
  goal: GoalType | null;
  hasTeacher: boolean | null;
  scaffolding: ScaffoldingLevel;
};
