export type FilterType = 'all' | 'wholesale' | 'export' | 'exit' | 'price_negotiation' | 'combined';

export interface Stats {
  wholesaleCount: number;
  exportCount: number;
  exitCount: number;
  priceNegotiationCount: number;
  combinedCount: number;
  wholesalePercentage: number;
  exportPercentage: number;
  exitPercentage: number;
  priceNegotiationPercentage: number;
  combinedPercentage: number;
  aiAccuracy: number;
}

export interface AnalysisResult {
  id: number;
  storedChatId: number;
  conversationId: string;
  triggeringMessage: string;
  isWholesaleDetectedByGpt: boolean;
  isExportDetectedByGpt: boolean;
  isExitDetectedByGpt: boolean;
  isPriceNegotiationDetectedByGpt: boolean;
  wholesaleDetectionScoreGpt: number;
  exportDetectionScoreGpt: number;
  exitDetectionScoreGpt: number;
  priceNegotiationScoreGpt: number;
  gptExplanation?: string;
  analyzedAt: string;
  humanFeedbackConfirmsGpt?: boolean;
  humanFeedbackReason?: string;
}

export interface DashboardData {
  stats: Stats;
  totalStoredChats: number;
  unanalyzedChats: number;
  results: AnalysisResult[];
  currentPage: number;
  totalPages: number;
}

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  createdAt: string;
}

export interface Conversation {
  success: boolean;
  storedChatId: number;
  conversationId: string;
  messages: Message[];
  messagesCount: number;
  firstUser: string;
  secondUser: string;
  vendorUser: string;
  customerUser: string;
  triggerMessage: string;
}