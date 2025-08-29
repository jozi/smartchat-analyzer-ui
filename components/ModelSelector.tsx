'use client';

import { useState, useEffect } from 'react';

interface ModelInfo {
  name: string;
  description: string;
  max_tokens: number;
}

interface ModelSelectorProps {
  onModelChange?: (model: string) => void;
}

export default function ModelSelector({ onModelChange }: ModelSelectorProps) {
  const [currentModel, setCurrentModel] = useState<string>('gpt-4o-mini');
  const [availableModels, setAvailableModels] = useState<Record<string, ModelInfo>>({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchModelConfig();
  }, []);

  const fetchModelConfig = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/model-config');
      const data = await response.json();
      setCurrentModel(data.current_model);
      setAvailableModels(data.available_models);
    } catch (error) {
      console.error('Error fetching model config:', error);
    }
  };

  const handleModelChange = async (model: string) => {
    setLoading(true);
    setIsOpen(false);
    try {
      const response = await fetch('http://localhost:8000/api/model-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model }),
      });
      
      if (response.ok) {
        setCurrentModel(model);
        if (onModelChange) {
          onModelChange(model);
        }
      }
    } catch (error) {
      console.error('Error updating model:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModelIcon = (model: string) => {
    if (model.includes('5')) return '🚀';
    if (model.includes('mini')) return '⚡';
    return '🤖';
  };

  const getModelColor = (model: string) => {
    if (model.includes('5')) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (model.includes('mini')) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-700';
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="w-full bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:border-primary-300 transition-all duration-300 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${getModelColor(currentModel)} flex items-center justify-center text-white text-2xl shadow-lg`}>
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              ) : (
                getModelIcon(currentModel)
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">مدل هوش مصنوعی فعال</p>
              <h3 className="text-lg font-bold text-gray-800">
                {availableModels[currentModel]?.name || 'در حال بارگذاری...'}
              </h3>
              <p className="text-sm text-gray-600">
                {availableModels[currentModel]?.description}
              </p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="p-2">
            {Object.entries(availableModels).map(([key, info]) => (
              <button
                key={key}
                onClick={() => handleModelChange(key)}
                disabled={currentModel === key}
                className={`w-full text-right p-3 rounded-lg transition-all duration-200 ${
                  currentModel === key
                    ? 'bg-primary-50 border-2 border-primary-400'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${getModelColor(key)} flex items-center justify-center text-white text-xl shadow`}>
                    {getModelIcon(key)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800">{info.name}</h4>
                      {currentModel === key && (
                        <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                          فعال
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{info.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        حداکثر توکن: {info.max_tokens.toLocaleString()}
                      </span>
                      {key.includes('5') && (
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                          جدیدترین
                        </span>
                      )}
                      {key.includes('mini') && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          سریع‌ترین
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Performance Indicator */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">وضعیت: آماده</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">سرعت پردازش:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-1 h-3 rounded-full ${
                    (currentModel.includes('5') && i <= 5) ||
                    (currentModel.includes('mini') && i <= 4)
                      ? 'bg-primary-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}