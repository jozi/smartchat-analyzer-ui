import { FilterType } from '@/lib/types';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  resultCount: number;
}

export default function FilterBar({ currentFilter, onFilterChange, resultCount }: FilterBarProps) {
  const filters: { value: FilterType; label: string; color: string }[] = [
    { value: 'all', label: 'همه', color: 'gray' },
    { value: 'wholesale', label: 'فقط عمده', color: 'blue' },
    { value: 'export', label: 'فقط صادراتی', color: 'green' },
    { value: 'exit', label: 'خروج از پلتفرم', color: 'red' },
    { value: 'price_negotiation', label: 'مذاکره قیمت', color: 'yellow' },
    { value: 'combined', label: 'ترکیبی', color: 'purple' },
  ];

  return (
    <div className="card mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentFilter === filter.value
                  ? `bg-${filter.color}-500 text-white`
                  : `bg-gray-100 text-gray-700 hover:bg-gray-200`
              }`}
            >
              {filter.label}
              {currentFilter === filter.value && ` (${resultCount})`}
            </button>
          ))}
        </div>
        <div className="text-lg font-semibold">
          <span className="text-gray-500">نتایج:</span>{' '}
          <span className="text-primary-600">{resultCount}</span>
        </div>
      </div>
    </div>
  );
}