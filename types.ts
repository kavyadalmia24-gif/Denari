
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CALCULATORS = 'CALCULATORS',
  QUIZ = 'QUIZ',
  LEARN = 'LEARN',
  ADVISOR = 'ADVISOR',
  MARKET = 'MARKET',
}

export interface PortfolioItem {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

export interface UserStats {
  xp: number;
  lessonsCompleted: number;
  quizScore: number;
  completedChapterIds?: string[];
  walletBalance: number;
  holdings: PortfolioItem[];
  watchlist: string[];
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  history: { time: string; price: number }[];
  category: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface CalculationResult {
  investedAmount: number;
  totalInterest: number;
  totalValue: number;
  monthlyEMI?: number;
  breakdown: Array<{ year: number; balance: number; invested: number }>;
  chartData?: Array<{ name: string; value: number; color: string }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GeneratedLessonData {
  title: string;
  content: string;
  quiz: QuizQuestion[];
  simulator?: 'SIP' | 'LUMPSUM' | 'EMI' | 'null' | null;
}
