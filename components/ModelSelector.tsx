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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">مدل هوش مصنوعی</h3>
      <div className="flex items-center gap-3">
        <select
          value={currentModel}
          onChange={(e) => handleModelChange(e.target.value)}
          disabled={loading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {Object.entries(availableModels).map(([key, info]) => (
            <option key={key} value={key}>
              {info.name} - {info.description}
            </option>
          ))}
        </select>
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        مدل فعلی: <span className="font-medium">{availableModels[currentModel]?.name}</span>
      </p>
    </div>
  );
}