export type FilterType = 'all' | 'wholesale' | 'export' | 'exit' | 'price_negotiation' | 'fraud' | 'combined';

export interface Stats {
  totalAnalyzedCount: number;
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
  fraudDetected: number;
  fraudAnalyses: number;
  fraudDetectionRate: number;
}

export interface AnalysisResult {
  id: number;
  stored_chat_id: number;
  conversation_id: string;
  vendor_user: string;
  customer_user: string;
  trigger_message: string;
  is_wholesale: boolean;
  wholesale_score: number;
  is_export: boolean;
  export_score: number;
  is_exit: boolean;
  exit_score: number;
  is_price_negotiation: boolean;
  price_negotiation_score: number;
  is_fraud: boolean;
  fraud_score: number;
  gpt_response?: string;
  analyzed_at: string;
  human_feedback_confirms_gpt?: boolean;
  human_feedback_reason?: string;
}

export interface DashboardData {
  stats: Stats;
  totalStoredChats: number;
  unanalyzedChats: number;
  results: AnalysisResult[];
  currentPage: number;
  totalPages: number;
  totalFilteredResults: number;
}

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  created_at: string;
}

export interface Conversation {
  success: boolean;
  stored_chat_id: number;
  conversation_id: string;
  messages: Message[];
  messages_count: number;
  first_user: string;
  second_user: string;
  vendor_user: string;
  customer_user: string;
  is_user_one_vendor: boolean;
  is_user_two_vendor: boolean;
  trigger_message: string;
}