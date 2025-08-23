'use client';

import { useState, useEffect, useRef } from 'react';
import { ApiService } from '@/lib/api';
import { Conversation } from '@/lib/types';

interface ConversationModalProps {
  storedChatId: number;
  onClose: () => void;
}

export default function ConversationModal({ storedChatId, onClose }: ConversationModalProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversation();
  }, [storedChatId]);

  useEffect(() => {
    // Scroll to bottom when messages load
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const fetchConversation = async () => {
    try {
      const data = await ApiService.getConversation(storedChatId);
      setConversation(data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    messages.forEach(msg => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    
    return groups;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold">گفتگوی #{storedChatId}</h2>
              {conversation && (
                <p className="text-xs opacity-90">
                  {conversation.vendorUser} و {conversation.customerUser}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Container with WhatsApp-like background */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4d4d4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">در حال بارگیری گفتگو...</p>
              </div>
            </div>
          ) : conversation?.success ? (
            <div className="space-y-4">
              {/* Trigger Message Badge */}
              {conversation.triggerMessage && (
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm shadow-sm">
                    <span className="font-medium">پیام ماشه:</span> {conversation.triggerMessage}
                  </div>
                </div>
              )}

              {/* Messages */}
              {(() => {
                const groupedMessages = groupMessagesByDate(conversation.messages);
                return Object.entries(groupedMessages).map(([dateKey, messages]) => (
                  <div key={dateKey}>
                    {/* Date Separator */}
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm">
                        {formatDate(messages[0].createdAt)}
                      </div>
                    </div>

                    {/* Messages for this date */}
                    {messages.map((msg, idx) => {
                      const isVendor = msg.sender === conversation.vendorUser;
                      
                      return (
                        <div
                          key={idx}
                          className={`flex mb-2 ${isVendor ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`
                              relative max-w-[70%] px-4 py-2 rounded-2xl shadow-sm
                              ${isVendor 
                                ? 'bg-[#dcf8c6] rounded-br-none' 
                                : 'bg-white rounded-bl-none'
                              }
                            `}
                          >
                            {/* Message sender name */}
                            <div className={`text-xs font-medium mb-1 ${isVendor ? 'text-green-700' : 'text-blue-700'}`}>
                              {isVendor ? 'فروشنده' : 'خریدار'}
                            </div>
                            
                            {/* Message text */}
                            <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                              {msg.message}
                            </div>
                            
                            {/* Message time */}
                            <div className="text-xs text-gray-500 mt-1 text-left">
                              {formatTime(msg.createdAt)}
                            </div>

                            {/* Message tail */}
                            <div 
                              className={`absolute top-0 w-0 h-0 ${
                                isVendor 
                                  ? 'right-[-8px] border-t-[15px] border-t-[#dcf8c6] border-l-[8px] border-l-transparent' 
                                  : 'left-[-8px] border-t-[15px] border-t-white border-r-[8px] border-r-transparent'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 font-medium">خطا در بارگیری گفتگو</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-4 py-3 border-t">
          <div className="flex items-center justify-between text-xs text-gray-600">
            {conversation && (
              <>
                <span>تعداد پیام‌ها: {conversation.messagesCount}</span>
                <span>شناسه گفتگو: {conversation.conversationId}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}