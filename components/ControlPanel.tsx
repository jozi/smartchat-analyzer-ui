'use client';

import { useState } from 'react';

interface ControlPanelProps {
  totalStoredChats: number;
  unanalyzedChats: number;
  onFetchChats: (limit: number) => Promise<void>;
  onAnalyzeChats: (limit: number) => Promise<void>;
  onResetAnalysis: () => Promise<void>;
}

export default function ControlPanel({
  totalStoredChats,
  unanalyzedChats,
  onFetchChats,
  onAnalyzeChats,
  onResetAnalysis,
}: ControlPanelProps) {
  const [fetchLimit, setFetchLimit] = useState(1000);
  const [analyzeLimit, setAnalyzeLimit] = useState(100);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);

  const handleFetch = async () => {
    setFetchLoading(true);
    try {
      await onFetchChats(fetchLimit);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzeLoading(true);
    try {
      await onAnalyzeChats(analyzeLimit);
    } finally {
      setAnalyzeLoading(false);
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">پنل کنترل</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Fetch Section */}
        <div className="border-r-0 md:border-r-2 border-gray-200 pr-0 md:pr-6">
          <h3 className="text-lg font-medium mb-3 text-primary-600">
            مرحله ۱: دریافت و ذخیره چت‌ها
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleFetch}
              disabled={fetchLoading}
              className="btn btn-primary"
            >
              {fetchLoading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  در حال دریافت...
                </>
              ) : (
                <>📥 دریافت چت‌ها</>
              )}
            </button>
            <input
              type="number"
              value={fetchLimit}
              onChange={(e) => setFetchLimit(Number(e.target.value))}
              min="1"
              max="500000"
              className="w-32 px-3 py-2 border rounded-lg"
              placeholder="تعداد"
            />
            <span className="text-sm text-gray-500">حداکثر ۵۰۰ هزار</span>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <strong>{totalStoredChats}</strong> چت ذخیره شده |{' '}
            <strong>{unanalyzedChats}</strong> آماده تحلیل
          </div>
        </div>

        {/* Analyze Section */}
        <div className="pl-0 md:pl-6">
          <h3 className="text-lg font-medium mb-3 text-success-600">
            مرحله ۲: تحلیل با هوش مصنوعی
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={analyzeLoading || unanalyzedChats === 0}
              className="btn btn-success"
            >
              {analyzeLoading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  در حال تحلیل...
                </>
              ) : (
                <>🧠 تحلیل چت‌ها</>
              )}
            </button>
            <input
              type="number"
              value={analyzeLimit}
              onChange={(e) => setAnalyzeLimit(Number(e.target.value))}
              min="1"
              max="1000"
              className="w-32 px-3 py-2 border rounded-lg"
              placeholder="تعداد"
            />
            <span className="text-sm text-gray-500">حداکثر ۱۰۰۰</span>
          </div>
          <div className="mt-3">
            <button
              onClick={onResetAnalysis}
              className="btn btn-warning text-sm"
            >
              🔄 ریست تحلیل‌ها
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}