'use client';

import { useState, useEffect } from 'react';
import StatsGrid from '@/components/StatsGrid';
import ControlPanel from '@/components/ControlPanel';
import ResultsList from '@/components/ResultsList';
import FilterBar from '@/components/FilterBar';
import FraudResultsModal from '@/components/FraudResultsModal';
import { ApiService } from '@/lib/api';
import { DashboardData, FilterType } from '@/lib/types';

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [fraudResults, setFraudResults] = useState<any>(null);
  const [showFraudModal, setShowFraudModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [filter, page]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const dashboardData = await ApiService.getDashboard(page, 25, filter);
      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchChats = async (limit: number) => {
    try {
      await ApiService.fetchAndStoreChats(limit);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleAnalyzeChats = async (limit: number) => {
    try {
      await ApiService.analyzeStoredChats(limit);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error analyzing chats:', error);
    }
  };

  const handleResetAnalysis = async () => {
    if (confirm('آیا از ریست کردن تحلیل‌ها اطمینان دارید؟')) {
      try {
        await ApiService.resetAnalysis();
        await fetchDashboardData();
      } catch (error) {
        console.error('Error resetting analysis:', error);
      }
    }
  };

  const handleAnalyzeFraud = async (limit: number) => {
    try {
      const result = await ApiService.analyzeFraud(limit);
      setFraudResults(result);
      setShowFraudModal(true);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error analyzing fraud:', error);
      alert('خطا در تحلیل کلاهبرداری');
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگیری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            سیستم تشخیص انواع گفتگوی تجاری
          </h1>
          <p className="text-gray-600">
            تشخیص هوشمند سفارش‌های عمده، صادراتی، خروج از پلتفرم و مذاکره قیمت با قدرت هوش مصنوعی
          </p>
        </div>

        {/* Stats Grid */}
        {data && <StatsGrid stats={data.stats} />}

        {/* Control Panel */}
        <ControlPanel
          totalStoredChats={data?.totalStoredChats || 0}
          unanalyzedChats={data?.unanalyzedChats || 0}
          totalFlagged={data?.totalFlagged || 0}
          alreadyAnalyzed={data?.alreadyAnalyzed || 0}
          onFetchChats={handleFetchChats}
          onAnalyzeChats={handleAnalyzeChats}
          onResetAnalysis={handleResetAnalysis}
          onAnalyzeFraud={handleAnalyzeFraud}
        />

        {/* Filter Bar */}
        <FilterBar
          currentFilter={filter}
          onFilterChange={setFilter}
          resultCount={data?.results?.length || 0}
          totalFilteredResults={data?.totalFilteredResults}
          stats={data?.stats}
        />

        {/* Results List */}
        {data && (
          <ResultsList
            results={data.results}
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Fraud Results Modal */}
      <FraudResultsModal
        isOpen={showFraudModal}
        onClose={() => setShowFraudModal(false)}
        results={fraudResults}
      />
    </div>
  );
}