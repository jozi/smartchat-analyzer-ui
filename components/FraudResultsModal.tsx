'use client';

import { useState, useEffect } from 'react';

interface FraudCase {
  user_id: number;
  entity_id: number;
  conversation_id: number;
  reason: string;
  score: number;
  suspicious_messages: Array<{
    message: string;
    created_at: string;
    patterns_found: number;
  }>;
}

interface FraudResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    status: string;
    message: string;
    stats: {
      total_reports: number;
      analyzed: number;
      fraud_detected: number;
      detection_rate: number;
    };
    fraud_cases: FraudCase[];
  } | null;
}

export default function FraudResultsModal({ isOpen, onClose, results }: FraudResultsModalProps) {
  if (!isOpen || !results) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🚨 نتایج تحلیل کلاهبرداری</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-800">{results.stats.total_reports}</div>
              <div className="text-sm text-gray-600 mt-1">کل گزارش‌ها</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{results.stats.analyzed}</div>
              <div className="text-sm text-gray-600 mt-1">تحلیل شده</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{results.stats.fraud_detected}</div>
              <div className="text-sm text-gray-600 mt-1">کلاهبرداری تشخیص داده شده</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{results.stats.detection_rate}%</div>
              <div className="text-sm text-gray-600 mt-1">نرخ تشخیص</div>
            </div>
          </div>
        </div>

        {/* Fraud Cases */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
          <h3 className="text-lg font-semibold mb-4">موارد کلاهبرداری تشخیص داده شده:</h3>
          
          {results.fraud_cases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>هیچ موردی از کلاهبرداری تشخیص داده نشد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.fraud_cases.map((fraudCase, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-sm text-gray-600">گزارش‌دهنده:</span>
                      <span className="ml-2 font-medium">{fraudCase.user_id}</span>
                      <span className="mx-2">→</span>
                      <span className="text-sm text-gray-600">متهم:</span>
                      <span className="ml-2 font-medium text-red-600">{fraudCase.entity_id}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">امتیاز خطر:</span>
                      <span className={`px-2 py-1 rounded text-white text-sm ${
                        fraudCase.score >= 8 ? 'bg-red-600' :
                        fraudCase.score >= 5 ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }`}>
                        {fraudCase.score}/10
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">دلیل:</p>
                    <p className="text-sm text-gray-800">{fraudCase.reason}</p>
                  </div>

                  {fraudCase.suspicious_messages && fraudCase.suspicious_messages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">پیام‌های مشکوک:</p>
                      <div className="space-y-2">
                        {fraudCase.suspicious_messages.map((msg, msgIndex) => (
                          <div key={msgIndex} className="bg-white rounded p-3 text-sm">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-xs text-gray-500">{msg.created_at}</span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                {msg.patterns_found} کلمه مشکوک
                              </span>
                            </div>
                            <p className="text-gray-700 line-clamp-2">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {results.message}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}