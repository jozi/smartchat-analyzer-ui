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
                  {result.isWholesaleDetectedByGpt && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      📦 عمده ({result.wholesaleDetectionScoreGpt}/5)
                    </span>
                  )}
                  {result.isExportDetectedByGpt && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      🌍 صادراتی ({result.exportDetectionScoreGpt}/5)
                    </span>
                  )}
                  {result.isExitDetectedByGpt && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      🚪 خروج ({result.exitDetectionScoreGpt}/10)
                    </span>
                  )}
                  {result.isPriceNegotiationDetectedByGpt && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      🤝 مذاکره ({result.priceNegotiationScoreGpt}/10)
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-2">
                  <strong>پیام ماشه:</strong> {result.triggeringMessage}
                </p>
                {result.gptExplanation && (
                  <p className="text-sm text-gray-600">
                    <strong>توضیح AI:</strong> {result.gptExplanation}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedChatId(result.storedChatId)}
                className="btn btn-primary text-sm"
              >
                مشاهده گفتگو
              </button>
            </div>
            <div className="text-xs text-gray-500">
              شناسه گفتگو: {result.conversationId} | تحلیل شده در: {new Date(result.analyzedAt).toLocaleDateString('fa-IR')}
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