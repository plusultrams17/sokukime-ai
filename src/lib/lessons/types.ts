export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Lesson {
  slug: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  levelLabel: string;
  order: number;
  description: string;
  theory: string;
  examples: string;
  quiz: QuizQuestion[];
  practicePrompt: string;
  objectives: string[];
}
