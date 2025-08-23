import { Stats } from '@/lib/types';

interface StatsGridProps {
  stats: Stats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      {/* Wholesale */}
      <div className="stat-card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">سفارش عمده</p>
            <p className="text-2xl font-bold text-gray-900">{stats.wholesaleCount}</p>
            <p className="text-xs text-gray-500">{stats.wholesalePercentage}%</p>
          </div>
          <div className="text-3xl text-blue-500">📦</div>
        </div>
      </div>

      {/* Export */}
      <div className="stat-card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">سفارش صادراتی</p>
            <p className="text-2xl font-bold text-gray-900">{stats.exportCount}</p>
            <p className="text-xs text-gray-500">{stats.exportPercentage}%</p>
          </div>
          <div className="text-3xl text-green-500">🌍</div>
        </div>
      </div>

      {/* Exit */}
      <div className="stat-card bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">خروج از پلتفرم</p>
            <p className="text-2xl font-bold text-gray-900">{stats.exitCount}</p>
            <p className="text-xs text-gray-500">{stats.exitPercentage}%</p>
          </div>
          <div className="text-3xl text-red-500">🚪</div>
        </div>
      </div>

      {/* Price Negotiation */}
      <div className="stat-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">مذاکره قیمت</p>
            <p className="text-2xl font-bold text-gray-900">{stats.priceNegotiationCount}</p>
            <p className="text-xs text-gray-500">{stats.priceNegotiationPercentage}%</p>
          </div>
          <div className="text-3xl text-yellow-500">🤝</div>
        </div>
      </div>

      {/* Combined */}
      <div className="stat-card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">ترکیبی</p>
            <p className="text-2xl font-bold text-gray-900">{stats.combinedCount}</p>
            <p className="text-xs text-gray-500">{stats.combinedPercentage}%</p>
          </div>
          <div className="text-3xl text-purple-500">🚀</div>
        </div>
      </div>

      {/* Fraud Detection */}
      <div className="stat-card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">تشخیص کلاهبرداری</p>
            <p className="text-2xl font-bold text-gray-900">{stats.fraudDetected}</p>
            <p className="text-xs text-gray-500">{stats.fraudDetectionRate}%</p>
          </div>
          <div className="text-3xl text-orange-500">🛡️</div>
        </div>
      </div>
    </div>
  );
}