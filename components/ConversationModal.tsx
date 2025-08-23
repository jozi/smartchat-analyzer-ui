'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/lib/api';
import { Conversation } from '@/lib/types';

interface ConversationModalProps {
  storedChatId: number;
  onClose: () => void;
}

export default function ConversationModal({ storedChatId, onClose }: ConversationModalProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversation();
  }, [storedChatId]);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">گفتگوی {storedChatId}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4">در حال بارگیری گفتگو...</p>
            </div>
          ) : conversation?.success ? (
            <div className="space-y-4">
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-600">پیام ماشه:</p>
                <p className="font-medium">{conversation.triggerMessage}</p>
              </div>

              <div className="space-y-2">
                {conversation.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.sender === conversation.vendorUser
                        ? 'bg-blue-50 ml-auto max-w-[70%]'
                        : 'bg-gray-50 mr-auto max-w-[70%]'
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {msg.sender}
                    </div>
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleString('fa-IR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-500">
              خطا در بارگیری گفتگو
            </div>
          )}
        </div>
      </div>
    </div>
  );
}