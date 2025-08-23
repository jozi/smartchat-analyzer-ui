'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/lib/types';
import ConversationModal from './ConversationModal';

interface ResultsListProps {
  results: AnalysisResult[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ResultsList({
  results,
  currentPage,
  totalPages,
  onPageChange,
}: ResultsListProps) {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  if (results.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">هیچ نتیجه‌ای یافت نشد</h3>
        <p className="text-gray-600">
          برای فیلتر انتخابی موردی با اطمینان بالا تشخیص داده نشده است.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {result.is_wholesale && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      📦 عمده ({result.wholesale_score}/5)
                    </span>
                  )}
                  {result.is_export && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      🌍 صادراتی ({result.export_score}/5)
                    </span>
                  )}
                  {result.is_exit && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      🚪 خروج ({result.exit_score}/10)
                    </span>
                  )}
                  {result.is_price_negotiation && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      🤝 مذاکره ({result.price_negotiation_score}/10)
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-2">
                  <strong>پیام ماشه:</strong> {result.trigger_message}
                </p>
                
                {/* GPT Analysis Details */}
                <div className="mt-3 space-y-2">
                  {result.is_wholesale && result.wholesale_score && (
                    <div className="text-sm bg-blue-50 p-2 rounded">
                      <strong className="text-blue-700">تحلیل عمده:</strong>
                      <span className="text-gray-700"> امتیاز {result.wholesale_score}/5</span>
                    </div>
                  )}
                  
                  {result.is_export && result.export_score && (
                    <div className="text-sm bg-green-50 p-2 rounded">
                      <strong className="text-green-700">تحلیل صادرات:</strong>
                      <span className="text-gray-700"> امتیاز {result.export_score}/5</span>
                    </div>
                  )}
                  
                  {result.is_exit && result.exit_score && (
                    <div className="text-sm bg-red-50 p-2 rounded">
                      <strong className="text-red-700">ریسک خروج:</strong>
                      <span className="text-gray-700"> امتیاز {result.exit_score}/10</span>
                    </div>
                  )}
                  
                  {result.is_price_negotiation && result.price_negotiation_score && (
                    <div className="text-sm bg-yellow-50 p-2 rounded">
                      <strong className="text-yellow-700">مذاکره قیمت:</strong>
                      <span className="text-gray-700"> امتیاز {result.price_negotiation_score}/10</span>
                    </div>
                  )}
                  
                  {result.gpt_response && (
                    <div className="text-sm text-gray-600 italic mt-2">
                      <strong>دلیل AI:</strong> {result.gpt_response}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedChatId(result.stored_chat_id)}
                className="btn btn-primary text-sm"
              >
                مشاهده گفتگو
              </button>
            </div>
            <div className="text-xs text-gray-500">
              شناسه گفتگو: {result.conversation_id} | تحلیل شده در: {new Date(result.analyzed_at).toLocaleDateString('fa-IR')}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-primary disabled:opacity-50"
          >
            قبلی
          </button>
          <span className="px-4 py-2">
            صفحه {currentPage} از {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-primary disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      )}

      {/* Conversation Modal */}
      {selectedChatId && (
        <ConversationModal
          storedChatId={selectedChatId}
          onClose={() => setSelectedChatId(null)}
        />
      )}
    </>
  );
}