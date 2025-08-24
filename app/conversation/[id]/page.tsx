'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApiService } from '@/lib/api';
import { FlaggedMessageDetail } from '@/lib/types';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  created_at: string;
}

interface ConversationData {
  stored_chat_id: number;
  conversation_id: string;
  trigger_message_id: string;
  trigger_message: string;
  messages: Message[];
  analysis: {
    is_exit_detected_by_gpt: boolean;
    exit_detection_score_gpt: number;
    exit_detection_reason_gpt: string;
    is_wholesale_detected_by_gpt: boolean;
    wholesale_detection_score_gpt: number;
    wholesale_detection_reason_gpt: string;
    is_export_detected_by_gpt: boolean;
    export_detection_score_gpt: number;
    export_detection_reason_gpt: string;
    is_price_negotiation_detected_by_gpt: boolean;
    price_negotiation_intensity: string;
    price_negotiation_reason_gpt: string;
    flagged_message_ids: string[];
    flagged_messages_details: FlaggedMessageDetail[];
    analyzed_at: string;
  };
}

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversationDetail();
  }, [params.id]);

  const fetchConversationDetail = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getConversationDetail(Number(params.id));
      setConversation(data);
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setError('خطا در بارگذاری گفتگو');
    } finally {
      setLoading(false);
    }
  };

  const isMessageFlagged = (messageId: string): boolean => {
    return conversation?.analysis.flagged_message_ids?.includes(messageId) || false;
  };

  const getMessageFlagDetails = (messageId: string): FlaggedMessageDetail | undefined => {
    return conversation?.analysis.flagged_messages_details?.find(
      detail => detail.msg_id === messageId
    );
  };

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-pulse');
      setTimeout(() => element.classList.remove('highlight-pulse'), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری گفتگو...</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'گفتگو یافت نشد'}</p>
          <button onClick={() => router.back()} className="btn btn-primary">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">جزئیات گفتگو</h1>
              <p className="text-gray-600">
                شناسه گفتگو: {conversation.conversation_id} | 
                شناسه چت: {conversation.stored_chat_id}
              </p>
            </div>
            <button onClick={() => router.back()} className="btn btn-secondary">
              بازگشت
            </button>
          </div>

          {/* Detection Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {conversation.analysis.is_exit_detected_by_gpt && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-700 mb-2">🚪 خروج از پلتفرم</h3>
                <p className="text-2xl font-bold text-red-600">
                  {conversation.analysis.exit_detection_score_gpt}/10
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {conversation.analysis.exit_detection_reason_gpt}
                </p>
              </div>
            )}
            
            {conversation.analysis.is_wholesale_detected_by_gpt && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-700 mb-2">📦 سفارش عمده</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {conversation.analysis.wholesale_detection_score_gpt}/5
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {conversation.analysis.wholesale_detection_reason_gpt}
                </p>
              </div>
            )}
            
            {conversation.analysis.is_export_detected_by_gpt && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-700 mb-2">🌍 صادرات</h3>
                <p className="text-2xl font-bold text-green-600">
                  {conversation.analysis.export_detection_score_gpt}/5
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {conversation.analysis.export_detection_reason_gpt}
                </p>
              </div>
            )}
            
            {conversation.analysis.is_price_negotiation_detected_by_gpt && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-700 mb-2">💰 مذاکره قیمت</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {conversation.analysis.price_negotiation_intensity}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {conversation.analysis.price_negotiation_reason_gpt}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Flagged Messages Summary */}
        {conversation.analysis.flagged_message_ids?.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-4">
              🚨 پیام‌های تشخیص داده شده توسط هوش مصنوعی ({conversation.analysis.flagged_message_ids.length} پیام)
            </h2>
            <div className="space-y-2">
              {conversation.analysis.flagged_messages_details?.map((detail) => (
                <div
                  key={detail.msg_id}
                  className="bg-white p-3 rounded-lg border-l-4 border-yellow-500 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => scrollToMessage(detail.msg_id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-sm text-gray-600">پیام #{detail.msg_id}</span>
                      <span className="mr-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        {detail.detection_type}
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      مشاهده ←
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {detail.reason || detail.indicator || detail.negotiation_text}
                  </p>
                  {detail.fraud_type && (
                    <span className="text-xs text-gray-500">نوع: {detail.fraud_type}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversation Messages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">گفتگو</h2>
          
          {/* Trigger Message Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-700">
              <strong>پیام ماشه (ID: {conversation.trigger_message_id}):</strong>
            </p>
            <p className="text-gray-700 mt-1">{conversation.trigger_message}</p>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
            {conversation.messages.map((message) => {
              const isFlagged = isMessageFlagged(message.id);
              const flagDetails = getMessageFlagDetails(message.id);
              const isTrigger = message.id === conversation.trigger_message_id;

              return (
                <div
                  key={message.id}
                  id={`message-${message.id}`}
                  className={`
                    flex ${message.sender === conversation.messages[0]?.sender ? 'justify-end' : 'justify-start'}
                    ${isFlagged ? 'flagged-message' : ''}
                    ${isTrigger ? 'trigger-message' : ''}
                  `}
                >
                  <div className={`
                    max-w-[70%] rounded-lg p-4 relative
                    ${message.sender === conversation.messages[0]?.sender 
                      ? 'bg-blue-100 text-right' 
                      : 'bg-white text-right'}
                    ${isFlagged ? 'border-2 border-red-500 bg-red-50' : ''}
                    ${isTrigger ? 'border-2 border-blue-500' : ''}
                  `}>
                    {/* Message badges */}
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        ID: {message.id}
                      </span>
                      {isTrigger && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                          پیام ماشه
                        </span>
                      )}
                      {isFlagged && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                          مشکوک
                        </span>
                      )}
                    </div>

                    {/* Message content */}
                    <p className="text-gray-800">{message.message}</p>
                    
                    {/* Flag details */}
                    {isFlagged && flagDetails && (
                      <div className="mt-2 pt-2 border-t border-red-300">
                        <p className="text-xs text-red-700">
                          <strong>تشخیص AI:</strong> {flagDetails.reason || flagDetails.indicator}
                        </p>
                        {flagDetails.fraud_type && (
                          <p className="text-xs text-red-600">نوع: {flagDetails.fraud_type}</p>
                        )}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>فرستنده: {message.sender}</span>
                      <span>{new Date(message.created_at).toLocaleString('fa-IR')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .flagged-message {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }

        .highlight-pulse {
          animation: highlight 2s ease-out;
        }

        @keyframes highlight {
          0% {
            background-color: yellow;
          }
          100% {
            background-color: transparent;
          }
        }

        .trigger-message::before {
          content: '⚡';
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}