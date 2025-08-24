import { FilterType, Stats } from '@/lib/types';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  resultCount: number;
  totalFilteredResults?: number;
  stats?: Stats;
}

export default function FilterBar({ currentFilter, onFilterChange, resultCount, totalFilteredResults, stats }: FilterBarProps) {
  const filters: { 
    value: FilterType; 
    label: string; 
    bgColor: string; 
    activeColor: string;
    count?: number;
  }[] = [
    { 
      value: 'all', 
      label: 'همه', 
      bgColor: 'bg-gray-100 hover:bg-gray-200', 
      activeColor: 'bg-gray-600',
      count: stats?.totalAnalyzedCount // استفاده از تعداد کل رکوردهای تحلیل شده
    },
    { 
      value: 'wholesale', 
      label: 'فقط عمده', 
      bgColor: 'bg-blue-100 hover:bg-blue-200', 
      activeColor: 'bg-blue-600',
      count: stats?.wholesaleCount
    },
    { 
      value: 'export', 
      label: 'فقط صادراتی', 
      bgColor: 'bg-green-100 hover:bg-green-200', 
      activeColor: 'bg-green-600',
      count: stats?.exportCount
    },
    { 
      value: 'exit', 
      label: 'خروج از پلتفرم', 
      bgColor: 'bg-red-100 hover:bg-red-200', 
      activeColor: 'bg-red-600',
      count: stats?.exitCount
    },
    { 
      value: 'price_negotiation', 
      label: 'مذاکره قیمت', 
      bgColor: 'bg-yellow-100 hover:bg-yellow-200', 
      activeColor: 'bg-yellow-600',
      count: stats?.priceNegotiationCount
    },
    { 
      value: 'fraud', 
      label: '🚨 کلاهبرداری', 
      bgColor: 'bg-orange-100 hover:bg-orange-200', 
      activeColor: 'bg-orange-600',
      count: stats?.fraudDetected
    },
    { 
      value: 'combined', 
      label: 'ترکیبی', 
      bgColor: 'bg-purple-100 hover:bg-purple-200', 
      activeColor: 'bg-purple-600',
      count: stats?.combinedCount
    },
  ];

  return (
    <div className="card mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = currentFilter === filter.value;
            const displayCount = filter.count;
            
            return (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${isActive 
                    ? `${filter.activeColor} text-white shadow-lg` 
                    : `${filter.bgColor} text-gray-700`
                  }
                `}
              >
                {filter.label}
                {displayCount !== undefined && (
                  <span className={`ml-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    ({displayCount})
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="text-lg font-semibold">
          <span className="text-gray-500">نتایج فیلتر شده:</span>{' '}
          <span className="text-primary-600">{totalFilteredResults || resultCount}</span>
        </div>
      </div>
    </div>
  );
}